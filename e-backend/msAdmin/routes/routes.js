const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin.routes') 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/admin', adminRoutes);

module.exports = router;
