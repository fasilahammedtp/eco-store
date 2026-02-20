import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import Users from "../pages/Users";
import UserDetails from "../pages/UserDetails";
import Orders2 from "../pages/Orders2";
import OrderDetails from "../pages/OrderDetails";
import AdminProtectedRoute from "../components/AdminProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      {/*  protected admin area */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="orders" element={<Orders2 />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
