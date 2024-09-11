/** @format */

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

router.post("/myCart", customerController.myCart);
router.put("/updateCart", customerController.updateCart);
router.delete("/deleteCart/:id", customerController.deleteCart);
router.get("/getStores", customerController.getStore);
router.post("/validateStock", customerController.validateStock);
router.get("/validateStockOnline/:id_product", customerController.validateStockOnline);
router.delete("/deleteProductCart/:id_user/:id_product", customerController.deleteProductCart);
router.post("/addProductCart", customerController.addProductCart);
router.get("/getDeliveryCost", customerController.getCompanyShipment);
router.get("/getDataForCheckout/:id", customerController.getUserData);

module.exports = router;
