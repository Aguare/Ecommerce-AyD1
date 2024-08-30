/** @format */

const getConnection = require("../../db/db.js");
const util = require("util");

const adminController = {};

adminController.getPages = async (req, res) => {
	let connection;
    try {
        const { id } = req.body;

        // Obtener la conexión
        connection = await getConnection();

        // Validación básica del ID
        if (!id) {
            return res.status(400).send({ message: 'El ID es requerido.' });
        }

        // Consulta SQL
        const queryMoney = `
            SELECT p.id, p.name as pageName, p.direction, p.isAvailable, m.name as moduleName
            FROM user_has_role uhs
            LEFT JOIN role r ON r.id = uhs.FK_Role
            LEFT JOIN role_has_page rhp ON rhp.FK_Role = r.id
            LEFT JOIN page p ON p.id = rhp.FK_Page
            LEFT JOIN module m ON m.id = p.FK_Module
            WHERE uhs.FK_User = ?`;

        // Ejecutar la consulta
        const result = await connection.query(queryMoney, [id]);

        // Enviar el resultado al cliente
        res.status(200).send({ result });

    } catch (error) {
        console.error("Error en getPages:", error);
        res.status(500).send({ message: "Error al obtener las páginas.", error: error.message });
    } finally {
        // Asegurarse de liberar la conexión
        if (connection) {
            connection.release();
        }
    }
};

module.exports = adminController;
