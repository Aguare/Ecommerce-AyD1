const Customer = require('../models/Customer.js');
const pbkdf2 = require('pbkdf2');
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
    try {
        const { email, name, password, address, nit } = req.body;

        const encryptedPassword = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');

        const customer = await Customer.create({
            email,
            name,
            password: encryptedPassword,
            address,
            nit
        });

        res.status(201).send({
            message: 'Cliente creado con éxito',
            data: customer
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: 'No se pudo crear el cliente',
            error
        });
    }
}

module.exports = {
    signUp
};