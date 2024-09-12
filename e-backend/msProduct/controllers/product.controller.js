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
			connection.release();
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
			connection.release();
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
			connection.release();
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
			connection.release();
		}
	}
};

productController.saveProduct = async (req, res) => {
	let connection;
	try {
		const { attributes, brand, category, description, name, price } = req.body;

		if (!attributes || !brand || !category || !description || !name || !price) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		connection = await getConnection();
		await connection.beginTransaction();

		const queryProduct = `INSERT INTO product (name, description, price, FK_Brand) VALUES (?,?,?,?)`;
		const result = await connection.query(queryProduct, [name, description, price, brand]);
		const productId = Number(result.insertId);

		await connection.commit();

		const queryCategory = `INSERT INTO product_has_category (FK_Product, FK_Category) VALUES (?,?)`;
		const resultCategory = await connection.query(queryCategory, [productId, category]);

		await connection.commit();

		const queryAttribute = `INSERT INTO attribute (name, description) VALUES (?,?)`;
		const queryPhA = `INSERT INTO product_has_attribute (FK_Product, FK_Attribute) VALUES (?,?)`;

		attributes.forEach(async (attribute) => {
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
			connection.release();
		}
	}
};

productController.getProductDetailById = async (req, res) => {
	let connection;
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).send({ message: "El id es obligatorio" });
		}

		connection = await getConnection();

		const queryMoney = `
            SELECT p.id, p.name, p.description, p.isAvailable, p.price, b.id as brandId, b.name as brand, c.id as categoryId, c.name as category FROM product p
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

		productData[0].attributes = productAttributes;
		productData[0].images = productImages.map((image) => image.image_path);

		res.status(200).send(productData[0]);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

productController.updateDataProduct = async (req, res) => {
	let connection;
	try {
		const { id, name, description, price, brand, category } = req.body;
		if ((!id, !name || !description || !price || !brand || !category)) {
			return res.status(400).send({ message: "Hacen falta campos para modificar el producto" });
		}

		connection = await getConnection();

		await connection.beginTransaction();

		const queryMoney = `
			UPDATE product SET name = ?, description = ?, price = ?,  FK_Brand = ? WHERE id = ?
		`;

		const update1 = await connection.query(queryMoney, [name, description, price, brand, id]);
		await connection.commit();

		const queryCategory = `
			UPDATE product_has_category SET FK_Category = ? WHERE FK_Product = ?
		`;
		const update2 = await connection.query(queryCategory, [category, id]);

		await connection.commit();

		res.status(200).send({ message: "Producto actualizado correctamente" });
	} catch (error) {
		await connection.rollback();
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

productController.updateAttributesProduct = async (req, res) => {
	let connection;
	try {
		const { id, attributes } = req.body;
		if (!id || !attributes) {
			return res.status(400).send({ message: "Hacen falta campos para modificar el producto" });
		}

		connection = await getConnection();
		await connection.beginTransaction();

		const queryGetIdsAttributes = `
			SELECT a.id FROM attribute a
    			JOIN product_has_attribute pha ON a.id = pha.FK_Attribute
    			WHERE pha.FK_Product = ?;
		`;

		idsAttributes = await connection.query(queryGetIdsAttributes, id);

		const queryDeletePhA = `
			DELETE FROM product_has_attribute WHERE FK_Product = ?;
		`;

		const resultDeletePhA = await connection.query(queryDeletePhA, id);

		await connection.commit();

		const queryDeleteAttribute = `DELETE FROM attribute WHERE id = ?`;

		idsAttributes.forEach(async (value) => {
			const resultDelete = await connection.query(queryDeleteAttribute, value.id);
		});

		await connection.commit();

		const queryAttribute = `INSERT INTO attribute (name, description) VALUES (?,?)`;
		const queryPhA = `INSERT INTO product_has_attribute (FK_Product, FK_Attribute) VALUES (?,?)`;

		attributes.forEach(async (attribute) => {
			const r1 = await connection.query(queryAttribute, [attribute.name, attribute.description]);
			const attributeId = Number(r1.insertId);
			await connection.commit();

			const r2 = await connection.query(queryPhA, [id, attributeId]);
			await connection.commit();
		});

		await connection.commit();

		res.status(200).send({ message: "Producto actualizado correctamente" });
	} catch (error) {
		await connection.rollback();
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

productController.getProductByIdForEdit = async (req, res) => {
	let connection;
	try {
		const { id } = req.query;
		if (!id) {
			return res.status(400).send({ message: "El id es obligatorio" });
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

		res.status(200).send({ productData: productData[0], productAttributes, images: productImages });
	} catch (error) {
		res.status(500).send({ message: "Error al obtener producto", error: error.message });
	} finally {
		if (connection) {
			connection.release();
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
			connection.release();
		}
	}
};

productController.getBranchesWithProduct = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const queryProduct = `
		SELECT b.id as id, b.name as name, b.address as address, stock
        FROM inventory i1
        JOIN (
            SELECT FK_Branch, MAX(created_at) AS MaxDate
            FROM inventory i3
            WHERE i3.stock != 0
            GROUP BY FK_Branch
        ) i2 ON i1.FK_Branch = i2.FK_Branch AND i1.created_at = i2.MaxDate
        JOIN branch b ON i1.FK_Branch = b.id;
		`;

		const resultProduct = await connection.query(queryProduct);
		res.status(200).send(resultProduct);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos.", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

productController.getProductsLike = async (req, res) => {
	let connection;
	try {
		const { name, id } = req.params;
		connection = await getConnection();

		if (!name) {
			return res.status(400).send({ message: "El nombre es requerido" });
		}

		if (!id) {
			return res.status(400).send({ message: "El id de la sucursal es requerido" });
		}

		const queryProduct = `
		SELECT p.* from inventory i
		JOIN (
			SELECT FK_Product, FK_Branch, created_at, stock
					FROM inventory i3
					WHERE i3.stock != 0 AND i3.FK_Branch = ?
				GROUP BY FK_Product, FK_Branch
		) i2 ON i.FK_Branch = i2.FK_Branch
		JOIN product p ON i2.FK_Product = p.id
		WHERE p.name LIKE ?
		GROUP BY p.id;`;

		const resultProduct = await connection.query(queryProduct, [id, `%${name}%`]);

		for (let i = 0; i < resultProduct.length; i++) {
			// find attributes
			const queryAttribute = `
			SELECT a.name, a.description
			FROM attribute a
			JOIN product_has_attribute pha ON a.id = pha.FK_Attribute
			WHERE pha.FK_Product = ?;`;

			const resultAttributes = await connection.query(queryAttribute, [resultProduct[i].id]);
			resultProduct[i].attributes = resultAttributes;

			// get one image
			const queryImage = `
			SELECT image_path FROM product_image WHERE FK_Product = ? LIMIT 1;`;

			const resultImage = await connection.query(queryImage, [resultProduct[i].id]);
			resultProduct[i].image_path = resultImage[0].image_path;

			// find categories
			const queryCategory = `
			SELECT c.name as name FROM category c
			JOIN product_has_category phc ON c.id = phc.FK_Category
			WHERE phc.FK_Product = ?;`;

			const resultCategory = await connection.query(queryCategory, [resultProduct[i].id]);
			resultProduct[i].categories = resultCategory;
		}

		res.status(200).send(resultProduct);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos.", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

productController.getProductsAndBranchesForStock = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const queryProduct = `
			SELECT id, name FROM product;
		`;

		const resultProduct = await connection.query(queryProduct);

		const queryBranches = `
			SELECT id, name FROM branch;
		`;

		const resultBranches = await connection.query(queryBranches);

		res.status(200).send({ products: resultProduct, branches: resultBranches });
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los productos y .", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getStockOfProductByBranch = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const { id } = req.query;

		if (!id) {
			res.status(400).send({ message: "El id es requerido", error: error.message });
		}

		const queryProduct = `
			SELECT b.name,
       			(SELECT i2.stock
        		FROM inventory i2
        		WHERE i2.FK_Product = ?
          		AND i2.FK_Branch = i.FK_Branch
        		ORDER BY i2.id DESC
        		LIMIT 1) AS stock
			FROM inventory i
         		LEFT JOIN branch b ON i.FK_Branch = b.id
			GROUP BY i.FK_Branch;
		`;

		const resultProduct = await connection.query(queryProduct, id);

		res.status(200).send(resultProduct);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener los stock", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.addStockInventory = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const { idUser, product, store, stock, actualStock } = req.body;

		if (!idUser || !product || !store || !stock) {
			res.status(400).send({ message: "Faltan campos requeridos", error: error.message });
		}

		let sum = +stock;
		if (actualStock) {
			sum = sum + Number(actualStock);
		}

		const description = "Ingreso de producto a inventario";

		const query = `INSERT INTO inventory (inflow, stock, description, FK_Product, FK_Branch, FK_User) VALUES (?,?,?,?,?,?)`;

		const result = await connection.query(query, [stock, sum, description, product, store, idUser]);

		res.status(200).send({ message: "Producto ingresado en el inventario" });
	} catch (error) {
		res.status(500).send({ message: "Error al guardar stock", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

productController.getProducsWithMoreSales = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const query = `SELECT SUM(i.outflow)as sales, p.name FROM inventory i
    		JOIN product p ON i.FK_Product = p.id
    		GROUP BY i.FK_Product ORDER BY sales DESC LIMIT 10`;

		const result = await connection.query(query);
		
		const query1 = `SELECT SUM(i.stock) as sales, p.name FROM inventory i
    		JOIN product p ON i.FK_Product = p.id
    		GROUP BY i.FK_Product ORDER BY sales DESC LIMIT 10`;

		const result1 = await connection.query(query1);
		
		const query2 = `SELECT CONCAT(COUNT(r.name),'') as quantity, r.name FROM user u
    						JOIN user_has_role uhr ON u.id = uhr.FK_User
    						JOIN role r ON uhr.FK_Role = r.id
    						GROUP BY r.name
`;

		const result2 = await connection.query(query2);
		console.log(result2);
		
		
		res.status(200).send({report1: result, report2: result1, report3: result2});
	} catch (error) {
		res.status(500).send({ message: "Error al obtener datos", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

module.exports = productController;
