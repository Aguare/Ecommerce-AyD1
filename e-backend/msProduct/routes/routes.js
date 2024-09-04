const express = require('express');
const router = express.Router();
const productRoutes = require('./product.routes');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/product', productRoutes);

module.exports = router;
