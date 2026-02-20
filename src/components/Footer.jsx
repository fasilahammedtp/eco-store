import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
        <div className="logo">
          <img src="/logo.jpg" alt="EcoStore Logo" className="logo-img" />
          <span className="logo-text">EcoStore</span>
        </div>
          <p>
            Premium eco living products, indoor plants & terrariums.  
            Grow green. Live clean.
          </p>
        </div>

        <div className="footer-links">
          <h4>Shop</h4>
          <a href="/plants">Plants</a>
          <a href="/eco-products">Eco Products</a>
          <a href="/terrariums">Terrariums</a>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-newsletter">
          <h4>Join our green family 🌱</h4>
          
        </div>

      </div>

      <p className="footer-bottom">
        © {new Date().getFullYear()} EcoStore. All rights reserved.
      </p>
    </footer>
  );
}
export default Footer;