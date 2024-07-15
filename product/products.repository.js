const { pool } = require("../config/connection.db");
const { customError } = require("../errors/customManager.error");

const insertarProducto = async (producto) => {
  console.log("insertar:", producto.name);
  const { name, description, code, price, stock, image, state, category } =
    producto;

  try {
    const consultaCat = "SELECT * FROM categorias WHERE Categoria = ?";
    const [resultadoCat] = await pool.query(consultaCat, [category]);

    if (resultadoCat.length === 0) {
      throw new customError(false, "La categoria no existe", 404);
    }

    const category_id = resultadoCat[0].Categoria_ID;
    const consulta =
      "INSERT INTO productos (Nombre, Descripcion, Codigo, Precio, Stock, Imagen, Estado, Categoria_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [resultado] = await pool.query(consulta, [
      name,
      description,
      code,
      price,
      stock,
      image,
      state,
      category_id,
    ]);
    return resultado.insertId;
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

const seleccionarProductos = async () => {
  try {
    const consulta = "SELECT * FROM productos";
    const [resultado] = await pool.query(consulta);
    return resultado;
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

const seleccionarProductoPorId = async (pid) => {
  try {
    const consulta = "SELECT * FROM productos WHERE Producto_ID = ?";
    const [resultado] = await pool.query(consulta, [pid]);
    if (resultado.length === 0) {
      throw new customError(
        false,
        `El producto con id: ${pid}, no se ha encontrado`,
        404
      );
    } else {
      return resultado;
    }
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

const actualizarProducto = async (pid, producto) => {
  const { description, price, stock, image, state } = producto;
  try {
    const consulta =
      "UPDATE productos SET Precio =IFNULL(?, Precio), Stock =IFNULL(?, Stock), Imagen =IFNULL(?, Imagen), Estado =IFNULL(?, Estado) WHERE Producto_ID = ?";
    const [resultado] = await pool.query(consulta, [
      price,
      stock,
      image,
      state,
      pid,
    ]);
    if (resultado.affectedRows === 0) {
      throw new customError(
        false,
        `El producto con id: ${pid}, no se ha podido actualizar`,
        404
      );
    }
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

const buscarCategorias = async () => {
  try {
    const consulta = "SELECT * FROM categorias";
    const [resultado] = await pool.query(consulta);

    return resultado;
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
const insertarCategoria = async (categoria) => {
  try {
    const { category } = categoria;
    const consultaCat = "SELECT * FROM categorias WHERE Categoria = ?";
    const [resultadoCat] = await pool.query(consultaCat, [category]);

    if (resultadoCat.length !== 0) {
      throw new customError(false, "La categoria ya existe", 404);
    }
    const consulta = "INSERT INTO categorias (Categoria) VALUES (?)";
    const [resultado] = await pool.query(consulta, [category]);
    return resultado.insertId;
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
  insertarProducto,
  seleccionarProductoPorId,
  actualizarProducto,
  seleccionarProductos,
  insertarCategoria,
  buscarCategorias,
};
