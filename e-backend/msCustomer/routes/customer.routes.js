/** @format */

const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");

router.post("/myCart", CustomerController.myCart);
router.put("/updateCart", CustomerController.updateCart);
router.delete("/deleteCart/:id", CustomerController.deleteCart);
router.get("/getStores", CustomerController.getStore);
router.post("/validateStock", CustomerController.validateStock);
router.get("/validateStockOnline/:id_product", CustomerController.validateStockOnline);
router.delete("/deleteProductCart/:id_user/:id_product", CustomerController.deleteProductCart);
router.post("/addProductCart", CustomerController.addProductCart);
router.get("/getDeliveryCost", CustomerController.getCompanyShipment);
router.get("/getDataForCheckout/:id", CustomerController.getUserData);

module.exports = router;
