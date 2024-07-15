const express = require("express");
const {
  postProductController,
  getProductByIdController,
  putProductController,
  getAllProductsController,
  postCategoryController,
  getAllCategoriesController,
} = require("./products.controller");
const { verifyTokenMiddleware } = require("../auth/auth.middleware");

const productRouter = express.Router();

productRouter.get("/", getAllProductsController);

productRouter.get("/categories", getAllCategoriesController);

productRouter.post("/", verifyTokenMiddleware, postProductController);

productRouter.post(
  "/categories",
  verifyTokenMiddleware,
  postCategoryController
);

productRouter.get("/:pid", getProductByIdController);

productRouter.put("/:pid", verifyTokenMiddleware, putProductController);

module.exports = { productRouter };
