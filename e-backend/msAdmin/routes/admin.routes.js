/** @format */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.get("/getPages/:id", adminController.getPages);
router.post("/addEmployee", adminController.addEmployee);
router.get("/getRoles", adminController.getRoles);
router.post("/addRole", adminController.addRole);
router.put("/updateRole", adminController.updateRole);
router.get("/getAllRolePages", adminController.getAllRolePages);
router.put("/updateRolePages", adminController.updateRolePages);

module.exports = router;
