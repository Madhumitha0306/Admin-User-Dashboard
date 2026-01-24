import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import UserSidebar from "../components/User/UserSidebar";
import { useState } from "react";

export default function UserLayout() {
  const { toggleTheme, theme } = useTheme();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      
      <div
        className="mobile-overlay"
        onClick={() => setSidebarOpen(false)}
      />

      <UserSidebar onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <header className="top-header">

          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h1>My Submissions</h1>

          <button
            className="header-theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </header>

        <main className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
