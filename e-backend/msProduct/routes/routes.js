const express = require('express');
const router = express.Router();
const productRoutes = require('./product.routes');
const categoriesRoutes = require('./categories.routes');
const brandRoutes = require('./brand.routes');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/product', productRoutes);
router.use('/categories', categoriesRoutes);
router.use('/brand', brandRoutes);

module.exports = router;
