const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { getUserRole } = require("../utils/role.utils");

exports.login = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const role = getUserRole(email);

  try {
    await db.query(
      `INSERT INTO users (email, role)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email, role]
    );

    const token = jwt.sign(
      { email, role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1d" }
    );

    res.json({ token, role });
  } catch {
    res.status(500).json({ message: "DB error" });
  }
};
