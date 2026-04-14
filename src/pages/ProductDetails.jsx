import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getPlants, getEcoProducts, getTerrariums, getCart, addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { loadCartCount } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    Promise.all([getPlants(), getEcoProducts(), getTerrariums()])
      .then(([p, e, t]) => {
        const all = [...p.data, ...e.data, ...t.data];
        const found = all.find(item => Number(item.id) === Number(id));
        setProduct(found);
      });
  }, [id]);

  if (!product) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ width: 40, height: 40, border: "4px solid #dcfce7", borderTop: "4px solid #16a34a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const isOutOfStock = !product.stock || product.stock <= 0;

  const handleIncrease = () => {
    if (quantity < (product.stock || 0)) setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!user) { showToast("Please login first ❗", "error"); navigate("/login"); return; }
    if (isOutOfStock) { showToast("This product is out of stock ❌", "error"); return; }
    const res = await getCart();
    const userCart = res.data.filter(item => item.userId === user.id);
    const alreadyExists = userCart.find(item => Number(item.productId) === Number(product.id));
    if (alreadyExists) { showToast("Already in cart 🛒", "info"); return; }
    await addToCart({ ...product, quantity }, user.id);
    loadCartCount();
    showToast("Added to cart 🛒", "success");
  };

const handleBuyNow = () => {
    if (!user) { showToast("Please login first ❗", "error"); navigate("/login"); return; }
    if (isOutOfStock) { showToast("This product is out of stock ❌", "error"); return; }
    navigate("/checkout", { 
      state: { 
        buyNowItem: { 
          ...product, 
          quantity: quantity
        } 
      } 
    });
  };

  return (
    <div className="product-details-page">
      <div className="product-details">
        
        <div className="product-img-wrap">
          <img
            src={product.image.startsWith("/") ? product.image : "/" + product.image}
            alt={product.name}
          />
        </div>

        <div className="details-info">
          <div className="details-category-badge">
            <img src="/logo.jpg" alt="EcoStore" />
            <span>EcoStore</span>
          </div>
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>
          <div className="details-divider" />
          <p>{product.description}</p>

          
          {product.stock > 5 && (
            <div className="in-stock-badge">✅ In Stock ({product.stock} available)</div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="low-stock-badge">🔥 Only {product.stock} left!</div>
          )}
          {isOutOfStock && (
            <div className="out-stock-badge">❌ Out of Stock</div>
          )}

          
          {!isOutOfStock && (
            <div className="qty-box">
              <button onClick={handleDecrease}>−</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
          )}

         
          <div className="details-actions">
            <button onClick={handleAddToCart} disabled={isOutOfStock}>
              <i className="fa-solid fa-cart-shopping"/> Add to Cart
            </button>
            <button className="buy-btn" onClick={handleBuyNow} disabled={isOutOfStock}>
               Buy Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;