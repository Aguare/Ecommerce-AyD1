const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");

router.post('/upload/product', uploadController.uploadImageP);
router.post('/upload/client', uploadController.uploadImageC);
router.post('/upload/admin', uploadController.uploadImageA);

module.exports = router;
