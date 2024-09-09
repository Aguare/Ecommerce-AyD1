/** @format */

const getConnection = require("../db/db");
const controller = {};
const jwt = require("jsonwebtoken");

controller.verifyToken = async (req, res, next) => {
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}

	const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer_auth=", "") : null;

	if (!token) {
		return res.status(401).send({ message: "No token provided" });
	}

	let connec;

	try {
		connec = await getConnection();
		const query = "SELECT key_value FROM company_settings WHERE key_name = 'session_key';";
		const result = await connec.query(query);

		if (result.length === 0) {
			return res.status(401).send({ message: "Error interno al iniciar la sesion" });
		}

		jwtKey = result[0].key_value;
		let decoded = { name: "TokenExpiredError" };
		try {
			decoded = jwt.verify(token, jwtKey);
		} catch (error) {
			return res.status(401).send({ message: "Sesión expirada, vuelva a iniciar sesión", error: error.message });
		}

		if (decoded.name === "TokenExpiredError") {
			return res.status(401).send({ message: "El token ha expirado. Por favor, inicia sesión de nuevo." });
		}

		const sql = `SELECT * from user WHERE auth_token = ? AND id = ?`;
		const result_token = await connec.query(sql, [token, decoded.id]);

		if (result_token.length === 0) {
			return res.status(401).send({ message: "Token no existe" });
		}

		const dateNow = new Date();
		const timeExpired = new Date(decoded.exp * 1000);
		
		if (dateNow > timeExpired) {
			return res.status(401).send({ message: "El token ha expirado. Por favor, inicia sesión de nuevo." });
		}

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).send({ message: "Sesión expirada, vuelva a iniciar sesión", error: error.message });
	} finally {
		if (connec) {
			connec.end();
		}
	}
};

module.exports = controller;
