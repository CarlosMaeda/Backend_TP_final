const { createPool /* eventEmitter */ } = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbconfig = {
  host: process.env.DB_HOST_PROD || process.env.DB_HOST_DEV || "localhost",
  user: process.env.DB_USER_PROD || process.env.DB_USER_DEV || "root",
  password: process.env.DB_PASSWORD_PROD || process.env.DB_PASSWORD_DEV || "",
  database:
    process.env.DB_NAME_PROD || process.env.DB_NAME_DEV || "pf_utn_mysql_db",
  port: process.env.DB_PORT_PROD || process.env.DB_PORT_DEV || 3306,
};

const pool = createPool(dbconfig);
//const eventEmitter = new eventEmitter();

pool.on("error", async (error) => {
  console.error("Error al conectar con la base de datos", error);

  try {
    await pool.end();
    pool = createPool(dbconfig);
    console.log("Conexión reestablecida");

    //eventEmitter.emit("Base de datos reconectada");
  } catch (reconnectError) {
    console.error("Error al reestablecer la conexión", reconnectError);
  }
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = { pool, testConnection /* eventEmitter */ };
