/** @format */

const pbkdf2 = require("pbkdf2");
const getConnection = require("../../db/db.js");
require("dotenv").config();
const fs = require("fs");
const carbone = require("carbone");
const path = require("path");

const reportsController = {};

reportsController.listReports = async (req, res) => {
	let connection;

	try {
		connection = await getConnection();

		const queryReports = `SELECT * FROM reports;`;
		const reports = await connection.query(queryReports);

		res.status(200).send(reports);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error al obtener los reportes");
	}
};

reportsController.generateReportInventory = async (req, res) => {

};

module.exports = reportsController;
