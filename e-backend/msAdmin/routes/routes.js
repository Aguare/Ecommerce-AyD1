/** @format */

const express = require("express");
const router = express.Router();
const adminRoutes = require("./admin.routes");
const usersRoutes = require("./users.routes");
const middleware = require("../../middleware/verifytoken.middleware");
const usersController = require("../controllers/users.controller");
const settingsRoutes = require("./settings.routes");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/login", usersController.login);

router.use("/admin", [middleware.verifyToken], adminRoutes);
router.use("/users", [middleware.verifyToken], usersRoutes);
router.use("/settings", [middleware.verifyToken], settingsRoutes);

module.exports = router;
