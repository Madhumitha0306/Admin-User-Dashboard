import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    // ✅ Clear everything related to admin session
    localStorage.clear();
    sessionStorage.clear();

    // ✅ Redirect to login / landing page
    navigate("/");
  };

  return (
    <button className="logout-btn" onClick={logout}>
      Logout
    </button>
  );
}
