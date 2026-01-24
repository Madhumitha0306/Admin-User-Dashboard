import { useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "../common/LogoutButton";

export default function UserSidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="admin-sidebar user-sidebar">
      <div className="sidebar-header">
        <h2>User Panel</h2>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${
            location.pathname === "/user" ? "active" : ""
          }`}
          onClick={() => {
            navigate("/user");
            onClose?.();
          }}
        >
          My Submissions
        </button>
      </nav>

      <div className="sidebar-footer">
        <LogoutButton />
      </div>
    </aside>
  );
}
