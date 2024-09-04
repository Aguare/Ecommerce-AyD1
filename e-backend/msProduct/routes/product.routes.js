const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.post('/getProductsByCategory', productController.getProductsByCategory);
router.post('/getProductsForCart', productController.getProductsForCart);

module.exports = router;