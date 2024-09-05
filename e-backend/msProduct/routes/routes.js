const express = require('express');
const router = express.Router();
const productRoutes = require('./product.routes');
const categoriesRoutes = require('./categories.routes');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/product', productRoutes);
router.use('/categories', categoriesRoutes);

module.exports = router;
