/** @format */

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");

router.post("/saveOrder", OrderController.saveOrder);

module.exports = router;
