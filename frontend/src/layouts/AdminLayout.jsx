import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import LogoutButton from "../components/common/LogoutButton";
import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/modals/PendingNotificationModal.css";

const navItems = [
  { path: "/admin", label: "Dashboard"},
  { path: "/admin/submissions", label: "Submissions"},
  { path: "/admin/analytics", label: "Analytics"},
  { path: "/admin/report-export", label: "Report Export"},
];

export default function AdminLayout() {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingCount, setPendingCount] = useState(0);
  const [showPendingPopup, setShowPendingPopup] = useState(false);

  // ✅ NEW — mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("admin_pending_popup_shown");
    if (hasShown) return;

    api.get("/submissions/pending/count").then(res => {
      if (res.data.count > 0) {
        setPendingCount(res.data.count);
        setShowPendingPopup(true);
        sessionStorage.setItem("admin_pending_popup_shown", "true");
      }
    });
  }, []);

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      
      {/* MOBILE OVERLAY */}
      <div
        className="mobile-overlay"
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <header className="top-header">
          
          {/* ✅ MOBILE MENU BUTTON */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h1>
            {location.pathname === "/admin" && "Dashboard"}
            {location.pathname.startsWith("/admin/submissions") && "Submissions"}
            {location.pathname === "/admin/analytics" && "Analytics"}
            {location.pathname === "/admin/report-export" && "Report Export"}
          </h1>

          <button className="header-theme-toggle" onClick={toggleTheme}>
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

      {/* POPUP */}
      {showPendingPopup && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Pending Submissions</h3>
            <p className="pending-count">{pendingCount} pending</p>
            <div className="pending-actions">
              <button onClick={() => navigate("/admin/submissions?status=pending")}>
                View
              </button>
              <button onClick={() => setShowPendingPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
