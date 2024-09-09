/** @format */

const getConnection = require("../../db/db.js");

const productController = {};

productController.getProductsByCategory = async (req, res) => {
	let connection;
	try {
		const { category } = req.body;
		connection = await getConnection();

		if (!category) {
			return res.status(400).send({ message: "La categoria es requerida" });
		}

		const queryMoney = `
            SELECT pr.id, pr.name, pr.description, pr.price, primg.image_path, c.name as category from product pr
                JOIN product_image primg ON pr.id = primg.FK_Product
                JOIN product_has_category phc ON pr.id = phc.FK_Product
                JOIN category c ON phc.FK_Category = c.id
                WHERE c.name = ?`;

		const result = await connection.query(queryMoney, [category]);
		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos.", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getProductsWithCategory = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const queryMoney = `
            SELECT pr.id, pr.name, pr.description, pr.price, primg.image_path, c.name as category from product pr
                JOIN product_image primg ON pr.id = primg.FK_Product
                JOIN product_has_category phc ON pr.id = phc.FK_Product
                JOIN category c ON phc.FK_Category = c.id`;

		const result = await connection.query(queryMoney);
		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos.", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getProductsForCart = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const queryMoney = `
            SELECT pr.id, pr.name, pr.description, pr.price, primg.image_path, c.name as category from product pr
                JOIN product_image primg ON pr.id = primg.FK_Product
                JOIN product_has_category phc ON pr.id = phc.FK_Product
                JOIN category c ON phc.FK_Category = c.id 
                LIMIT 15`;

		const result = await connection.query(queryMoney);
		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos. 2", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getProductById = async (req, res) => {
	let connection;
	try {
		const { id } = req.params;
		connection = await getConnection();

		if (!id) {
			return res.status(400).send({ message: "El id es requerido" });
		}

		const queryProduct = `
			SELECT pr.id, pr.name, pr.description, pr.isAvailable, pr.price, c.name as category from product pr
				JOIN product_has_category phc ON pr.id = phc.FK_Product
				JOIN category c ON phc.FK_Category = c.id
				WHERE pr.id = ?`;

		const resultProduct = await connection.query(queryProduct, [id]);

		const queryImages = `
			SELECT image_path from product_image WHERE FK_Product = ?`;

		const resultImages = await connection.query(queryImages, [id]);
		resultProduct[0].images = resultImages.map((image) => image.image_path);

		const queryAttribute = `
			SELECT a.name, a.description from attribute a
			INNER JOIN product_has_attribute pha ON a.id = pha.FK_Attribute
			WHERE pha.FK_Product = ?`;

		const resultAttribute = await connection.query(queryAttribute, [id]);
		resultProduct[0].attributes = resultAttribute;
		res.status(200).send(resultProduct[0]);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos.", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getStockProductById = async (req, res) => {
	let connection;
	try {
		const { id } = req.params;
		connection = await getConnection();

		if (!id) {
			return res.status(400).send({ message: "El id es requerido" });
		}

		const queryProduct = `
		SELECT b.id as id, b.name as name, b.address as address, i1.stock as stock
		FROM inventory i1
		JOIN (
			SELECT FK_Branch, MAX(created_at) AS MaxDate
			FROM inventory
			WHERE FK_Product = ?
			GROUP BY FK_Branch
		) i2 ON i1.FK_Branch = i2.FK_Branch AND i1.created_at = i2.MaxDate
		JOIN branch b ON i1.FK_Branch = b.id
		WHERE i1.FK_Product = ?;
		`;

		const resultProduct = await connection.query(queryProduct, [id, id]);
		res.status(200).send(resultProduct);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos.", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

module.exports = productController;
