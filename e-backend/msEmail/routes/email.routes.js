const express = require("express");
const router = express.Router();
const emailController = require('../controllers/email.controller')

router.post('/sendVerificationEmail', emailController.sendVerificationEmail);
router.post('/verify-email', emailController.verifyEmail);
router.post('/sendRecoveryPasswordEmail', emailController.sendRecoveryPasswordEmail);
router.post('/validateEmail', emailController.validateEmailUser);

module.exports = router;

