const { validacionExistencia } = require("../helpers/validations.helper");
const jwt = require("jsonwebtoken");
const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (
    !validacionExistencia(token) ||
    !isNaN(token) ||
    token === "null" ||
    token === "undefined"
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "Debes proporcionar un token valido" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, datos) => {
    console.log("Error_Verify:", error);
    console.log("Datos_Verify:", datos);
    if (error) {
      return res
        .status(401)
        .json({ status: 401, message: "Sin autorizacion token invalido" });
    } else {
      req.user = datos;
      console.log("req.user-middleware:", req.user);
      next();
    }
  });
};

module.exports = { verifyTokenMiddleware };