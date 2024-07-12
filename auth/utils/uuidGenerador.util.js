const { v4: uuidv4 } = require("uuid");
const generadorUuidv4 = () => {
  const uuid = uuidv4();
  //const uuid = "1ad8f4f9-1d36-4799-bbbb-ed970bb7ab72";
  //console.log(uuid);
  return uuid;
};

module.exports = { generadorUuidv4 };
