const { pool } = require("../config/connection.db");
const { customError } = require("../errors/customManager.error");

const obtenerOCrearCarrito = async (usuario_id) => {
  try {
    const consulta = "SELECT * FROM carritos WHERE Usuario_ID = ?";
    let [carritos] = await pool.query(consulta, [usuario_id]);

    if (carritos.length === 0) {
      const insertarCarritoStr = "INSERT INTO carritos (Usuario_ID) VALUES (?)";
      await pool.query(insertarCarritoStr, [usuario_id]);
      [carritos] = await pool.query(consulta, [usuario_id]);
    }

    return carritos[0];
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

const agregarAlCarrito = async (carrito_id, producto_id, cantidad) => {
  try {
    const consultaProductosCarrito =
      "SELECT * FROM carritos_productos WHERE Carrito_ID = ? AND Producto_ID = ?";

    const [productos] = await pool.query(consultaProductosCarrito, [
      carrito_id,
      producto_id,
    ]);
    const consultaProducto = "SELECT * FROM productos WHERE Producto_ID = ?";

    const [producto] = await pool.query(consultaProducto, [producto_id]);
    const precio = producto[0].Precio;
    const stock = producto[0].Stock;

    /* 
    SELECT p.Producto_ID, p.Nombre, p.Precio, p.Imagen, cp.Unidades
    FROM productos p
    INNER JOIN carritos_productos cp ON p.Producto_ID = cp.Producto_ID
    WHERE cp.Carrito_ID = 1 AND cp.Producto_ID = 3;
     */

    if (productos.length === 0) {
      if (stock < cantidad) {
        throw new customError(
          false,
          ` No hay suficiente stock del producto: ${producto[0].Nombre} `,
          404,
          `Stock: ${stock}, Cantidad solicitada: ${cantidad}`
        );
      } else {
        const insertarProducto =
          "INSERT INTO carritos_productos (Carrito_ID, Producto_ID, Unidades, Precio) VALUES (?, ?, ?, ?)";

        await pool.query(insertarProducto, [
          carrito_id,
          producto_id,
          cantidad,
          precio,
        ]);
        const actualizarStock =
          "UPDATE productos SET Stock = Stock - ? WHERE Producto_ID = ?";
        await pool.query(actualizarStock, [cantidad, producto_id]);
      }
    } else if (stock < cantidad) {
      throw new customError(
        false,
        ` No hay suficiente stock del producto: ${producto[0].Nombre} `,
        404,
        `Stock: ${stock}, Cantidad solicitada: ${cantidad}`
      );
    } else {
      const actualizarProductoCarrito =
        "UPDATE carritos_productos SET Unidades = Unidades + ?, Precio = ? WHERE Carrito_ID = ? AND Producto_ID = ?";

      await pool.query(actualizarProductoCarrito, [
        cantidad,
        precio,
        carrito_id,
        producto_id,
      ]);
      const actualizarStock =
        "UPDATE productos SET Stock = Stock - ? WHERE Producto_ID = ?";
      await pool.query(actualizarStock, [cantidad, producto_id]);
    }
  } catch (error) {
    console.error(
      "SQL_ERROR al agregar un producto al carrito-agregar al carrito",
      error
    );
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

const obtenerDetalleCarrito = async (carrito_id) => {
  try {
    const consulta =
      "SELECT productos.*, carritos_productos.Unidades, carritos_productos.Total FROM carritos_productos INNER JOIN productos ON carritos_productos.Producto_ID = productos.Producto_ID WHERE Carrito_ID = ?";

    const [carrito] = await pool.query(consulta, [carrito_id]);
    return carrito;
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

const eliminarProductoDelCarrito = async (carrito_id, pid) => {
  try {
    const unidades =
      "SELECT Unidades FROM carritos_productos WHERE Carrito_ID = ? AND Producto_ID = ?";
    const [unidadesCarrito] = await pool.query(unidades, [carrito_id, pid]);
    console.log("UnidadesCarrito: ", unidadesCarrito[0].Unidades);
    const consulta =
      "DELETE FROM carritos_productos WHERE Carrito_ID = ? AND Producto_ID = ?";
    await pool.query(consulta, [carrito_id, pid]);

    const actualizarStock =
      "UPDATE productos SET Stock = Stock + ? WHERE Producto_ID = ?";
    await pool.query(actualizarStock, [unidadesCarrito[0].Unidades, pid]);
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

const restarDelCarrito = async (carrito_id, producto_id, cantidad) => {
  try {
    const consultaProductosCarrito =
      "SELECT * FROM carritos_productos WHERE Carrito_ID = ? AND Producto_ID = ?";

    const [productos] = await pool.query(consultaProductosCarrito, [
      carrito_id,
      producto_id,
    ]);
    console.log("Restar del carrito-1: ", productos);

    const consultaProducto = "SELECT * FROM productos WHERE Producto_ID = ?";

    const [producto] = await pool.query(consultaProducto, [producto_id]);
    console.log("Restar del carrito-2: ", producto);

    const precio = producto[0].Precio;
    const stock = producto[0].Stock;
    const unidades = productos[0].Unidades;

    /* const consulta =
      "SELECT p.*, cp.Unidades, cp.Carrito_Producto_ID FROM productos p INNER JOIN carritos_productos cp ON p.Producto_ID = cp.Producto_ID WHERE cp.Carrito_ID = ? AND cp.Producto_ID = ?";

    const [carrito] = await pool.query(consulta, [carrito_id, producto_id]);
    console.log("Restar del carrito: ", carrito); */
    if (productos.length === 0) {
      throw new customError(
        false,
        `El producto con id: ${producto_id}, no se ha encontrado`,
        404
      );
    }

    if (unidades === cantidad) {
      console.log(
        "Se va a eliminar el producto del carrito",
        unidades === cantidad
      );
      /* await eliminarProductoDelCarrito(
        carrito_id,
        producto_id
      ); */
    }
    if (unidades > cantidad) {
      console.log("Se va a restar del carrito", unidades > cantidad);

      const actualizarProductoCarrito =
        "UPDATE carritos_productos SET Unidades = Unidades - ? WHERE Carrito_ID = ? AND Producto_ID = ?";

      const [actualizarProductoCarritoQuery] = await pool.query(
        actualizarProductoCarrito,
        [cantidad, carrito_id, producto_id]
      );

      const actualizarStockRestar =
        "UPDATE productos SET Stock = Stock + ? WHERE Producto_ID = ?";

      const [actualizarCarritoQuery] = await pool.query(actualizarStockRestar, [
        cantidad,
        producto_id,
      ]);

      if (actualizarProductoCarritoQuery.affectedRows !== 0) {
        return true;
      }

      if (actualizarProductoCarritoQuery.affectedRows === 0) {
        throw new customError(
          false,
          "No se ha podido actualizar el carrito",
          500
        );
      }

      if (unidades < cantidad) {
        throw new customError(
          false,
          "No se ha podido actualizar el carrito, la cantidad supera las unidades disponibles en el carrito",
          500
        );
      }
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

module.exports = {
  obtenerOCrearCarrito,
  agregarAlCarrito,
  obtenerDetalleCarrito,
  eliminarProductoDelCarrito,
  restarDelCarrito,
};
