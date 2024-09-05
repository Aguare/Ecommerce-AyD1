const express = require("express");
const router = express.Router();
const usersController = require('../controllers/users.controller')

router.post('/login', usersController.login)
router.put('/update/user/information/:id', usersController.updateUserInformation)

module.exports = router;