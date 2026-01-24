import { useState } from "react";
import { motion } from "framer-motion";
import { login } from "../../services/auth.service";
import { saveAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ selectedRole }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { token, role } = await login(email);
      
      // Verify role matches selection
      if (role !== selectedRole) {
        alert(`Access denied. Expected ${selectedRole}, got ${role}`);
        return;
      }
      
      saveAuth(token, role);
      sessionStorage.removeItem("selectedRole");
      
      role === "admin" ? navigate("/admin") : navigate("/user");
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Login as {selectedRole}</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogin} 
        disabled={loading || !email}
        className="login-btn"
      >
        {loading ? "Logging in..." : `Login as ${selectedRole}`}
      </motion.button>
    </>
  );
}
