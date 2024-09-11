/** @format */

const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");
const customerRoutes = require("./customer.routes");
const orderRoutes = require("./order.routes");
const middleware = require("../../middleware/verifytoken.middleware");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/customer/sign-up", CustomerController.signUp);
router.get("/customer/getCurrency", CustomerController.getCurrency);
router.get('/customer/getNumberInCart/:id', CustomerController.getNumberInCart);


router.use("/customer", [middleware.verifyToken], customerRoutes);
router.use("/order", [middleware.verifyToken], orderRoutes);

module.exports = router;
