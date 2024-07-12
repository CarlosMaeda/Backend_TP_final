const express = require("express");
const {
  postProductController,
  getProductByIdController,
  putProductController,
  getAllProductsController,
} = require("./products.controller");

const productRouter = express.Router();

productRouter.get("/", getAllProductsController);
/* agregar middleware de autorizacion y verificar que sea ADMINISTRADOR */
productRouter.post("/", postProductController);
productRouter.get("/:pid", getProductByIdController);
/* agregar middleware de autorizacion y verificar que sea ADMINISTRADOR */
productRouter.put("/:pid", putProductController);

module.exports = { productRouter };
