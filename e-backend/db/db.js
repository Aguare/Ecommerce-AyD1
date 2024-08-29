const mariadb = require('mariadb');
require('dotenv').config();
const data = require('../config/db-credentials');

const pool = mariadb.createPool({
    host: data.host,
    user: data.user,
    password: data.password,
    database: data.database,
    connectionLimit: 8
});


module.exports = pool;