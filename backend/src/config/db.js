const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "sai",
  database: "dashboard_db",
  port: 5433,
});

console.log("Trying to connect to PostgreSQL...");

pool.connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch(err => console.error("PostgreSQL connection failed:", err));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
