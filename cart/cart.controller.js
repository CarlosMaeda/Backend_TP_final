const {
  agregarAlCarritoService,
  obtenerCarritoService,
  eliminarProductoDelCarritoService,
  quitarDelCarritoService,
} = require("./cart.service");

const postCartController = async (req, res) => {
  /* Agregan las validaciones de los datos o lo hacen en service*/
  try {
    const { producto_id, cantidad } = req.body;
    const usuario = req.user;
    if (usuario.Rol === "Usuario") {
      console.log("Rol: ", usuario.Rol);
      const resultado = await agregarAlCarritoService({
        usuario_id: usuario.Usuario_ID,
        producto_id,
        cantidad,
      });
      res.status(resultado.status).json(resultado);
    } else {
      console.log("Rol: ", usuario.Rol);
      res.status(401).json({ status: 401, message: "Administrador" });
    }
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const getCartController = async (req, res) => {
  const usuario = req.user;
  console.log("Este es el usuario getController: ", usuario);
  const resultado = await obtenerCarritoService(usuario.Usuario_ID);
  res.status(resultado.status).json(resultado);
};

const deleteProductFromCartController = async (req, res) => {
  try {
    const { pid } = req.params;
    const usuario = req.user;
    console.log("Este es el usuario deleteController: ", usuario);
    console.log("Este es el product_id deleteController: ", pid);
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
    //const { pid } = req.params;
    const { producto_id, cantidad } = req.body;
    const usuario = req.user;
    console.log("Este es el usuario patchController: ", usuario);
    //console.log("Este es el product_id patchController: ", pid);
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
