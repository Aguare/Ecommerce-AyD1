/** @format */

const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.get("/user/image/:id", usersController.getImageProfile);
router.get("/user/information/:username", usersController.getProfileInformation);
router.put("/user/information/:id", usersController.updateUserInformation);
router.post("/validate2FA", usersController.validate2FA);
router.post("/validateCode2FA", usersController.verifyCode2FA);

module.exports = router;
