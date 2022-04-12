const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController.js");

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.put(
  "/updatepic",
  authController.protect,
  authController.updatePicture
);
authRouter.put(
  "/updatescore",
  authController.protect,
  authController.updateScore
);
authRouter.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePasswordLoggedIn
);
authRouter.post("/forgotpassword", authController.forgotPassword);

authRouter.patch("/resetpassword/:token", authController.resetPassword);

authRouter.patch("/updateMe", authController.protect, authController.updateMe);

authRouter.delete("/deleteMe", authController.protect, authController.deleteMe);

module.exports = authRouter;
