import LoginForm from "../../components/auth/LoginForm";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Login() {
  const selectedRole = sessionStorage.getItem("selectedRole") || "";

  useEffect(() => {
    if (!selectedRole) {
      window.location.href = "/";
    }
  }, [selectedRole]);

  return (
    <div className="center-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
      >
        <div className="role-indicator">
          Logging in as: <span className="role-badge">{selectedRole}</span>
        </div>
        <LoginForm selectedRole={selectedRole} />
      </motion.div>
    </div>
  );
}
