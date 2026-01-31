const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { getUserRole } = require("../utils/role.utils");
const { createOtp, verifyOtp } = require("../utils/otp.store");
const { sendOtpMail } = require("../utils/mailer");
const { createCaptcha, verifyCaptcha } = require("../utils/captcha.store");

exports.getCaptcha = (req, res) => {
  const { email } = req.body;
  const captcha = createCaptcha(email);
  res.json({ captcha });
};

exports.verifyCaptcha = (req, res) => {
  const { email, captcha } = req.body;
  const valid = verifyCaptcha(email, captcha);
  if (!valid) return res.status(401).json({ message: "Invalid Captcha" });
  res.json({ success: true });
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = createOtp(email);
  await sendOtpMail(email, otp);
  res.json({ message: "OTP sent" });
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const valid = verifyOtp(email, otp);
  if (!valid) return res.status(401).json({ message: "Invalid OTP" });
  res.json({ success: true });
};

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
