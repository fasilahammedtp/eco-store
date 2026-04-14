import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const [scrolled,setScrolled] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const { user,logout }= useAuth();
  const { cartCount }= useContext(CartContext);
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const close = () => setMenuOpen(false);
  const handleLogout = () => { logout(); close(); navigate("/"); };

  const navItems = [
    { to:"/",label:"Home"},
    { to:"/plants",label:"Plants"},
    { to:"/eco-products",label:"Eco Products"},
    { to:"/terrariums",label:"Terrariums"},
    { to:"/orders",label:"My Orders"},
    { to:"/about",label:"About"},
  ];

  // Get first name initials for avatar
  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className={`navbar ${scrolled || !isHome ? "solid" : ""}`}>
      <div className="nav-container">

        <Link to="/" className="logo" onClick={close}>
          <img src="/logo.jpg" alt="EcoStore" className="logo-img" />
          <span className="logo-text">EcoStore</span>
        </Link>

        <div className="hamburger" onClick={() => setMenuOpen(p => !p)}>
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
        </div>

        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={close}
                className={location.pathname === item.to ? "nav-active" : ""}
                onTouchStart={() => setActiveLink(item.to)}
                onTouchEnd={() => setActiveLink(null)}
                style={activeLink === item.to ? {
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  borderRadius: "14px"
                } : {}}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li className="mobile-auth">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={close}
                  onTouchStart={e => e.currentTarget.style.opacity = "0.7"}
                  onTouchEnd={e => e.currentTarget.style.opacity = "1"}
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                >
                  <i className="fa-regular fa-user" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={close}
                  onTouchStart={e => e.currentTarget.style.opacity = "0.7"}
                  onTouchEnd={e => e.currentTarget.style.opacity = "1"}
                  style={{ background: "#22c55e", color: "white" }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={close}
                  onTouchStart={e => e.currentTarget.style.opacity = "0.7"}
                  onTouchEnd={e => e.currentTarget.style.opacity = "1"}
                  style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                >
                  <i className="fa-regular fa-user" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  onTouchStart={e => e.currentTarget.style.opacity = "0.7"}
                  onTouchEnd={e => e.currentTarget.style.opacity = "1"}
                  style={{ background: "#ef4444", color: "white" }}
                >
                  <i className="fa-solid fa-right-from-bracket" /> Logout
                </button>
              </>
            )}
          </li>
        </ul>

        <div className="nav-right">

          <Link to="/cart" className="nav-icon-btn" onClick={close}>
            <i className="fa-solid fa-cart-shopping" />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>

          <Link to="/wishlist" className="nav-icon-btn" onClick={close}>
            <i className="fa-solid fa-heart" />
            {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </Link>

          <div className="desktop-auth">
            {!user ? (
              <>
                <Link to="/login" className="nav-login-btn" onClick={close}>
                  <i className="fa-regular fa-user" /> Login
                </Link>
                <Link to="/register" className="nav-signup-btn" onClick={close}>
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="nav-user-area">
                {/* Profile button with avatar */}
                <Link to="/profile" className="nav-profile-btn" onClick={close}>
                  <div className="nav-avatar">{initials}</div>
                  <span>{user.name?.split(" ")[0]}</span>
                </Link>
                {/* Logout */}
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;