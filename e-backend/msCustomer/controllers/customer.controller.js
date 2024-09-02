const pbkdf2 = require('pbkdf2');
const getConnection = require("../../db/db.js");
require('dotenv').config();

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

        const querySalt = `SELECT * FROM company_settings WHERE key_name = 'password_salt';`;
		const resultSalt = await connection.query(querySalt);
        const salt = resultSalt[0].key_value;

        const encryptedPassword = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');

        conn = await getConnection();
        const insertUserQuery = "INSERT INTO user (email, username, password) VALUE (?, ?, ?)";
        const result = await conn.query(insertUserQuery, [email, username, encryptedPassword]);
        res.status(200).send({ message: 'Usuario registrado correctamente', data: result.insertId.toString() });

    } catch (error) {
        res.status(400).send({
            message: 'Error al registrar el usuario',
            error: error.message
        });
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = userController;