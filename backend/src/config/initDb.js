const db = require("./db");

async function initDb() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        role TEXT
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        form_id TEXT,
        user_email TEXT,
        data JSONB,
        status TEXT DEFAULT 'pending',
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("PostgreSQL tables initialized");
  } catch (err) {
    console.error("DB init error:", err);
  }
}

module.exports = initDb;
