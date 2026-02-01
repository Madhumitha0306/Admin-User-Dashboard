import { useState } from "react";
import { motion } from "framer-motion";
import {
  login,
  sendOtp,
  verifyOtp,
  getCaptcha,
  verifyCaptcha
} from "../../services/auth.service";
import { saveAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ selectedRole }) {
  const [email, setEmail] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load / Refresh captcha
  const loadCaptcha = async () => {
    const cap = await getCaptcha(email);
    setCaptchaText(cap);
    setCaptchaInput("");
    setStep("captcha");
  };

  const handleCaptcha = async () => {
    try {
      await verifyCaptcha(email, captchaInput);
      await sendOtp(email);

      setMessage("If this email exists, you received an OTP");

      setTimeout(() => {
        setMessage("");
        setStep("otp");
      }, 2000);

    } catch (err) {
      setMessage("Failed to send OTP ");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleOtp = async () => {
    try {
      await verifyOtp(email, otp);
      const { token, role } = await login(email);

      if (role !== selectedRole) {
        alert("Role mismatch");
        return;
      }

      saveAuth(token, role);
      sessionStorage.removeItem("selectedRole");
      role === "admin" ? navigate("/admin") : navigate("/user");
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <>
      <h2>Login as {selectedRole}</h2>

      {message && <p className="status-msg">{message}</p>}

      {step === "email" && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button onClick={loadCaptcha} className="login-btn">
            Continue
          </motion.button>
        </>
      )}

      {step === "captcha" && (
        <>
          <div className="captcha-box">
            <span className="captcha-code">{captchaText}</span>

            <button
              type="button"
              className="captcha-refresh"
              onClick={loadCaptcha}
              title="Refresh captcha"
            >
              🔄
            </button>

            <input
              placeholder="Type captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
            />
          </div>

          <motion.button onClick={handleCaptcha} className="login-btn">
            Verify Captcha
          </motion.button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            className="otp-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <motion.button onClick={handleOtp} className="login-btn">
            Verify OTP & Login
          </motion.button>
        </>
      )}
    </>
  );
}
