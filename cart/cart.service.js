const {
  obtenerOCrearCarrito,
  agregarAlCarrito,
  obtenerDetalleCarrito,
  eliminarProductoDelCarrito,
  restarDelCarrito,
} = require("./cart.repository");

const agregarAlCarritoService = async (datos) => {
  try {
    const { usuario_id, producto_id, cantidad } = datos;
    const carrito = await obtenerOCrearCarrito(usuario_id);
    const carritoId = carrito.Carrito_ID;
    await agregarAlCarrito(carritoId, producto_id, cantidad);
    return { status: 200, message: "Producto agregado con exito" };
  } catch (error) {
    throw error;
  }
};

const obtenerCarritoService = async (usuario_id) => {
  try {
    const carrito = await obtenerOCrearCarrito(usuario_id);
    const carritoId = carrito.Carrito_ID;
    const carritoDetallado = await obtenerDetalleCarrito(carritoId);
    return {
      status: 200,
      message: "Carrito Obtenido",
      carrito: carritoDetallado,
    };
  } catch (error) {
    throw error;
  }
};

const eliminarProductoDelCarritoService = async (usuario_id, pid) => {
  try {
    const carrito = await obtenerOCrearCarrito(usuario_id);
    await eliminarProductoDelCarrito(carrito.Carrito_ID, pid);
    const carritoDetallado = await obtenerDetalleCarrito(carrito.Carrito_ID);
    return {
      status: 200,
      message: "Producto eliminado con exito",
      carrito: carritoDetallado,
    };
  } catch (error) {
    throw error;
  }
};

const quitarDelCarritoService = async (datos) => {
  try {
    const { usuario_id, producto_id, cantidad } = datos;

    const carrito = await obtenerOCrearCarrito(usuario_id);
    const carritoId = carrito.Carrito_ID;

    await restarDelCarrito(carritoId, producto_id, cantidad);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  agregarAlCarritoService,
  obtenerCarritoService,
  eliminarProductoDelCarritoService,
  quitarDelCarritoService,
};
