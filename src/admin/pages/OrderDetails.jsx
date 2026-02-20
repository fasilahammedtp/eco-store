import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles2/admin.css";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const orderRes = await axios.get(
        `http://localhost:5000/orders/${id}`
      );

      const orderData = orderRes.data;
      setOrder(orderData);

      if (orderData.customerName) return;

      if (orderData.userId) {
        const userRes = await axios.get(
          `http://localhost:5000/users/${orderData.userId}`
        );
        setUser(userRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <div className="admin-page">Loading...</div>;

  const customerName =
    order.customerName || user?.name || "Unknown User";

  const customerEmail =
    order.customerEmail || user?.email || "-";

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.05);
  const shipping = 50;
  const grandTotal = subtotal + tax + shipping;

  return (
    <div className="admin-page">

      {/* breadcrumb */}
      <div className="breadcrumb">
        <Link to="/admin/orders">Orders</Link>
        <span> / </span>
        <span>Order {order.id}</span>
      </div>

      {/* header card */}
      <div className="premium-order-header">
        <div>
          <h2>Order {order.id}</h2>
          <p className="order-date">
            {new Date(order.date).toLocaleString()}
          </p>
        </div>

        <div
          className={`status-badge ${order.status
            ?.toLowerCase()
            .replace(" ", "-")}`} >
          {order.status}
        </div>
      </div>

      {/* grid*/}
      <div className="premium-order-grid">

        {/* custoner card */}
        <div className="premium-card">
          <h3>Customer Information</h3>
          <br />

          <div className="details-row">
            <span>Name : </span>
            <strong>{customerName}</strong>
          </div>

          <div className="details-row">
            <span>Email : </span>
            <strong>{customerEmail}</strong>
          </div>

          <div className="details-row">
            <span>Payment Method : </span>
            <strong>
              {order.paymentMethod?.toUpperCase()}
            </strong>
          </div>

          <div className="details-row">
            <span>Status : </span>
            <strong>{order.status}</strong>
          </div>
        </div>

        {/* order summary */}
        <div className="premium-card summary-card">
          <h3>Order Summary</h3>
          <br />

          <div className="summary-row">
            <span>Subtotal :</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Tax (5%) : </span>
            <span>₹{tax}</span>
          </div>

          <div className="summary-row">
            <span>Shipping : </span>
            <span>₹{shipping}</span>
          </div>

          <div className="summary-row grand-total">
            <span>Total : </span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

      </div>

      {/* products section */}
      <div className="premium-products-section">
        <h3 className="section-title">Products</h3>

        <div className="premium-products-grid">
          {order.items.map((item, index) => (
            <div key={index} className="premium-product-card">

              <img
                src={`/${item.image}`}
                alt={item.name}
                className="order-detail-img"/>

              <div className="product-info">
                <h4>{item.name}</h4>
                <p>Quantity : {item.quantity}</p>
                <p>Price : ₹{item.price}</p>
                <p>
                  Subtotal : ₹{item.price * item.quantity}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OrderDetails;
