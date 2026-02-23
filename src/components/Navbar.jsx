import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useWishlist();

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleLogout = () => {
    logout();
    setMenuOpen(false); 
    navigate("/"); 
  };

  return (
    <nav className={`navbar ${scrolled || !isHome ? "solid" : ""}`}>
      <div className="nav-container">

        <div className="logo">
          <img src="/logo.jpg" alt="EcoStore Logo" className="logo-img" />
          <span className="logo-text">EcoStore</span>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
        </div>

        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/plants" onClick={() => setMenuOpen(false)}>Plants</Link></li>
          <li><Link to="/eco-products" onClick={() => setMenuOpen(false)}>Eco Products</Link></li>
          <li><Link to="/terrariums" onClick={() => setMenuOpen(false)}>Terrariums</Link></li>

          <li>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="icon-link">
              <i className="fa-solid fa-cart-shopping"></i>
              {cartCount > 0 && (
                <span className="count">{cartCount}</span>
              )}
            </Link>
          </li>

          <li>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="icon-link">
              <i className="fa-solid fa-heart"></i>
              {wishlist.length > 0 && (
                <span className="count">{wishlist.length}</span>
              )}
            </Link>
          </li>

          <li>
            <Link to="/orders" onClick={() => setMenuOpen(false)}>
              My Orders
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
        </ul>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link to="/login">
                <i className="fa-regular fa-user"></i>Login
              </Link>
              <Link to="/register" className="signup">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              className="signup"
              onClick={handleLogout} 
            >
              <i className="fa-regular fa-user"></i>Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
