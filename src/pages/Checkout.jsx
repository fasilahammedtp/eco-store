import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCart, createOrder, removeFromCart } from "../services/api";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/checkout.css";
import Toast from "../components/Toast";
import axios from "axios";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");

  const { loadCartCount } = useContext(CartContext);

  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;

  const BASE_URL = "http://localhost:5000";

  const loadCart = async () => {
    if (!user) return;
    const res = await getCart();
    const userCart = res.data.filter(
      item => item.userId === user.id
    );
    setCart(userCart);
  };

  const checkoutItems = buyNowItem
    ? [{ ...buyNowItem, quantity: 1 }]
    : cart;

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    if (buyNowItem) {
      setCart([{ ...buyNowItem, quantity: 1 }]);
    } else {
      loadCart();
    }
  }, [user]);

  const total = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 2500);
  };

  const validateStock = async () => {
    for (let item of checkoutItems) {
      const productId = item.productId || item.id;
      let product = null;
      let endpoint = "";

      try {
        const res = await axios.get(`${BASE_URL}/plants/${productId}`);
        product = res.data;
        endpoint = "plants";
      } catch {}

      if (!product) {
        try {
          const res = await axios.get(`${BASE_URL}/ecoProducts/${productId}`);
          product = res.data;
          endpoint = "ecoProducts";
        } catch {}
      }

      if (!product) {
        try {
          const res = await axios.get(`${BASE_URL}/terrariums/${productId}`);
          product = res.data;
          endpoint = "terrariums";
        } catch {}
      }

      if (!product) continue;

      const availableStock = product.stock ?? 0;

      if (availableStock <= 0) {
        showToast(`${product.name} is out of stock ❌`, "error");
        return false;
      }

      if (availableStock < item.quantity) {
        showToast(
          `Only ${availableStock} left for ${product.name} ❗`,
          "error"
        );
        return false;
      }
    }

    return true;
  };

  const reduceStock = async () => {
    for (let item of checkoutItems) {
      const productId = item.productId || item.id;
      let product = null;
      let endpoint = "";

      try {
        const res = await axios.get(`${BASE_URL}/plants/${productId}`);
        product = res.data;
        endpoint = "plants";
      } catch {}

      if (!product) {
        try {
          const res = await axios.get(`${BASE_URL}/ecoProducts/${productId}`);
          product = res.data;
          endpoint = "ecoProducts";
        } catch {}
      }

      if (!product) {
        try {
          const res = await axios.get(`${BASE_URL}/terrariums/${productId}`);
          product = res.data;
          endpoint = "terrariums";
        } catch {}
      }

      if (!product) continue;

      const newStock = Math.max(
        0,
        (product.stock ?? 0) - item.quantity
      );

      await axios.patch(
        `${BASE_URL}/${endpoint}/${productId}`,
        { stock: newStock }
      );
    }
  };

  const handlePayment = async () => {
    if (!checkoutItems.length) {
      showToast("Cart is empty ❗", "error");
      return;
    }

    if (!address || !city || !stateName || !pincode || !phone) {
      showToast("Please fill shipping details ❗", "error");
      return;
    }

    if (pincode.length !== 6) {
      showToast("Invalid PIN code ❌", "error");
      return;
    }

    if (phone.length < 10) {
      showToast("Invalid phone number ❌", "error");
      return;
    }

    if (method === "card") {
      if (!cardNumber || !expiry || !cvv || !name) {
        showToast("Fill all card details ❗", "error");
        return;
      }

      if (cardNumber.length < 12) {
        showToast("Invalid card number ❌", "error");
        return;
      }

      if (cvv.length < 3) {
        showToast("Invalid CVV ❌", "error");
        return;
      }
    }

    if (method === "upi") {
      if (!upiId || !upiId.includes("@")) {
        showToast("Invalid UPI ID ❌", "error");
        return;
      }
    }

    setLoading(true);

    const stockValid = await validateStock();
    if (!stockValid) {
      setLoading(false);
      return;
    }

    try {
      await createOrder({
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        shippingAddress: {
          address,
          city,
          state: stateName,
          pincode,
          phone
        },
        items: checkoutItems,
        total: total,
        paymentMethod: method,
        date: new Date().toLocaleString(),
        status: "Paid",
      });

      await reduceStock();

      if (!buyNowItem) {
        for (let item of cart) {
          await removeFromCart(item.id);
        }
        await loadCartCount();
      }

      showToast("Order placed successfully 🎉", "success");

      if (!buyNowItem) setCart([]);

      setTimeout(() => {
        navigate("/orders");
      }, 1500);

    } catch (err) {
      console.error(err);
      showToast("Payment failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
      <h2>Checkout</h2>

      {checkoutItems.map((item) => (
        <div className="checkout-item" key={item.id}>
          <span>{item.name} × {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <div className="checkout-total">
        Total: ₹{total}
      </div>


      <div className="address-box">
        <h3>Shipping Address</h3>

        <input placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} />
        <input placeholder="PIN Code" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="payment-box">
        <label>
          <input type="radio" checked={method === "card"} onChange={() => setMethod("card")} />
          Credit / Debit Card
        </label>
         <br />
        <label>
          <input type="radio" checked={method === "upi"} onChange={() => setMethod("upi")} />
          UPI Payment
        </label>

        {method === "card" && (
          <div className="card-form">
            <input placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            <div className="row">
              <input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              <input placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
            </div>
            <input placeholder="Name on Card" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}

        {method === "upi" && (
          <input className="upi-input" placeholder="Enter UPI ID (name@bank)" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
        )}
      </div>

      <Toast show={toast.show} message={toast.msg} type={toast.type} />

      <button className="pay-btn" onClick={handlePayment}>
        {loading ? "Processing..." : "Pay Securely"}
      </button>
    </div>
   </div> 
  );
}

export default Checkout;
