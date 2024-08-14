const { Router } = require("express");
const express = require("express");
const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

module.exports = router;
