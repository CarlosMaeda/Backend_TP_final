const { customError } = require("../errors/customManager.error");
const {
  insertarProducto,
  seleccionarProductoPorId,
  actualizarProducto,
  seleccionarProductos,
  insertarCategoria,
  buscarCategorias,
} = require("./products.repository");
const {
  validarPropiedadesProducto,
  validacionesActualizacion,
} = require("./utils/validarProductos");

let counter = 0;
const designarImagen = () => {
  if (counter < 650) {
    counter = counter + 1;
  } else {
    counter = 0;
  }
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${counter}.svg`;
  return image;
};
const crearProducto = async (producto) => {
  try {
    const image = designarImagen();
    const state = "activo";
    producto = { ...producto, image, state };
    const paso = validarPropiedadesProducto(producto);

    if (paso) {
      const idCreado = await insertarProducto(producto);
      return {
        ok: true,
        message: `Producto creado con id ${idCreado}`,
        idCreado: idCreado,
      };
    } else {
      throw new customError(
        false,
        "Exception: No se pasaron las validaciones",
        400
      );
    }
  } catch (error) {
    if (error.status) {
      throw error;
    } else {
      throw new customError(false, "Error interno del servidor", 500);
    }
  }
};

const obtenerProductos = async () => {
  try {
    const productos = await seleccionarProductos();
    if (productos.length === 0) {
      throw new customError(false, "No hay productos", 404);
    }
    return {
      status: 200,
      message: "productos obtenidos",
      productos: productos,
    };
  } catch (error) {
    throw error;
  }
};

const obtenerProductoPorId = async (pid) => {
  try {
    const producto = await seleccionarProductoPorId(pid);
    return { ok: true, status: 200, data: producto };
  } catch (error) {
    if (error.status) {
      throw error;
    } else {
      throw new customError(false, "Error interno del servidor", 500);
    }
  }
};

const actualizarProductoPorId = async (pid, producto) => {
  try {
    const paso_validacion = validacionesActualizacion(producto);
    const id_valido = await seleccionarProductoPorId(pid);
    if (paso_validacion && id_valido) {
      await actualizarProducto(pid, producto);
      return {
        ok: true,
        status: 200,
        message: `Producto con id ${pid} actualizado correctamente`,
      };
    } else {
      throw new customError(
        false,
        "Exception: No se pasaron las validaciones",
        400
      );
    }
  } catch (error) {
    if (error.status) {
      throw error;
    } else {
      throw new customError(false, "Error interno del servidor", 500);
    }
  }
};

const crearCategoria = async (categoria) => {
  try {
    const idCreado = await insertarCategoria(categoria);
    return {
      ok: true,
      message: `Categoría creada con id ${idCreado}`,
      idCreado: idCreado,
    };
  } catch (error) {
    if (error.status) {
      throw error;
    } else {
      throw new customError(false, "Error interno del servidor", 500);
    }
  }
};

const obtenerCategorias = async () => {
  try {
    const categorias = await buscarCategorias();
    if (categorias.length === 0) {
      throw new customError(false, "No hay categorias", 404);
    }
    return {
      status: 200,
      message: "Categorias obtenidas",
      categorias: categorias,
    };
  } catch (error) {
    if (error.status) {
      throw error;
    } else {
      throw new customError(
        false,
        "SQL_Error: al intentar insertar en la base de datos",
        500
      );
    }
  }
};

module.exports = {
  crearProducto,
  obtenerProductoPorId,
  actualizarProductoPorId,
  obtenerProductos,
  crearCategoria,
  obtenerCategorias,
};
