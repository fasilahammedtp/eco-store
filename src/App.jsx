import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Plants from "./pages/Plants";
import EcoProducts from "./pages/EcoProducts";
import Terrariums from "./pages/Terrariums";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoutes from "./admin/routes/AdminRoutes";
import { AdminProductProvider } from "./admin/context/AdminProductContext";
import { AdminUserProvider } from "./admin/context/AdminUserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";


function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* adminside*/}
      
      <ToastContainer position="top-right" autoClose={3000} />

      {isAdminPage && (
        <AuthProvider>
         <AdminUserProvider>
          <AdminProductProvider>
           <AdminRoutes />
          </AdminProductProvider>
         </AdminUserProvider>
        </AuthProvider>
      )}



      {/* user side*/}
      {!isAdminPage && (
        <div className="app-wrapper">
          {!isAuthPage && <Navbar />}
          <ScrollToTop />

          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/eco-products" element={<EcoProducts />} />
              <Route path="/terrariums" element={<Terrariums />} />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </div>

          {!isAuthPage && <Footer />}
        </div>
      )}
    </>
  );
}

export default App;













