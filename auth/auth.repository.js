const { pool } = require("../config/connection.db");
const { customError } = require("../errors/customManager.error");
const { generadorUuidv4 } = require("./utils/uuidGenerador.util");

const buscarUsuarioPorEmail = async (email) => {
  try {
    const consulta = "SELECT * FROM personas WHERE email = ?";
    const [resultado] = await pool.query(consulta, [email]);

    if (resultado.length === 0) {
      return null;
    } else {
      return resultado[0];
    }
  } catch (error) {
    throw new customError(
      false,
      "SQL_Error: al intentar buscar en la base de datos",
      500
    );
  }
};

const buscarUsuarioPorUsername = async (username) => {
  try {
    const consulta = "SELECT * FROM usuarios WHERE username = ?";
    const [resultado] = await pool.query(consulta, [username]);
    if (resultado.length === 0) {
      return null;
    } else {
      return resultado[0];
    }
  } catch (error) {
    throw new customError(
      false,
      "SQL_Error: al intentar buscar en la base de datos",
      500
    );
  }
};

const verificarUuid = async (UUID) => {
  try {
    const consulta = "SELECT * FROM uuid_usadas WHERE UUID = ?";
    for (let i = 0; i < 3; i++) {
      const [resultado] = await pool.query(consulta, [UUID]);
      if (resultado.length === 0) {
        return true;
      }
      if (i === 2) {
        throw new customError(false, "Error al registrar el usuario", 500);
      }
      generadorUuidv4();
    }
  } catch (error) {
    throw error;
  }
};

const insertarUsuario = async (usuario) => {
  const { name, lastname, email, username, password, UUID } = usuario;

  try {
    verificarUuid(UUID);
    const consultaPersona =
      "INSERT INTO personas (Nombres, Apellidos, Email, Persona_UUID) VALUES (?, ?, ?, ?)";
    const [resultadoPersona] = await pool.query(consultaPersona, [
      name,
      lastname,
      email,
      UUID,
    ]);

    const consultaUsuario =
      "INSERT INTO usuarios (Username, Password_hash, Persona_UUID) VALUES (?, ?, ?)";
    const [resultadoUsuario] = await pool.query(consultaUsuario, [
      username,
      password,
      UUID,
    ]);

    const consultaUUID = "INSERT INTO uuid_usadas (UUID) VALUES (?)";
    await pool.query(consultaUUID, [UUID]);

    const resultadoRol = "INSERT INTO usuarios_roles (Usuario_ID) VALUES (?)";
    await pool.query(resultadoRol, [resultadoUsuario.insertId]);

    return true;
  } catch (error) {
    throw new customError(
      false,
      "SQL_Error: al intentar insertar en la base de datos",
      500
    );
  }
};

const obtenerCredenciales = async (Usuario_ID) => {
  console.log("obtenerCredenciales - Usuario_ID:", Usuario_ID);
  try {
    const consulta =
      "SELECT p.Email, u.Username, r.Rol FROM personas p INNER JOIN usuarios u ON p.Persona_UUID = u.Persona_UUID INNER JOIN usuarios_roles ur ON u.Usuario_ID = ur.Usuario_ID INNER JOIN roles r ON ur.Rol_ID = r.Rol_ID WHERE u.Usuario_ID = ?";
    const [credenciales] = await pool.query(consulta, [Usuario_ID]);
    return credenciales[0];
  } catch (error) {
    throw new customError(
      false,
      "SQL_Error: al intentar buscar en la base de datos",
      500
    );
  }
};

const actualizarDireccion = async (Email, Direccion) => {
  try {
  } catch (error) {
    throw new customError(
      false,
      "SQL_Error: al intentar buscar en la base de datos",
      500
    );
  }
};

module.exports = {
  buscarUsuarioPorEmail,
  buscarUsuarioPorUsername,
  insertarUsuario,
  obtenerCredenciales,
  actualizarDireccion,
};
