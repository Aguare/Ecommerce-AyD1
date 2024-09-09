/** @format */

const express = require("express");
const router = express.Router();
const emailRoutes = require("./email.routes");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/email", emailRoutes);

module.exports = router;
