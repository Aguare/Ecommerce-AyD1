/** @format */

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.get("/getAllOrders", orderController.getAllOrders);
router.get('/getProductsByOrderId/:id/:limit/:offset', orderController.getProductsByOrderId);
router.get("/getOrderStatus", orderController.getOrderStatus);
router.get("/getOrdersByUserId/:id", orderController.getOrdersByUserId);
router.put("/updateOrderStatus/:id", orderController.updateOrderStatus);
router.post("/saveOrder", orderController.saveOrder);

module.exports = router;