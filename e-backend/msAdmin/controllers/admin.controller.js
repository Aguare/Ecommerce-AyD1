/** @format */

const getConnection = require("../../db/db.js");
const pbkdf2 = require("pbkdf2");

const adminController = {};

adminController.getPages = async (req, res) => {
	let connection;
	try {
		const { id } = req.params;
		connection = await getConnection();

		if (!id) {
			return res.status(400).send({ message: "El ID es requerido." });
		}

		const queryMoney = `
            SELECT p.id, p.name as pageName, p.direction, p.isAvailable, m.name as moduleName
            FROM user_has_role uhs
            LEFT JOIN role r ON r.id = uhs.FK_Role
            LEFT JOIN role_has_page rhp ON rhp.FK_Role = r.id
            LEFT JOIN page p ON p.id = rhp.FK_Page
            LEFT JOIN module m ON m.id = p.FK_Module
            WHERE uhs.FK_User = ?`;

		const result = await connection.query(queryMoney, [id]);
		res.status(200).send({ result });
	} catch (error) {
		res.status(500).send({ message: "Error al obtener las páginas.", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};

adminController.addEmployee = async (req, res) => {
	let conn;
	try {
		const { first_name, last_name, DPI, date_birth, tel, FK_Branch, email, username, password, role } = req.body;
		conn = await getConnection();

		if (
			!first_name ||
			!last_name ||
			!DPI ||
			!date_birth ||
			!tel ||
			!FK_Branch ||
			!email ||
			!username ||
			!password ||
			!role
		) {
			return res.status(400).send({ message: "Todos los campos son requeridos." });
		}

		await conn.beginTransaction();

		const queryUsername = `SELECT * FROM user WHERE username = ? AND email=?;`;
		const resultUsername = await conn.query(queryUsername, [username, email]);

		if (resultUsername.length > 0) {
			return res.status(400).send({ message: "El username o correo ya esta registrado" });
		}

		const passwordText = password.toString();

		const querySalt = `SELECT * FROM company_settings WHERE key_name = 'password_salt';`;
		const resultSalt = await conn.query(querySalt);
		const salt = resultSalt[0].key_value;

		const encryptedPassword = pbkdf2.pbkdf2Sync(passwordText, salt, 1, 32, "sha512").toString("hex");

		const insertUserQuery = "INSERT INTO user (email, username, password) VALUE (?, ?, ?)";
		const result = await conn.query(insertUserQuery, [email, username, encryptedPassword]);

		const queryRole = `INSERT INTO user_has_role (Fk_User, Fk_Role) VALUE (?, ?);`;
		await conn.query(queryRole, [result.insertId, role]);

		const insertUserInformationQuery = "INSERT INTO user_information (Fk_User) VALUE (?)";
		await conn.query(insertUserInformationQuery, [result.insertId]);

		const queryEmployee = `SELECT * FROM employee WHERE DPI = ?;`;
		const resultEmployee = await conn.query(queryEmployee, [DPI]);

		if (resultEmployee.length > 0) {
			return res.status(400).send({ message: "El empleado ya esta registrado" });
		}

		const insertEmployeeQuery = `INSERT INTO employee (first_name, last_name, DPI, date_birth, tel, FK_Branch, FK_User) VALUE (?, ?, ?, ?, ?, ?, ?);`;
		await conn.query(insertEmployeeQuery, [first_name, last_name, DPI, date_birth, tel, FK_Branch, result.insertId]);

		await conn.commit();
		res.status(200).send({ message: "Empleado agregado correctamente." });
	} catch (error) {
		await conn.rollback();
		res.status(500).send({ message: "Error al agregar el empleado.", error: error.message });
	} finally {
		if (conn) {
			conn.end();
		}
	}
};

adminController.getRoles = async (req, res) => {
	let conn;
	try {
		conn = await getConnection();

		await conn.beginTransaction();

		const queryRoles = `SELECT * FROM role;`;
		const result = await conn.query(queryRoles);

		await conn.commit();
		res.status(200).send({ data: result });
	} catch (error) {
		await conn.rollback();
		res.status(500).send({ message: "Error al obtener los roles.", error: error.message });
	} finally {
		if (conn) {
			conn.end();
		}
	}
};

module.exports = adminController;
