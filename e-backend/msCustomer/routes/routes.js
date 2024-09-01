const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer.controller");

router.post("/customer/sign-up", CustomerController.signUp);

module.exports = router;