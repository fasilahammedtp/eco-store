import { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    loadOrders();
  }, [user]);

  const loadOrders = () => {
    getOrders().then(res => {
      const userOrders = res.data
        .filter(order => order.userId === user.id)
        .reverse();

      setOrders(userOrders);
    });
  };

 
  const restoreStock = async (order) => {
    for (let item of order.items) {
      const productId = item.productId || item.id;

     
      try {
        const res = await axios.get(`http://localhost:5000/plants/${productId}`);
        if (res.data) {
          await axios.patch(`http://localhost:5000/plants/${productId}`, {
            stock: (res.data.stock || 0) + item.quantity
          });
          continue;
        }
      } catch {}

      
      try {
        const res = await axios.get(`http://localhost:5000/ecoProducts/${productId}`);
        if (res.data) {
          await axios.patch(`http://localhost:5000/ecoProducts/${productId}`, {
            stock: (res.data.stock || 0) + item.quantity
          });
          continue;
        }
      } catch {}

      
      try {
        const res = await axios.get(`http://localhost:5000/terrariums/${productId}`);
        if (res.data) {
          await axios.patch(`http://localhost:5000/terrariums/${productId}`, {
            stock: (res.data.stock || 0) + item.quantity
          });
        }
      } catch {}
    }
  };

  /* cancel order */
  const handleCancel = async (order) => {
    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (!confirm) return;

    try {
      // update order status
      await axios.patch(`http://localhost:5000/orders/${order.id}`, {
        status: "Cancelled"
      });

      // restore stock
      await restoreStock(order);

      loadOrders(); // refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  if (!orders.length)
    return <h2 className="empty-orders">No orders yet 📦</h2>;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>My Orders</h1>
      </div>

      {orders.map(order => (
        <div className="order-card" key={order.id}>

          <div className="order-head">
            <span>{order.date}</span>

            <span className={`status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>

            <span className="total">₹{order.total}</span>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div className="order-item" key={index}>
                <img src={"/" + item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* cancel btn */}
          {order.status === "Paid" && (
            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button
                className="cancel-btn"
                onClick={() => handleCancel(order)}
              >
                Cancel Order
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default Orders;
