/** @format */

const getConnection = require("../../db/db.js");

const orderController = {};

orderController.getAllOrders = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();
		const query = `
        SELECT o.*, b.name as branch_name, b.id as branch_id FROM orders o
        JOIN order_has_product ohp ON o.id = ohp.FK_Order
        JOIN branch b ON ohp.FK_Branch = b.id
        GROUP BY o.created_at ORDER by o.created_at DESC;`;
		const result = await conn.query(query);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({ message: "No se pudieron obtener los pedidos." });
	} finally {
		if (conn) conn.end();
	}
};

orderController.getOrderStatus = async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const query = `
        SELECT status FROM orders GROUP BY status;
        `;
        const result = await conn.query(query);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "No se pudieron obtener los estados de los pedidos." });
    } finally {
        if (conn) conn.end();
    }
};

orderController.getProductsByOrderId = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();
		const { id } = req.params;
		const limit = req.params.limit ? parseInt(req.params.limit) : 10;
		const offset = req.params.offset ? parseInt(req.params.offset) : 0;
		const query = `
        SELECT p.id, p.name, ohp.taxes, ohp.total, ohp.price, ohp.quantity, b.name as branch_name FROM orders o
        JOIN order_has_product ohp ON o.id = ohp.FK_Order
        JOIN product p ON ohp.FK_Product = p.id
        JOIN branch b ON ohp.FK_Branch = b.id
        WHERE o.id = ? LIMIT ? OFFSET ?;
        `;
		const result = await conn.query(query, [id, limit, offset]);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({ message: err.message });
	} finally {
		if (conn) conn.end();
	}
};

orderController.getOrdersByUserId = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();
		const { id } = req.params;
		const query = `
		SELECT o.*, b.id as branch_id FROM orders o
		JOIN order_has_product ohp ON o.id = ohp.FK_Order
		JOIN branch b ON ohp.FK_Branch = b.id
		WHERE o.FK_User = ? GROUP BY o.created_at ORDER by o.created_at DESC;
		`;
		const result = await conn.query(query, [id]);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({ message: "No se pudieron obtener los pedidos." });
	} finally {
		if (conn) conn.end();
	}
}

orderController.updateOrderStatus = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();
		await conn.beginTransaction();
		const { id } = req.params;
		const { status, user_id } = req.body;
		const query = `
		UPDATE orders SET status = ? WHERE id = ?;
		`;

		const updateResult = await conn.query(query, [status, id]);
		if(status === 'CANCELED') {
			// add products to stock again
			const queryProducts = `
			SELECT FK_Product as product_id, quantity, FK_Branch as branch_id FROM order_has_product WHERE FK_Order = ?;`;
			const products = await conn.query(queryProducts, [id]);
			for(let i = 0; i < products.length; i++) {
				const queryStock = `
				SELECT
                i.FK_Product,
                SUM(i.stock) AS stock
				FROM inventory i
				INNER JOIN (
					SELECT FK_Product, FK_Branch, MAX(created_at) AS latest_entry
					FROM inventory
					WHERE FK_Product = ?
					GROUP BY FK_Product, FK_Branch
				) latest_inventory ON i.FK_Product = latest_inventory.FK_Product
								AND i.FK_Branch = latest_inventory.FK_Branch
								AND i.created_at = latest_inventory.latest_entry
				WHERE i.FK_Product = ? AND i.FK_Branch = ?
				GROUP BY i.FK_Product;
				`;
				const stockResult = await conn.query(queryStock, [products[i].product_id, products[i].product_id, products[i].branch_id]);
				const newStock = parseInt(stockResult[0].stock) + parseInt(products[i].quantity);

				const queryInsertInventory = `
				INSERT INTO inventory (inflow, outflow, stock, description, FK_Product, FK_Branch, FK_User) 
				VALUES (?, ?, ?, ?, ?, ?, ?);
				`;
				const insertResult = await conn.query(queryInsertInventory, [products[i].quantity, 0, newStock, 'Pedido cancelado', products[i].product_id, products[i].branch_id, user_id]);
			}
		}


		await conn.commit();
		res.status(200).json({ message: "Estado actualizado." });
	} catch (err) {
		res.status(500).json({ message: "No se pudo actualizar el estado del pedido." });
		await conn.rollback();
	} finally {
		if (conn) conn.end();
	}
}

module.exports = orderController;
