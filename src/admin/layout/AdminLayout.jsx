import { Outlet ,useLocation} from "react-router-dom";
import { useState,useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles2/admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
   setSidebarOpen(false);
  }, [location.pathname]);


  return (
    <div className="admin-container">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

     {sidebarOpen && (
      <div
       className="sidebar-overlay"
       onClick={() => setSidebarOpen(false)}/>
     )}

     <div className="admin-main">
       <AdminNavbar setSidebarOpen={setSidebarOpen} />
       <main className="admin-content">
         <Outlet />
       </main>
     </div>
    </div>

  );
};

export default AdminLayout;
