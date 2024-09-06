/** @format */

const pbkdf2 = require("pbkdf2");
const getConnection = require("../../db/db.js");
require("dotenv").config();

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
		const resultEmail = await conn.query (queryEmail, [email]);
		if (resultEmail.length > 0) {
			return res.status(400).send({ message: "El email ya esta registrado" });
		}

		const queryUsername = `SELECT * FROM user WHERE username = ?;`;
		const resultUsername = await conn.query (queryUsername, [username]);
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
		res.status(200).send({ message: "Usuario registrado correctamente", data: result.insertId.toString() });
	} catch (error) {
		console.log(error);
		console.log(error.message);
		res.status(400).send({
			message: "Error al registrar el usuario",
			error: error.message,
		});
	} finally {
		if (conn) {
			conn.end();
		}
	}
};

module.exports = userController;
