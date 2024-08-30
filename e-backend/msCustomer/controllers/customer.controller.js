const pbkdf2 = require('pbkdf2');
const getConnection = require('../../db/db.js');
require('dotenv').config();

const salt = process.env.SALT || 'salt';

/**
 * Sign up a new customer
 * In order tu save a new customer, the following fields are required:
 * - email: unique
 * - name
 * - password: the password is encrypted using pbkdf2
 * - address
 * - nit: unique
 * @param {Request} req
 * @param {Response} res
 */
const signUp = async (req, res) => {
    let conn;
    try {
        const { email, username, password } = req.body;

        const encryptedPassword = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');

        //TODO: Save the customer in the database
        conn = await getConnection();
        const insertUserQuery = "INSERT INTO user (email, username, password) VALUES (?, ?, ?)";
        const [result] = await conn.query(insertUserQuery, [email, username, encryptedPassword]);
        res.status(201).send({
            message: 'Usuario registrado',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: 'Error al registrar el usuario',
            error
        });
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = {
    signUp
};