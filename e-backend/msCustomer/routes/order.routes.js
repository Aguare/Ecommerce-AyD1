/** @format */

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");

router.get("/getAllOrders", OrderController.getAllOrders);
router.get('/getProductsByOrderId/:id/:limit/:offset', OrderController.getProductsByOrderId);
router.get("/getOrderStatus", OrderController.getOrderStatus);
router.get("/getOrdersByUserId/:id", OrderController.getOrdersByUserId);
router.put("/updateOrderStatus/:id", OrderController.updateOrderStatus);

module.exports = router;