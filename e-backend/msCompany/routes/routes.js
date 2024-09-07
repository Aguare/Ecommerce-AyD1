const express = require("express");
const router = express.Router();
const companyRoutes = require("./company.routes");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/company", companyRoutes);

module.exports = router;