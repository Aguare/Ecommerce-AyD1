const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin.controller')

router.get('/getPages', adminController.getPages)

module.exports = router;

