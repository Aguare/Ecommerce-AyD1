const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.post('/getProductsByCategory', productController.getProductsByCategory);
router.get('/getProductsWithCategory', productController.getProductsWithCategory);
router.post('/getProductsForCart', productController.getProductsForCart);
router.get('/getProducts', productController.getProducts);
router.post('/saveProduct', productController.saveProduct);
router.get('/getProductById', productController.getProductById);

module.exports = router;