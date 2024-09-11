/** @format */

const getConnection = require("../../db/db.js");

const productController = {};

productController.getProductsByCategory = async (req, res) => {
	let connection;
	try {
		const { category, id_branch } = req.body;
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

		const result = await connection.query(queryMoney, [id_branch, category]);
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
		const { id } = req.params;

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

		const result = await connection.query(queryMoney, [id]);
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

		const { id } = req.params;
		const queryMoney = `
            SELECT pr.id, pr.name, pr.description, pr.price, primg.image_path, c.name as category from product pr
                JOIN product_image primg ON pr.id = primg.FK_Product
                JOIN product_has_category phc ON pr.id = phc.FK_Product
                JOIN category c ON phc.FK_Category = c.id 
                LIMIT 15`;

		const result = await connection.query(queryMoney, [id]);
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

productController.getProductDetailById = async (req, res) => {
	let connection;
	try {

		const {id} = req.params;
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

		const queryAttribute = `
			SELECT a.name, a.description FROM attribute a
    			JOIN product_has_attribute pha ON a.id = pha.FK_Attribute
    			WHERE pha.FK_Product = ?;
		`;

		const productAttributes = await connection.query(queryAttribute, id);

		const queryImage = `
			SELECT id, image_path FROM product_image WHERE FK_Product = ?
		`;

		const productImages = await connection.query(queryImage, id);

		console.log(productImages);

		productData[0].attributes = productAttributes;
		productData[0].images = productImages.map((image) => image.image_path);

		res.status(200).send(productData[0]);

	} catch (error) {
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.updateDataProduct = async (req, res) => {
	let connection;
	try {

		const {id, name, description, price, brand, category} = req.body;
		if(!id, !name || !description || !price || !brand || !category){
			return res.status(400).send({message: 'Hacen falta campos para modificar el producto'})
		}

		connection = await getConnection();

		await connection.beginTransaction();

		const queryMoney = `
			UPDATE product SET name = ?, description = ?, price = ?,  FK_Brand = ? WHERE id = ?
		`;

		const update1 = await connection.query(queryMoney, [name, description, price, brand, id])
		await connection.commit();

		const queryCategory  = `
			UPDATE product_has_category SET FK_Category = ? WHERE FK_Product = ?
		`
		const update2 = await connection.query(queryCategory, [category, id]);

		await connection.commit();

		res.status(200).send({message: 'Producto actualizado correctamente'});
	} catch (error) {
		await connection.rollback();
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.updateAttributesProduct = async (req, res) => {
	let connection;
	try {

		const {id, attributes} = req.body;
		if(!id || !attributes ){
			return res.status(400).send({message: 'Hacen falta campos para modificar el producto'})
		}

		connection = await getConnection();
		await connection.beginTransaction()

		const queryGetIdsAttributes = `
			SELECT a.id FROM attribute a
    			JOIN product_has_attribute pha ON a.id = pha.FK_Attribute
    			WHERE pha.FK_Product = ?;
		`

		idsAttributes = await connection.query(queryGetIdsAttributes, id);

		const queryDeletePhA = `
			DELETE FROM product_has_attribute WHERE FK_Product = ?;
		`;

		const resultDeletePhA = await connection.query(queryDeletePhA, id);

		await connection.commit();
		
		const queryDeleteAttribute = `DELETE FROM attribute WHERE id = ?`

		idsAttributes.forEach(async (value)=>{
			const resultDelete = await connection.query(queryDeleteAttribute, value.id);
			
		});

		await connection.commit();
		
		const queryAttribute = `INSERT INTO attribute (name, description) VALUES (?,?)`
		const queryPhA = `INSERT INTO product_has_attribute (FK_Product, FK_Attribute) VALUES (?,?)`

		attributes.forEach(async attribute => {
			const r1 = await connection.query(queryAttribute, [attribute.name, attribute.description]);
			const attributeId = Number(r1.insertId);
			await connection.commit();
			
			const r2 = await connection.query(queryPhA, [id, attributeId]);
			await connection.commit();
		});
		
		await connection.commit();

		res.status(200).send({message: 'Producto actualizado correctamente'});
	} catch (error) {
		await connection.rollback();
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getProductById = async (req, res) => {
	let connection;
	try {
		const { id, id_branch } = req.params;
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

productController.getBranchesWithProduct = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const queryProduct = `
		SELECT b.id as id, b.name as name, b.address as address
        FROM inventory i1
        JOIN (
            SELECT FK_Branch, MAX(created_at) AS MaxDate
            FROM inventory
            GROUP BY FK_Branch
        ) i2 ON i1.FK_Branch = i2.FK_Branch AND i1.created_at = i2.MaxDate
        JOIN branch b ON i1.FK_Branch = b.id
        WHERE i1.stock != 0;
		`;

		const resultProduct = await connection.query(queryProduct);
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
