const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin.routes');
const usersRoutes = require('./users.routes');
const middleware = require('../../middleware/verifytoken.middleware'); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/admin', [middleware.verifyToken], adminRoutes);
router.use('/users', [middleware.verifyToken], usersRoutes);

module.exports = router;
