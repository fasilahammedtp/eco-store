
import { useEffect, useState, useContext } from "react";
import { getCart, removeFromCart, updateCartQty } from "../services/api";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const { loadCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadCart = async () => {
    if (!user) return;

    const res = await getCart();

    const userCart = res.data.filter(
      item => item.userId === user.id
    );

    setCart(userCart);
  };

  //  redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
    }
  }, [user, navigate]);


  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    loadCart();
    loadCartCount();
  };

  const updateQty = async (item, change) => {
  const newQty = item.quantity + change;

  //do not allow less than 1
  if (newQty < 1) return;

  await updateCartQty(item.id, newQty);

  loadCart();
  loadCartCount();
};


  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return <h2 style={{ padding: "120px" }}>Your cart is empty</h2>;
  }

  return (
    <div className="featured">
      <div className="page-header">
        <h2>Your Cart 🛒</h2>
      </div>

      <div className="slider">
        {cart.map(item => (
          <div className="product-card" key={item.id}>
            <img src={`/${item.image}`} alt={item.name} />
            <h4>{item.name}</h4>
            <p>₹{item.price * item.quantity}</p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              margin: "12px 0"
            }}>
              <button onClick={() => updateQty(item, -1)}>−</button>
              <strong>{item.quantity}</strong>
              <button onClick={() => updateQty(item, 1)}>+</button>
            </div>

            <button
              style={{ background: "#e74c3c" }}
              onClick={() => handleRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span className="cart-total">Total: ₹{total}</span>

        <Link to="/checkout">
          <button className="checkout-btn">
            Proceed to Payment →
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;
