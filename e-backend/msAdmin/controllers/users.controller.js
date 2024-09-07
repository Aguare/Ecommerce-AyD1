/** @format */

const pbkdf2 = require("pbkdf2");
const jwt = require("jsonwebtoken");
const getConnection = require("../../db/db.js");

const usersController = {};

usersController.login = async (req, res) => {
	let connection;
	try {
		const { username, password } = req.body;
		connection = await getConnection();

		if (!username || !password) {
			return res.status(400).send({ message: "El email y la contraseña son requeridos." });
		}

		const querySalt = `SELECT * FROM company_settings WHERE key_name = 'password_salt';`;
		const resultSalt = await connection.query(querySalt);

		const queryUser = `SELECT id, username, password FROM user WHERE username = ? OR email = ?;`;
		const resultUser = await connection.query(queryUser, [username, username]);
		if (resultUser.length === 0) {
			return res.status(400).send({ message: "El usuario no existe." });
		}

		if (resultSalt.length === 0) {
			return res.status(400).send({ message: "Error interno al iniciar la sesion" });
		}

		const salt = resultSalt[0].key_value;
		const user = resultUser[0];

		const passBD = pbkdf2.pbkdf2Sync(password, salt, 1, 32, "sha512").toString("hex");

		if (user.password !== passBD) {
			return res.status(400).send({ message: "La contraseña no es correcta." });
		}

		const queryKey = `SELECT * FROM company_settings WHERE key_name = 'session_key';`;
		const resultKey = await connection.query(queryKey);

		if (resultKey.length === 0) {
			return res.status(400).send({ message: "Error interno al iniciar la sesion" });
		}

		const key = resultKey[0].key_value;
		const token = jwt.sign({ id: user.id, username: user.username }, key, { expiresIn: "1h" });

		const dateNow = new Date();
		const timeExpiredHours = 1;
		const timeExpired = new Date(dateNow.setHours(dateNow.getHours() + timeExpiredHours));

		const queryUpdateToken = `UPDATE user SET auth_token = ?, auth_token_expired = ? WHERE id = ?;`;
		await connection.query(queryUpdateToken, [token, timeExpired, user.id]);

		delete user.password;
		res.status(200).send({ user: user, token: token });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error al iniciar sesión", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

/**
 * Update user information or save it if it doesn't exist
 * @returns
 */
usersController.updateUserInformation = async (req, res) => {
	let connection;
	try {
		const { id } = req.params;
		const { nit, description, image, isPreferCash } = req.body;
		connection = await getConnection();

		// Check if user exists
		const queryUser = `SELECT * FROM user WHERE id = ?;`;
		const resultUser = await connection.query(queryUser, [id]);
		if (resultUser.length === 0) {
			return res.status(400).send({ message: "El usuario no existe." });
		}

		// Check if user information exists
		const queryUserInfo = `SELECT * FROM user_information WHERE FK_User = ?;`;
		const resultUserInfo = await connection.query(queryUserInfo, [id]);
		if (resultUserInfo.length === 0) {
			//Create user information
			const queryCreateUserInfo = `INSERT INTO user_information (nit, description, image_profile, isPreferCash, FK_User) VALUES (?, ?, ?, ?, ?, ?);`;
			await connection.query(queryCreateUserInfo, [nit, description, image, isPreferCash, id]);
			res.status(200).send({ message: "Información actualizada correctamente." });
		}

		// Update user information
		const queryUpdateUserInfo = `UPDATE user_information SET nit = ?, description = ?, image_profile = ?, isPreferCash = ? WHERE FK_User = ?;`;
		await connection.query(queryUpdateUserInfo, [nit, description, image, isPreferCash, id]);
		res.status(200).send({ message: "Información actualizada correctamente." });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error al actualizar la información", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

/**
 * Get user information, username and email from user by username
 * @returns
 */
usersController.getProfileInformation = async (req, res) => {
	let connection;
	try {
		const { username } = req.params;
		connection = await getConnection();

		// Check if user exists
		const query = `SELECT u.username, u.email, i.nit, i.image_profile as imageProfile, i.isPreferCash, i.description FROM user u INNER JOIN user_information i ON u.id = i.FK_User WHERE u.username = ?;`;
		const resultUserInfo = await connection.query(query, [username]);
		if (resultUserInfo.length === 0) {
			return res.status(400).send({ message: "El usuario no existe." });
		}

		res.status(200).send({ user: resultUserInfo[0] });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error al obtener la información", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

usersController.getImageProfile = async (req, res) => {
	let connection;
	try {
		const { id } = req.params;
		connection = await getConnection();

		// Check if user exists
		const query = `SELECT image_profile FROM user_information WHERE FK_User = ?;`;
		const resultUserInfo = await connection.query(query, [id]);
		if (resultUserInfo.length === 0) {
			return res.status(400).send({ message: "El usuario no existe." });
		}

		res.status(200).send({ imageProfile: resultUserInfo[0].image_profile });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Error al obtener la información", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

module.exports = usersController;
