// product/utils/validarProductos.js

const { customError } = require("../../errors/customManager.error");
const {
  validacionEstado,
  validacionURL,
} = require("../../helpers/validations.helper");

const PROPIEDADES_NECESARIAS = [
  "name",
  "description",
  "code",
  "price",
  "stock",
  "image",
  "state",
  "category",
];

const VALIDACIONES_PRODUCTO = {
  name: {
    validacion: (valor) => {
      return Boolean(valor) && typeof valor === "string" && valor.length > 3;
    },
    errorText:
      "Titulo debe ser un valor verdadero con una longitud mayor a 3 caracteres",
  },
  description: {
    validacion: (valor) => {
      return (
        Boolean(valor) &&
        isNaN(valor) &&
        valor.length > 20 &&
        typeof valor === "string"
      );
    },
    errorText: "El la descripcion debe ser un string de mas de 20 caracteres",
  },
  code: {
    validacion: (valor) => {
      return Boolean(valor) && valor.length > 3;
    },
    errorText: "El codigo debe ser un string de mas de 3 caracteres",
  },
  price: {
    validacion: (valor) => {
      return Boolean(valor) && !isNaN(valor) && valor > 1;
    },
    errorText: "Precio debe ser un numero positivo mayor que 1",
  },
  stock: {
    validacion: (valor) => {
      return Boolean(valor) && !isNaN(valor) && valor >= 0;
    },
    errorText: "El stock debe ser un numero valido mayor a 0",
  },
  image: {
    validacion: (valor) => {
      console.log("image-valor", valor);
      const urlImagen = validacionURL(valor);
      console.log("image-urlImagen", urlImagen);
      return urlImagen;
    },
    errorText:
      "Imagen no válida. Debe ser una URL válida y un formato de imagen compatible.",
  },
  state: {
    validacion: (valor) => {
      console.log("state-valor", valor);
      const stateValue = validacionEstado(valor);
      console.log("state-stateValue", stateValue);
      return stateValue;
    },
    errorText:
      "Estado no válido. Debe ser uno de los siguientes: activo, inactivo.",
  },
};

const validacionesProductos = (producto) => {
  console.log("validacion", producto);
  try {
    for (let propiedad in VALIDACIONES_PRODUCTO) {
      let valor = producto[propiedad];
      if (!VALIDACIONES_PRODUCTO[propiedad].validacion(valor)) {
        throw new customError(
          false,
          VALIDACIONES_PRODUCTO[propiedad].errorText,
          400
        );
      }
    }

    return true;
  } catch (error) {
    console.log("Error en la validación", error);
    throw error;
  }
};

const validacionesActualizacion = (producto) => {
  const propiedades_actualizar = Object.keys(producto);
  try {
    for (let i = 0; i < propiedades_actualizar.length; i++) {
      let valor = propiedades_actualizar[i];

      if (!VALIDACIONES_PRODUCTO[valor].validacion(producto[valor])) {
        throw new customError(
          false,
          VALIDACIONES_PRODUCTO[valor].errorText,
          400
        );
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
};

const validarPropiedadesProducto = (producto) => {
  try {
    const propiedades_producto = Object.keys(producto);
    const propiedades_faltantes = [];
    const propiedades_sobrantes = [];
    for (let propiedades_necesaria of PROPIEDADES_NECESARIAS) {
      if (!propiedades_producto.includes(propiedades_necesaria)) {
        propiedades_faltantes.push(propiedades_necesaria);
      }
    }
    if (propiedades_faltantes.length > 0) {
      throw new customError(
        false,
        "Faltan las propiedades [" + propiedades_faltantes.join(", ") + "]",
        400
      );
    }
    for (let propiedad of propiedades_producto) {
      if (!PROPIEDADES_NECESARIAS.includes(propiedad)) {
        propiedades_sobrantes.push(propiedad);
      }
    }
    if (propiedades_sobrantes.length > 0) {
      throw new customError(
        false,
        "Sobran las propiedades [" + propiedades_sobrantes.join(", ") + "]",
        400
      );
    }
    validacionesProductos(producto);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validarPropiedadesProducto,
  validacionesActualizacion,
};
