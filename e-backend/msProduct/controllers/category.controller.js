/** @format */

const getConnection = require("../../db/db.js");

const categoryController = {};

categoryController.getCategories = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();
                
		const queryMoney = `
            SELECT id, name, image FROM category
            `;

		const result = await connection.query(queryMoney);
		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener las categorias.", error: error.message });
	} finally {
		if (connection) {
			connection.end();
		}
	}
};


module.exports = categoryController;
