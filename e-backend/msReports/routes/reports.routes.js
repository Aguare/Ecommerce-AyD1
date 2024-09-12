/** @format */

const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");

router.post("/listReports", reportsController.listReports);


module.exports = router;
