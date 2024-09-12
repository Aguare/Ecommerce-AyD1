/** @format */

const pbkdf2 = require("pbkdf2");
const getConnection = require("../../db/db.js");
require("dotenv").config();
const emailController = require("../../msEmail/controllers/email.controller.js");

const userController = {};
/**
 * Sign up a new customer
 * In order tu save a new customer, the following fields are required:
 * - email: unique
 * - name
 * - password: the password is encrypted using pbkdf2
 */
userController.signUp = async (req, res) => {
	let conn;
	try {
		const { email, username, password } = req.body;

		if (!email || !username || !password) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		conn = await getConnection();

		const queryEmail = `SELECT * FROM user WHERE email = ?;`;
		const resultEmail = await conn.query(queryEmail, [email]);
		if (resultEmail.length > 0) {
			return res.status(400).send({ message: "El email ya esta registrado" });
		}

		const queryUsername = `SELECT * FROM user WHERE username = ?;`;
		const resultUsername = await conn.query(queryUsername, [username]);
		if (resultUsername.length > 0) {
			return res.status(400).send({ message: "El username ya esta registrado" });
		}

		const passwordText = password.toString();

		const querySalt = `SELECT * FROM company_settings WHERE key_name = 'password_salt';`;
		const resultSalt = await conn.query(querySalt);
		const salt = resultSalt[0].key_value;

		const encryptedPassword = pbkdf2.pbkdf2Sync(passwordText, salt, 1, 32, "sha512").toString("hex");

		const insertUserQuery = "INSERT INTO user (email, username, password) VALUE (?, ?, ?)";
		const result = await conn.query(insertUserQuery, [email, username, encryptedPassword]);

		const queryRole = `INSERT INTO user_has_role (Fk_User, Fk_Role) VALUE (?, 2);`;
		await conn.query(queryRole, [result.insertId]);

		const insertUserInformationQuery = "INSERT INTO user_information (Fk_User) VALUE (?)";
		await conn.query(insertUserInformationQuery, [result.insertId]);

		await emailController.sendVerificationEmail({ body: { email: email, isObject: true } }, res);

		if (conn) {
			conn.release();
		}

		return res.status(200).send({ message: "Usuario registrado correctamente", data: result.insertId.toString() });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al registrar el usuario",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

userController.verifyRecoveryPassword = async (req, res) => {
	let connection;

	const { token, email, password } = req.body;

	try {
		connection = await getConnection();
	} catch (error) {
		console.log(error);
		return res.status(500).send({ message: "Error al conectar con la base de datos" });
	}

	try {
		const queryToken = `SELECT * FROM email_verification WHERE email_token = ? AND token = ?;`;
		const resultToken = await connection.query(queryToken, [email, token]);

		if (resultToken.length === 0) {
			return res.status(400).send({ message: "Token inválido" });
		}

		if (resultToken[0].isResetPassword === 0) {
			return res.status(400).send({ message: "Token inválido" });
		}

		const result = await updatePassword(resultToken[0].email, password, connection);

		if (result) {
			const queryDeleteToken = `DELETE FROM email_verification WHERE email = ?;`;
			await connection.query(queryDeleteToken, [email]);

			if (conn) {
				conn.release();
			}

			return res.status(200).send({ message: "Contraseña actualizada correctamente" });
		} else {
			if (conn) {
				conn.release();
			}

			return res.status(400).send({ message: "Error al actualizar la contraseña" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send({ message: "Error al verificar la contraseña" });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

async function updatePassword(email, password, connection) {
	try {
		const querySalt = `SELECT * FROM company_settings WHERE key_name = 'password_salt';`;
		const resultSalt = await connection.query(querySalt);

		if (resultSalt.length === 0) {
			return false;
		}

		const salt = resultSalt[0].key_value;
		const encryptedPassword = pbkdf2.pbkdf2Sync(password.toString(), salt, 1, 32, "sha512").toString("hex");

		const updatePasswordQuery = "UPDATE user SET password = ? WHERE email = ?;";
		await connection.query(updatePasswordQuery, [encryptedPassword, email]);

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

/**
 * Get the cart of the customer
 * - The cart is obtained by the user id
 * @returns {Object} - The cart of the user
 */
userController.myCart = async (req, res) => {
	let conn;
	try {
		const { id_user } = req.body;

		if (!id_user) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		conn = await getConnection();

		const queryCart = `SELECT * FROM shop_cart WHERE Fk_User = ?;`;
		const resultCart = await conn.query(queryCart, [id_user]);
		if (resultCart.length === 0) {
			return res.status(400).send({ message: "El carrito esta vacio" });
		}

		const resultCartItems = [];
		const queryCartItems = `SELECT * FROM product WHERE id = ?;`;
		let id_product;
		for (let i = 0; i < resultCart.length; i++) {
			id_product = resultCart[i].FK_Product;
			const resultItems = await conn.query(queryCartItems, [id_product]);
			if (resultItems.length !== 0) {
				resultCartItems.push(resultItems);
			}
		}

		const queryImagePath = `SELECT * FROM product_image WHERE FK_Product = ?;`;
		const resultImagePath = [];
		let id_product_image;
		for (let i = 0; i < resultCartItems.length; i++) {
			id_product_image = resultCartItems[i][0].id;
			const resultImages = await conn.query(queryImagePath, [id_product_image]);
			if (resultImages.length !== 0) {
				resultImagePath.push(resultImages);
			}
		}

		const data = {
			cart: resultCart,
			info: resultCartItems,
			images: resultImagePath[0],
		};

		if (conn) {
			conn.release();
		}

		return res.status(200).send({ message: "Carrito obtenido correctamente", data: data });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al obtener el carrito",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};
/**
 * Get the currency of the company
 * - The currency is obtained by the key_name 'currency_symbol'
 * @returns data - The currency of the company
 */
userController.getCurrency = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();

		const queryCurrency = "SELECT * FROM company_settings WHERE key_name = 'currency_symbol';";
		const resultCurrency = await conn.query(queryCurrency);
		if (resultCurrency.length === 0) {
			return res.status(400).send({ message: "No se encontro la moneda" });
		}

		if (conn) {
			conn.release();
		}

		return res
			.status(200)
			.send({ message: "Moneda obtenida correctamente", data: { currency: resultCurrency[0].key_value } });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al obtener la moneda",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Update the cart of the customer
 * - The cart is updated by the user id
 * @returns {Object} - The cart of the user
 */

userController.updateCart = async (req, res) => {
	let conn;
	try {
		const { id_user, id_product, quantity } = req.body;

		if (!id_user || !id_product || quantity === undefined || quantity === null) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		conn = await getConnection();
		await conn.beginTransaction();

		const queryCart = `SELECT * FROM shop_cart WHERE Fk_User = ? AND FK_Product = ?;`;
		const resultCart = await conn.query(queryCart, [id_user, id_product]);
		if (resultCart.length === 0) {
			await conn.rollback();
			return res.status(400).send({ message: "El producto no está en el carrito" });
		}

		const updateCart = `UPDATE shop_cart SET quantity = ? WHERE Fk_User = ? AND FK_Product = ?;`;
		const resultUpdate = await conn.query(updateCart, [quantity, id_user, id_product]);

		await conn.commit();

		if (conn) {
			conn.release();
		}

		return res.status(200).send({
			message: "Carrito actualizado correctamente",
			data: resultUpdate.toString(),
		});
	} catch (error) {
		if (conn) await conn.rollback();
		res.status(400).send({
			message: "Error al actualizar el carrito",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Delete the cart of the customer
 * - The cart is deleted by the user id
 * @returns - The cart of the user
 */
userController.deleteCart = async (req, res) => {
	let conn;
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		conn = await getConnection();
		await conn.beginTransaction();

		const deleteCart = `DELETE FROM shop_cart WHERE Fk_User = ?;`;
		const resultDelete = await conn.query(deleteCart, [id]);

		await conn.commit();

		if (conn) {
			conn.release();
		}

		return res.status(200).send({ message: "Carrito eliminado correctamente", data: resultDelete.toString() });
	} catch (error) {
		if (conn) await conn.rollback();
		res.status(400).send({
			message: "Error al eliminar el carrito",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Get the store
 * - The store is obtained by the key_name 'store_name'
 * @returns data - The store of the company
 */

userController.getStore = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();

		const queryStore = "SELECT * FROM branch";
		const resultStore = await conn.query(queryStore);
		if (resultStore.length === 0) {
			return res.status(400).send({ message: "No se encontro la tienda" });
		}

		if (conn) {
			conn.release();
		}

		return res.status(200).send({ message: "Tienda obtenida correctamente", data: { stores: resultStore } });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al obtener la tienda",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Validate the stock of the product
 * - The stock is obtained by the product id and branch id
 */
userController.validateStock = async (req, res) => {
	const { id_product, id_branch } = req.body;

	if (!id_product || !id_branch) {
		return res.status(400).send({ message: "Faltan campos por llenar" });
	}

	let conn;
	try {
		conn = await getConnection();

		const queryProduct = `
		 SELECT b.name, 
				(SELECT i2.stock 
				 FROM inventory i2 
				 WHERE i2.FK_Product = ? 
				   AND i2.FK_Branch = ? 
				 ORDER BY i2.id DESC 
				 LIMIT 1) AS stock
		 FROM branch b
		 WHERE b.id = ?`;

		const resultProduct = await conn.query(queryProduct, [id_product, id_branch, id_branch]);
		if (resultProduct.length === 0) {
			return res.status(400).send({ message: "No se encontro el producto" });
		}

		if (conn) {
			conn.release();
		}

		return res.status(200).send({ message: "Producto obtenido correctamente", data: resultProduct });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al obtener el producto",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Validate the stock of the product online
 * - The stock is obtained by the product id
 */
userController.validateStockOnline = async (req, res) => {
	const { id_product } = req.params;

	if (!id_product) {
		return res.status(400).send({ message: "Faltan campos por llenar" });
	}

	let conn;
	try {
		conn = await getConnection();

		const queryProduct = `
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
		WHERE i.FK_Product = ?
		GROUP BY i.FK_Product;
		`;

		const resultProduct = await conn.query(queryProduct, [id_product, id_product]);

		if (conn) {
			conn.release();
		}

		if (resultProduct.length === 0) {
			return res.status(400).send({ message: "No se encontro el producto" });
		}

		return res.status(200).send({ message: "Producto obtenido correctamente", data: resultProduct });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al obtener el producto",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Delete the product of the cart
 * - The product is deleted by the user id and product id
 */

userController.deleteProductCart = async (req, res) => {
	let conn;
	try {
		const { id_user, id_product } = req.params;

		if (!id_user || !id_product) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		conn = await getConnection();
		await conn.beginTransaction();

		const deleteProduct = `DELETE FROM shop_cart WHERE Fk_User = ? AND FK_Product = ?;`;
		const resultDelete = await conn.query(deleteProduct, [id_user, id_product]);

		await conn.commit();

		if (conn) {
			conn.release();
		}

		return res.status(200).send({
			message: "Producto eliminado correctamente",
			data: resultDelete.toString(),
		});
	} catch (error) {
		if (conn) await conn.rollback();
		res.status(400).send({
			message: "Error al eliminar el producto",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Add a product to the cart or update the quantity
 * - The product is added by the user id and product id
 */
userController.addProductCart = async (req, res) => {
	let conn;
	try {
		const { id_user, id_product, id_branch, quantity } = req.body;
		if (!id_user || !quantity || !id_product) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		conn = await getConnection();

		const queryCart = `SELECT * FROM shop_cart WHERE Fk_User = ? AND FK_Product = ?`;
		const resultCart = await conn.query(queryCart, [id_user, id_product]);

		if (resultCart.length === 0) {
			const insertCart = `INSERT INTO shop_cart (quantity, Fk_User, FK_Product, FK_Branch) VALUE (?, ?, ?, ?);`;
			const resultInsert = await conn.query(insertCart, [quantity, id_user, id_product, id_branch]);
			return res.status(200).send({ message: "Producto agregado correctamente", data: resultInsert.toString() });
		} else if (resultCart[0].FK_Branch !== id_branch) {
			// check if the branch have enough stock in the inventory
			const stock = await checkStockInBranch(conn, id_product, id_branch, quantity, resultCart[0].quantity);

			if (!stock) {
				return res.status(400).send({ message: "No hay suficiente stock en la sucursal" });
			}

			// update the branch of the product
			const updateBranch = `UPDATE shop_cart SET FK_Branch = ?, quantity = quantity + ? WHERE Fk_User = ? AND FK_Product = ?;`;
			const resultUpdateBranch = await conn.query(updateBranch, [id_branch, quantity, id_user, id_product]);
			return res
				.status(200)
				.send({ message: "Producto actualizado correctamente", data: resultUpdateBranch.toString() });
		}

		// check if the branch have enough stock in the inventory
		const stock = await checkStockInBranch(conn, id_product, id_branch, quantity, resultCart[0].quantity);

		if (!stock) {
			return res.status(400).send({ message: "No hay suficiente stock en la sucursal" });
		}
		const updateCart = `UPDATE shop_cart SET quantity = quantity + ? WHERE Fk_User = ? AND FK_Product = ? AND FK_Branch = ?;`;
		const resultUpdate = await conn.query(updateCart, [quantity, id_user, id_product, id_branch]);

		if (conn) {
			conn.release();
		}

		return res.status(200).send({ message: "Producto actualizado correctamente", data: resultUpdate.toString() });
	} catch (error) {
		res.status(400).send({
			message: "Error al agregar el producto",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * Check if the branch have enough stock in the inventory
 * - The stock is checked by the product id and branch id
 * @returns {Boolean} - True if the branch have enough stock, false otherwise
 */
const checkStockInBranch = async (conn, id_product, id_branch, quantity, oldQuantity) => {
	// check if the branch have enough stock in the inventory

	const queryProduct = ` SELECT b.name, 
	(SELECT i2.stock 
	 FROM inventory i2 
	 WHERE i2.FK_Product = ? 
	   AND i2.FK_Branch = ? 
	 ORDER BY i2.id DESC 
	 LIMIT 1) AS stock
	FROM branch b
	WHERE b.id = ?`;

	const resultProduct = await conn.query(queryProduct, [id_product, id_branch, id_branch]);
	if (resultProduct.length === 0) {
		return false;
	}

	return resultProduct[0].stock >= quantity + oldQuantity;
};

userController.getNumberInCart = async (req, res) => {
	let conn;
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send({ message: "Faltan campos por llenar" });
		}

		conn = await getConnection();

		const queryCart = `SELECT COUNT(*) AS number FROM shop_cart WHERE Fk_User = ?;`;
		const resultCart = await conn.query(queryCart, [id]);

		if (conn) {
			conn.release();
		}

		if (resultCart.length === 0) {
			return res.status(400).send({ message: "El carrito esta vacio" });
		}

		return res.status(200).send({ message: "Carrito obtenido correctamente", number: resultCart[0].number.toString() });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al obtener el carrito",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * get company_shipment
 * - get the company shipment
 */

userController.getCompanyShipment = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();

		const queryShipment = "SELECT key_value FROM company_settings WHERE key_name = 'delivery_cost';";
		const resultShipment = await conn.query(queryShipment);

		if (conn) {
			conn.release();
		}

		if (resultShipment.length === 0) {
			return res.status(400).send({ message: "No se encontro el costo de envio" });
		}

		return res
			.status(200)
			.send({ message: "Envio obtenido correctamente", data: { delivery_cost: resultShipment[0].key_value } });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al obtener el envio",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

/**
 * get data of the user
 * - get the data of the user
 */

userController.getUserData = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).send({ message: "Faltan campos por llenar" });
	}

	let conn;

	try {
		conn = await getConnection();
		await conn.beginTransaction();

		const query = `SELECT * FROM user WHERE id = ?;`;
		const [result] = await conn.query(query, [id]);

		if (result.length === 0) {
			await conn.rollback();
			return res.status(400).send({ message: "No se encontró el usuario" });
		}

		const querys = `SELECT * FROM user_information WHERE Fk_User = ?;`;
		const [resultInformation] = await conn.query(querys, [id]);

		await conn.commit();

		const data = {
			user: result,
			info: resultInformation,
		};

		if (conn) {
			conn.release();
		}
		
		return res.status(200).send({
			message: "Usuario obtenido correctamente",
			data: data,
		});
	} catch (error) {
		console.log(error);
		console.log(error.message);
		if (conn) {
			await conn.rollback();
		}
		res.status(400).send({
			message: "Error al obtener el usuario",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.release();
		}
	}
};

module.exports = userController;
