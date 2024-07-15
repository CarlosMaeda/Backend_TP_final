const { customError } = require("../errors/customManager.error");
const { validacionExistencia } = require("../helpers/validations.helper");
const {
  registerService,
  loginService,
  nuevaDireccionService,
} = require("./auth.service");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const { name, lastname, email, username, password, UUID } = req.body;
  try {
    const result = await registerService({
      name: name,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
      Persona_UUID: UUID,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const loginController = async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);
  try {
    const resultado = await loginService({ email, username, password });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const verifyTokenController = async (req, res) => {
  const token = req.headers["authorization"];
  try {
    if (
      !validacionExistencia(token) ||
      isNaN(token) ||
      token === "null" ||
      token === "undefined"
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Debes proporcionar un token valido" });
    }
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    if (!datos) {
      return res
        .status(401)
        .json({ status: 401, message: "Sin autorizacion token invalido" });
    }
    res.status(200).json({ status: 200, message: "Token valido" });
  } catch (error) {
    console.error(error);
    throw new customError(false, "Error en el servidor", 500);
  }
};

const addressController = async (req, res) => {
  const {
    calle,
    altura,
    piso,
    departamento,
    localidad,
    provincia,
    codigoPostal,
  } = req.body;
  try {
    const result = await nuevaDireccionService({
      calle: calle,
      altura: altura,
      piso: piso,
      departamento: departamento,
      localidad: localidad,
      provincia: provincia,
      codigoPostal: codigoPostal,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports = {
  registerController,
  loginController,
  verifyTokenController,
  addressController,
};
