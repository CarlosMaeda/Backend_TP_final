// helpers/Validations.helpers.js

const { customError } = require("../errors/customManager.error");

const validacionExistencia = (valor) => {
  return Boolean(valor);
};

const validacionEmail = (email) => {
  return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
};

const validacionUsername = (username) => {
  return /^[a-zA-Z0-9\_\-]{4,16}$/.test(username);
};

const validacionURL = (url) => {
  return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
};

const validacionFecha = (fecha) => {
  const moment = require("moment");

  if (!moment(fecha, moment.ISO_8601).isValid()) {
    return false;
  }

  return true;
};

const validacionEstado = (estado) => {
  const estadosPermitidos = ["activo", "inactivo"];
  return estadosPermitidos.includes(estado);
};

module.exports = {
  validacionEmail,
  validacionExistencia,
  validacionUsername,
  validacionURL,
  validacionFecha,
  validacionEstado,
};
