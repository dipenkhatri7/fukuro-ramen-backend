const express = require("express");
const menuController = require("../controllers/menuController");
const authController = require("../controllers/authController");
// Routes
const menuRouter = express.Router();

// menuRouter.param("id", menuController.checkId);

menuRouter
  .route("/popular-menu")
  .get(menuController.aliasPopularMenus, menuController.getAllMenus);

menuRouter.route("/menu-stats").get(menuController.getMenuStats);

menuRouter
  .route("/")
  .get(authController.protect, menuController.getAllMenus)
  .post(menuController.createMenu);

menuRouter
  .route("/:id")
  .get(menuController.getMenu)
  .patch(menuController.updateMenu)
  .delete(menuController.deleteMenu);

module.exports = menuRouter;
