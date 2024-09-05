const express = require("express");
const router = express.Router();
const categoriesController = require('../controllers/category.controller')

router.get('/getCategories', categoriesController.getCategories);

module.exports = router;