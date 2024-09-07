/** @format */

const getConnection = require("../db/db");
const controller = {};
const jwt = require("jsonwebtoken");

controller.verifyToken = async (req, res, next) => {
	const bearerHeader = req.headers["authorization"];
	console.log("bearerHeader", bearerHeader);

	if (!bearerHeader) {
		return res.status(403).send({ message: "No token provided" });
	}

	const token = bearerHeader.split(" ")[1];
	console.log("token", token);

	if (!token) {
		return res.status(403).send({ message: "No token provided" });
	}

	let connec;

	try {
		connec = await getConnection();
		const query = "SELECT key_value FROM company_settings WHERE key_name = 'session_key';";
		const result = await connec.query(query);

		if (result.length === 0) {
			return res.status(400).send({ message: "Error interno al iniciar la sesion" });
		}

		jwtKey = result[0].key_value;
		jwt.verify(token, jwtKey, async (err, decoded) => {
			if (err) {
				if (err.name === "TokenExpiredError") {
					return res.status(401).send({ message: "El token ha expirado. Por favor, inicia sesión de nuevo." });
				} else {
					return res.status(403).send({ message: "Token no válido" });
				}
			}

			const sql = `SELECT * from user WHERE auth_token = ? AND id = ?`;
			const result_token = await connec.query(sql, [token, decoded.id]);

			if (result_token.length === 0) {
				return res.status(403).send({ message: "Token no válido" });
			}

			const dateNow = new Date();
			const queryExpired = "SELECT auth_token_expired FROM user WHERE id = ?;";
			const resultExpired = await connec.query(queryExpired, [decoded.id]);

			if (resultExpired.length === 0) {
				return res.status(403).send({ message: "Token no válido" });
			}

			const expired = new Date(resultExpired[0].auth_token_expired);
			if (dateNow > expired) {
				return res.status(403).send({ message: "Token expirado" });
			}
			next();
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({ message: "Error al obtener la información", error: error.message });
	} finally {
		if (connec) {
			connec.end();
		}
	}
};

module.exports = controller;
