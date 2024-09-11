const express = require("express");
const router = express.Router();
const brandController = require('../controllers/brand.controller')

router.get('/getBrands', brandController.getBrands);
router.post('/saveBrand', brandController.saveBrand);
router.put('/updateBrand', brandController.updateBrand);
router.delete('/deleteBrand', brandController.deleteBrand);

module.exports = router;