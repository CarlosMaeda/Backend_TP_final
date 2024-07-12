const { customError } = require("../../errors/customManager.error");
const {
  validacionExistencia,
  validacionEmail,
  validacionUsername,
} = require("../../helpers/validations.helper");

const validacionUsuario = (usuario) => {
  if (!validacionExistencia(usuario.email)) {
    throw new customError(false, "Inexistent email", 400);
  }
  if (!validacionExistencia(usuario.password)) {
    throw new customError(false, "Inexistent password", 400);
  }
  if (!validacionExistencia(usuario.username)) {
    throw new customError(false, "Inexistent username", 400);
  }
  if (!validacionEmail(usuario.email)) {
    throw new customError(
      false,
      "Login incorrecto - verifique sus credenciales",
      400
    );
  }
  if (!validacionUsername(usuario.username)) {
    throw new customError(
      false,
      "Login incorrecto - verifique sus credenciales",
      400
    );
  }
};

module.exports = { validacionUsuario };
