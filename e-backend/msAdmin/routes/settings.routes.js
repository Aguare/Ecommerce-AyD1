const express = require("express");
const router = express.Router();

const settingsController = require("../controllers/settings.controller");

router.get("/find/:name", settingsController.getSettings);
router.put("/update", settingsController.updateSettings);

router.get("/tabs", settingsController.getTabs);

module.exports = router;