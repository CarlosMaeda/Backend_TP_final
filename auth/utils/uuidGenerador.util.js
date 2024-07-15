const { v4: uuidv4 } = require("uuid");
const generadorUuidv4 = () => {
  const uuid = uuidv4();
  return uuid;
};

module.exports = { generadorUuidv4 };
