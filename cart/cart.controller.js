const {
  agregarAlCarritoService,
  obtenerCarritoService,
  eliminarProductoDelCarritoService,
  quitarDelCarritoService,
} = require("./cart.service");

const postCartController = async (req, res) => {
  try {
    const { producto_id, cantidad } = req.body;
    const usuario = req.user;
    if (usuario.Rol === "Usuario") {
      const resultado = await agregarAlCarritoService({
        usuario_id: usuario.Usuario_ID,
        producto_id,
        cantidad,
      });
      res.status(resultado.status).json(resultado);
    } else {
      res.status(401).json({ status: 401, message: "Sin autorizacion" });
    }
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const getCartController = async (req, res) => {
  const usuario = req.user;
  const resultado = await obtenerCarritoService(usuario.Usuario_ID);
  res.status(resultado.status).json(resultado);
};

const deleteProductFromCartController = async (req, res) => {
  try {
    const { pid } = req.params;
    const usuario = req.user;
    const resultado = await eliminarProductoDelCarritoService(
      usuario.Usuario_ID,
      pid
    );
    res.status(resultado.status).json(resultado);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const patchProductInCartController = async (req, res) => {
  try {
    const { producto_id, cantidad } = req.body;
    const usuario = req.user;

    const resultado = await quitarDelCarritoService({
      usuario_id: usuario.Usuario_ID,
      producto_id,
      cantidad,
    });
    res.status(resultado.status).json(resultado);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

module.exports = {
  postCartController,
  getCartController,
  patchProductInCartController,
  deleteProductFromCartController,
};
