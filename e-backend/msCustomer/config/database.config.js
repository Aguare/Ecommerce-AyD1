const { Sequelize } = require('sequelize');
require('dotenv').config();

const database = process.env.DB_NAME || 'customer_db';
const username = process.env.DB_USER || 'postgres';
const password = "";
const host = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
});

module.exports = { sequelize };
