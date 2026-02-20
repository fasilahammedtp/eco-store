import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminNavbar = ({ setSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Admin logged out");
    navigate("/login");
  };

  return (
    <header className="admin-navbar">
      <button className="menu-btn" onClick={() => setSidebarOpen(prev => !prev)}>☰</button>

      <div className="logo">
           <img src="/logo.jpg" alt="EcoStore Logo" className="logo-img" />
           <span className="logo2-text">EcoStore</span>
        </div>

      <div className="admin-navbar-right">
        <span>Admin</span>
        <button onClick={handleLogout}><i className="fa-solid fa-user"></i> Logout</button>
      </div>
    </header>
  );
};

export default AdminNavbar;
