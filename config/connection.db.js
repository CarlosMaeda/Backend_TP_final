const { createPool } = require("mysql2/promise");
const dotenv = require("dotenv");
const { customError } = require("../errors/customManager.error");

dotenv.config();

const dbconfig = {
  host: process.env.DB_HOST_PROD || process.env.DB_HOST_DEV,
  user: process.env.DB_USER_PROD || process.env.DB_USER_DEV,
  password: process.env.DB_PASSWORD_PROD || process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_PROD || process.env.DB_NAME_DEV,
  port: process.env.DB_PORT_PROD || process.env.DB_PORT_DEV,
};

const pool = createPool(dbconfig);

pool.on("error", async (error) => {
  try {
    await pool.end();
    pool = createPool(dbconfig);
    console.log("Conexión reestablecida");
  } catch (reconnectError) {
    console.error("Error al reestablecer la conexión", reconnectError);
    throw new customError(false, "Error de conexión a la base de datos", 500);
  }
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { pool, testConnection };
