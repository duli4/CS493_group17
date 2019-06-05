/*
 * Reusable MySQL connection pool for making queries throughout the rest of
 * the app.
 */

const { createPool } = require('mysql');

const mysqlPool = createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE||"bookaplace",
  user: process.env.MYSQL_USER||"bookaplace",
  password: process.env.MYSQL_PASSWORD||"hunter2"
});

module.exports = mysqlPool;