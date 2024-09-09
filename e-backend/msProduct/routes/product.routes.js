const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.post('/getProductsByCategory', productController.getProductsByCategory);
router.get('/getProductsWithCategory/:id', productController.getProductsWithCategory);
router.post('/getProductsForCart', productController.getProductsForCart);
router.get('/getProductById/:id', productController.getProductById);
router.get('/getStockProductById/:id', productController.getStockProductById);

router.get('/getBranchesWithProduct', productController.getBranchesWithProduct);

module.exports = router;