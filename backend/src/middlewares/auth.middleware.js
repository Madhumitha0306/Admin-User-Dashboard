const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    );

    req.user = decoded; // { email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
