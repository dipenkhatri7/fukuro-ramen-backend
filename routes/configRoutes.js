const express = require("express");
const configController = require("../controllers/configController");
const authController = require("../controllers/authController");

const configRouter = express.Router();

configRouter.route("/").get(configController.getAllConfigs);
