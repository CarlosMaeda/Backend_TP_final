const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 4500;
const cors = require("cors");

const { testRouter } = require("./test/test.routes");
const { authRouter } = require("./auth/auth.routes");
const { testConnection } = require("./config/connection.db");
const { productRouter } = require("./product/products.routes");
const { cartRouter } = require("./cart/cart.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.use("/api", testRouter);

app.get("/", (req, res) => {
  res.send("Respuesta desde el servidor ¡INICIADO!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  if (testConnection()) {
    console.log("Base de datos conectada");
  }
});
