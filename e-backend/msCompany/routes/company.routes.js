const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");

router.get("/settings/:name", companyController.getSettings);
router.put("/settings", companyController.updateSettings);

router.get("/tabs", companyController.getTabs);

module.exports = router;