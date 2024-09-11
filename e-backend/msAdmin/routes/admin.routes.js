const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin.controller')

router.get('/getPages/:id', adminController.getPages)

module.exports = router;

