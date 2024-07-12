const express = require("express");
const {
  postCartController,
  getCartController,
  deleteProductFromCartController,
  patchProductInCartController,
} = require("./cart.controller");

const { verifyTokenMiddleware } = require("../auth/auth.middleware");

const cartRouter = express.Router();

cartRouter.get("/", verifyTokenMiddleware, getCartController);

cartRouter.post("/", verifyTokenMiddleware, postCartController);

cartRouter.delete(
  "/:pid",
  verifyTokenMiddleware,
  deleteProductFromCartController
);

cartRouter.patch("/", verifyTokenMiddleware, patchProductInCartController);

module.exports = { cartRouter };
