/** @format */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/getProductsByCategory", productController.getProductsByCategory);
router.get("/getProductsWithCategory/:id", productController.getProductsWithCategory);
router.get("/getProductsForCart/:id", productController.getProductsForCart);
router.get("/getProductDetailById/:id", productController.getProductDetailById);
router.get("/getStockProductById/:id", productController.getStockProductById);
router.post('/getProductsByCategory', productController.getProductsByCategory);
router.get('/getProductsWithCategory', productController.getProductsWithCategory);
router.post('/getProductsForCart', productController.getProductsForCart);
router.get('/getProducts', productController.getProducts);
router.post('/saveProduct', productController.saveProduct);
router.get('/getProductById', productController.getProductById);
router.put('/updateDataProduct', productController.updateDataProduct);
router.put('/updateAttributesProduct', productController.updateAttributesProduct);
router.get("/getBranchesWithProduct", productController.getBranchesWithProduct);

module.exports = router;
