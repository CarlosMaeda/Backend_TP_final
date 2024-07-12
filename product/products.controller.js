const { customError } = require("../errors/customManager.error");
const {
  crearProducto,
  obtenerProductoPorId,
  actualizarProductoPorId,
  obtenerProductos,
} = require("./products.service");

const postProductController = async (req, res) => {
  /* const {descripcion, titulo, precio, stock, codigo} = req.body */
  try {
    const result = await crearProducto(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const result = await obtenerProductos();
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!(pid && !isNaN(pid))) {
      throw new customError(
        false,
        "El parametro pid debe ser un valor numerico valido",
        400
      );
    }
    const result = await obtenerProductoPorId(pid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json(error);
  }
};

const putProductController = async (req, res) => {
  console.log("Controller-PUT", req.body);
  const pid = parseInt(req.params.pid);
  console.log("Controller-PUT", pid);

  try {
    const result = await actualizarProductoPorId(pid, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json(error);
  }
};



module.exports = {
  postProductController,
  getProductByIdController,
  putProductController,
  getAllProductsController,
};
