const express = require("express");
const {
  loginController,
  registerController,
  verifyTokenController,
  addressController,
} = require("./auth.controller");
const { verifyTokenMiddleware } = require("./auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);

authRouter.get("/verify-token", verifyTokenController);

authRouter.put(
  "/user/:uid/direccion",
  verifyTokenMiddleware,
  addressController
);

module.exports = { authRouter };
