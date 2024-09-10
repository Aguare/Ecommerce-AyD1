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
            SELECT pr.id, pr.name, pr.description, pr.price,
       (SELECT primg.image_path
        FROM product_image primg
        WHERE pr.id = primg.FK_Product
        ORDER BY primg.id ASC
        LIMIT 1) AS image_path,
       c.name AS category
FROM product pr
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
		res.status(500).send({ message: "Error al obtener los productos.", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getProducts = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const queryMoney = `
            SELECT pr.id, pr.name, pr.description, pr.price, b.name as brand, c.name AS category
        		FROM product pr
        		JOIN product_has_category phc ON pr.id = phc.FK_Product
        		JOIN category c ON phc.FK_Category = c.id
        		JOIN brand b ON pr.FK_Brand = b.id`;

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

productController.saveProduct = async (req, res) => {
	let connection;
	try {
		const { attributes, brand, category, description,  name, price } = req.body;

		
		
		if(!attributes || !brand || !category || !description || !name || !price){
			return res.status(400).send({message: 'Faltan campos por llenar'})
		}

		connection = await getConnection();
		await connection.beginTransaction();

		const queryProduct = `INSERT INTO product (name, description, price, FK_Brand) VALUES (?,?,?,?)`;
		const result = await connection.query(queryProduct, [name, description, price, brand]);
		const productId = Number(result.insertId);
		

		await connection.commit();

		const queryCategory = `INSERT INTO product_has_category (FK_Product, FK_Category) VALUES (?,?)`
		const resultCategory = await connection.query(queryCategory, [productId, category]);

		await connection.commit();

		const queryAttribute = `INSERT INTO attribute (name, description) VALUES (?,?)`
		const queryPhA = `INSERT INTO product_has_attribute (FK_Product, FK_Attribute) VALUES (?,?)`

		attributes.forEach(async attribute => {
			const r1 = await connection.query(queryAttribute, [attribute.attributeName, attribute.attributeValue]);
			const attributeId = Number(r1.insertId);
			await connection.commit();
			
			const r2 = await connection.query(queryPhA, [productId, attributeId]);
			await connection.commit();
		});

		res.status(200).send({ message: "Producto creado exitosamente", productId });
	} catch (error) {
		await connection.rollback();
		res.status(500).send({ message: "Error al guardar producto", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getProductById = async (req, res) => {
	let connection;
	try {

		const {id} = req.query;
		if(!id){
			return res.status(400).send({message: 'El id es obligatorio'})
		}

		connection = await getConnection();

		const queryMoney = `
            SELECT p.id, p.name, p.description, p.price, b.id as brandId, b.name as brand, c.id as categoryId, c.name as category FROM product p
    			LEFT JOIN brand b ON p.FK_Brand = b.id
    			LEFT JOIN product_has_category phc ON p.id = phc.FK_Product
    			LEFT JOIN category c ON phc.FK_Category = c.id
    			WHERE p.id = ?`;

		const productData = await connection.query(queryMoney, id);
		res.status(200).send({productData: productData[0]});
	} catch (error) {
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

module.exports = productController;
