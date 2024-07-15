const dotenv = require("dotenv");
dotenv.config();
const {
  buscarUsuarioPorEmail,
  insertarUsuario,
  buscarUsuarioPorUsername,
  obtenerCredenciales,
  actualizarDireccion,
} = require("./auth.repository");
const bcrypt = require("bcrypt");
const { validacionUsuario } = require("./utils/validarUsuario.util");
const jwt = require("jsonwebtoken");
const { customError } = require("../errors/customManager.error");
const { generadorUuidv4 } = require("./utils/uuidGenerador.util");
const SAL = parseInt(process.env.SAL_BCRYPT);

const registerService = async (usuario) => {
  const { name, lastname, email, username, password } = usuario;

  try {
    validacionUsuario({ name, lastname, email, username, password });
    const existeEmail = await buscarUsuarioPorEmail(email);
    const existeUsername = await buscarUsuarioPorUsername(username);

    if (existeEmail) {
      throw new customError(false, "El email ya se encuentra registrado", 400);
    }
    if (existeUsername) {
      throw new customError(
        false,
        "El username ya se encuentra registrado",
        400
      );
    }
    /* Encriptar contraseña */
    const hashedPassword = await bcrypt.hash(password, SAL);

    const UUID = generadorUuidv4();

    const insertar = await insertarUsuario({
      name: name,
      lastname: lastname,
      email: email,
      username: username,
      password: hashedPassword,
      UUID: UUID,
    });
    if (insertar) {
      return {
        ok: true,
        message: "Usuario registrado con exito",
        status: 200,
      };
    } else {
      throw new customError(false, "Error al registrar el usuario", 500);
    }
  } catch (error) {
    throw error;
  }
};

const loginService = async (credenciales) => {
  const { email, username, password } = credenciales;
  try {
    validacionUsuario({ email, username, password });
    const usuarioEmail = await buscarUsuarioPorEmail(credenciales.email);
    const usuarioUsername = await buscarUsuarioPorUsername(
      credenciales.username
    );
    if (!usuarioEmail || !usuarioUsername) {
      throw new customError(false, "Credenciales incorrectas", 400);
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuarioUsername.Password_hash
    );
    if (!passwordCorrecta) {
      throw new customError(false, "Credenciales incorrectas", 400);
    }
    const Usuario_ID = usuarioUsername.Usuario_ID;
    const credencialesValidas = await obtenerCredenciales(Usuario_ID);
    const { Email, Username, Rol } = credencialesValidas;

    const token = jwt.sign(
      { Email, Username, Rol, Usuario_ID: Usuario_ID },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      ok: true,
      message: "Credenciales correctas",
      status: 200,
      token: token,
    };
  } catch (error) {
    if (error.status) {
      throw error;
    } else {
      throw new customError(false, "Error en el servidor", 500);
    }
  }
};

const nuevaDireccionService = async (uid, direccion) => {
  try {
    actualizarDireccion();
  } catch (error) {}
};

const actualizarDireccionService = async (uid, direccion) => {};

module.exports = {
  registerService,
  loginService,
  nuevaDireccionService,
  actualizarDireccionService,
};
