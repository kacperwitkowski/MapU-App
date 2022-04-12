const express = require("express");
const roadsController = require("../controllers/roadsController.js");
const authController = require("../controllers/authController.js");

const roadsRouter = express.Router();

roadsRouter.post(
  "/createroad",
  authController.protect,
  roadsController.createRoad
);
roadsRouter.get("/myroads", authController.protect, roadsController.getMyRoads);
roadsRouter.delete(
  "/deleteroad/:postID",
  authController.protect,
  roadsController.deleteRoad
);

roadsRouter.patch(
  "/updateTour/:postID",
  authController.protect,
  roadsController.updateTour
);

module.exports = roadsRouter;
