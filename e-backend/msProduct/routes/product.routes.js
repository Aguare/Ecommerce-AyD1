const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.post('/getProductsByCategory', productController.getProductsByCategory);
router.get('/getProductsWithCategory', productController.getProductsWithCategory);
router.post('/getProductsForCart', productController.getProductsForCart);
router.get('/getProductById/:id', productController.getProductById);
router.get('/getStockProductById/:id', productController.getStockProductById);

module.exports = router;