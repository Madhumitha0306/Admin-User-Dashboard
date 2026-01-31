const express = require("express");
const router = express.Router();
const {
  login,
  sendOtp,
  verifyOtp,
  getCaptcha,
  verifyCaptcha
} = require("../controllers/auth.controller");

router.post("/captcha", getCaptcha);
router.post("/captcha-verify", verifyCaptcha);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

module.exports = router;
