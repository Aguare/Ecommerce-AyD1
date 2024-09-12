/** @format */

const getConnection = require("../../db/db.js");

const brandController = {};

brandController.getBrands = async (req, res) => {
	let connection;
	try {
		connection = await getConnection();

		const queryMoney = `
            SELECT id, name FROM brand
            `;

		const result = await connection.query(queryMoney);
		res.status(200).send(result);
	} catch (error) {
		res.status(500).send({ message: "Error al obtener las marcas.", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

brandController.saveBrand = async (req, res) => {
	let connection;
	try {

        const {name} = req.body;
		connection = await getConnection();
		const queryMoney = `INSERT INTO brand (name) VALUES (?)`;
		const result = await connection.query(queryMoney, name);
        
		res.status(200).send({message: 'Marca registrada correctamente'});
	} catch (error) {
		res.status(500).send({ message: "Error al guardar Marca", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

brandController.updateBrand = async (req, res) => {
	let connection;
	try {

        const {id, name} = req.body;
		console.log(req.body);
		
		connection = await getConnection();
		const queryMoney = `UPDATE brand SET name = ? WHERE id = ?`;
		const result = await connection.query(queryMoney, [name, id]);
        
		res.status(200).send({message: 'Marca actualizada correctamente'});
	} catch (error) {
		res.status(500).send({ message: "Error al actualizar marca", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

brandController.deleteBrand = async (req, res) => {
	let connection;
	try {

        const {id} = req.query;
        console.log(id);
        
		connection = await getConnection();
		const queryMoney = `DELETE FROM brand WHERE id = ?`;
		const result = await connection.query(queryMoney, id);
        
		res.status(200).send({message: 'Marca eliminada correctamente'});
	} catch (error) {
		res.status(500).send({ message: "Error al eliminar marca", error: error.message });
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

module.exports = brandController;
