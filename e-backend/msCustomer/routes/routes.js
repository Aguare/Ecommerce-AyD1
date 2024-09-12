/** @format */

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const customerRoutes = require("./customer.routes");
const orderRoutes = require("./order.routes");
const middleware = require("../../middleware/verifytoken.middleware");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/customer/sign-up", customerController.signUp);
router.get("/customer/getCurrency", customerController.getCurrency);
router.get("/customer/getNumberInCart/:id", customerController.getNumberInCart);
router.post("/customer/verifyResetPassword", customerController.verifyRecoveryPassword);

router.use("/customer", [middleware.verifyToken], customerRoutes);
router.use("/order", [middleware.verifyToken], orderRoutes);

module.exports = router;
