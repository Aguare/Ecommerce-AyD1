const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.config');

const Customer = sequelize.define('customers', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'customers',
    timestamps: false
});

module.exports = Customer;