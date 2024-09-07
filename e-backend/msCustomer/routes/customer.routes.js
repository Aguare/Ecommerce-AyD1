/** @format */

const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");

router.post("/myCart", CustomerController.myCart);
router.get("/getCurrency", CustomerController.getCurrency);
router.post("/updateCart", CustomerController.updateCart);
router.delete("/deleteCart/:id", CustomerController.deleteCart);

module.exports = router;
