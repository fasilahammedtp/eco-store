import { NavLink } from "react-router-dom";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
      
      {/* close button for mobile */}
      <button 
        className="close-btn"
        onClick={() => setSidebarOpen(false)}>✕</button>

      <div className="admin-logo"><i className="fa-solid fa-user"></i> Admin</div>

     <nav>
      <NavLink to="/admin" end>Dashboard</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
      <NavLink to="/admin/orders">Orders</NavLink>

   </nav>

    </div>
  );
};


export default AdminSidebar;
