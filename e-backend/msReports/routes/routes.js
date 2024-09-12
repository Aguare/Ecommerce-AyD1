/** @format */

const express = require("express");
const router = express.Router();
const reportsRoutes = require("./reports.routes");
const middleware = require("../../middleware/verifytoken.middleware");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/reports", [middleware.verifyToken], reportsRoutes);

module.exports = router;
