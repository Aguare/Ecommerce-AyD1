/** @format */

const getConnection = require("../../db/db.js");
require("dotenv").config();

const orderController = {};
/**
 * Save the order of the customer and save order_has_product
 * - The order is saved by the user id
 * - The order_has_product is saved by the order id and product id
 *total_taxes
 */

orderController.saveOrder = async (req, res) => {
	let conn;
	const {
		nit_bill,
		name_bill,
		address_bill,
		reference_address,
		isDelivery,
		delivery_cost,
		status,
		total_taxes,
		total,
		quantity_products,
		id_user,
		id_employee,
		id_branch,
	} = req.body;

	if (!nit_bill || !name_bill || !address_bill || !status || !total || !quantity_products || !id_user) {
		return res.status(400).send({ message: "Faltan campos por llenar" });
	}
	if (isDelivery === 1 && reference_address === null) {
		return res.status(400).send({ message: "Faltan campos por llenar" });
	}

	try {
		conn = await getConnection();
		await conn.beginTransaction();
		const queryTax = `SELECT key_value FROM company_settings WHERE key_name = 'company_taxes';`;

		const [taxResult] = await conn.query(queryTax);
		const taxPercentage = taxResult.key_value / 100;

		const queryOrder = `
			INSERT INTO orders 
			(nit_bill, name_bill, address_bill, reference_address, isDelivery, delivery_cost, 
			status, total_taxes, total, quantity_products, Fk_User, Fk_Employee_Shipped)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
		`;

		const resultOrder = await conn.query(queryOrder, [
			nit_bill,
			name_bill,
			address_bill,
			reference_address,
			isDelivery,
			delivery_cost,
			status,
			total * taxPercentage,
			total,
			quantity_products,
			id_user,
			id_employee,
		]);

		const queryCart = `SELECT * FROM shop_cart WHERE Fk_User = ?;`;
		const resultCart = await conn.query(queryCart, [id_user]);

		if (resultCart.length === 0) {
			await conn.rollback();
			return res.status(400).send({ message: "El carrito está vacío" });
		}

		const queryProduct = `SELECT price FROM product WHERE id = ?;`;

		for (let i = 0; i < resultCart.length; i++) {
			const resultProduct = await conn.query(queryProduct, [resultCart[i].FK_Product]);
			const { FK_Product: productId, quantity, total: totalProduct } = resultCart[i];

			const priceResult = await conn.query(queryProduct, [productId]);
			const price = priceResult.price;

			const taxes = price * taxPercentage;

			const queryOrderProduct = `
				INSERT INTO order_has_product 
				(quantity, price, taxes, total, FK_Order, FK_Product, FK_Branch) 
				VALUES (?, ?, ?, ?, ?, ?, ?);
			`;
			await conn.query(queryOrderProduct, [
				quantity,
				resultProduct[0].price,
				resultProduct[0].price * taxPercentage,
				resultProduct[0].price * quantity,
				resultOrder.insertId,
				productId,
				id_branch,
			]);
			const queryGetStock = `
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

			const resultGetStock = await conn.query(queryGetStock, [productId, productId, id_branch]);
			const newStock = resultGetStock[0].stock - quantity;

			const queryInsertNewStock = `
			INSERT INTO inventory (inflow, outflow, stock, description, FK_Product, FK_Branch, FK_User)
			VALUES (?, ?, ?, ?, ?, ?, ?);
		`;

			const resultUpdateStock = await conn.query(queryInsertNewStock, [
				0,
				quantity,
				newStock,
				"Venta",
				productId,
				id_branch,
				id_user,
			]);
			if (!resultUpdateStock) {
				await conn.rollback();
				return res.status(400).send({ message: "Error al actualizar el stock" });
			}
		}

		const deleteCart = `DELETE FROM shop_cart WHERE Fk_User = ?;`;
		await conn.query(deleteCart, [id_user]);

		await conn.commit();

		return res.status(200).send({
			message: "Orden guardada correctamente",
			data: resultOrder.insertId.toString(),
		});
	} catch (error) {
		console.log("error", error);
		if (conn) await conn.rollback();
		res.status(500).send({
			message: "Error al guardar la orden",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.end();
		}
	}
};

module.exports = orderController;
