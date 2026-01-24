import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RoleSelection.css";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    sessionStorage.setItem("selectedRole", role);
    navigate("/login");
  };

  return (
    <div className="center-screen gradient-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="role-selection-card"
      >
        <h1 className="welcome-title">Welcome</h1>
        <p className="welcome-subtitle">
          Please select your role to continue
        </p>

        {/* 🔹 INFO MESSAGE */}
        <motion.div
          className="role-info-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <span className="role-info-highlight">ℹ️ Note</span>
          <p>
            Want to check the status of your submitted form?
            <br />
            <strong>Login as a User</strong> to view approval, rejection,
            and detailed updates.
          </p>
        </motion.div>

        <div className="role-buttons">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="role-btn admin-role"
            onClick={() => handleRoleSelect("admin")}
          >
             Admin
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="role-btn user-role"
            onClick={() => handleRoleSelect("user")}
          >
             User
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
