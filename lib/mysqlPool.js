/*
 * Reusable MySQL connection pool for making queries throughout the rest of
 * the app.
 */

const { createPool } = require('mysql');

const mysqlPool = createPool({
  connectionLimit: 10,
<<<<<<< HEAD
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE||"cs493final",
  user: process.env.MYSQL_USER||"cs493final",
  password: process.env.MYSQL_PASSWORD||"cs493final"
=======
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE||"bookaplace",
  user: process.env.MYSQL_USER||"bookaplace",
  password: process.env.MYSQL_PASSWORD||"hunter2"
>>>>>>> parent of d751e3e... Updata
});

module.exports = mysqlPool;
