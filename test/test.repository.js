const ping = async (req, res) => {
  res.send("Respuesta desde el servidor PING-BACKEND! exitoso");
};

module.exports = { ping };
