import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles2/admin.css";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndOrders();
  }, [id]);

  const fetchUserAndOrders = async () => {
    try {
      setLoading(true);

      const userRes = await axios.get(
        `http://localhost:5000/users/${id}`
      );
      setUser(userRes.data);

      const ordersRes = await axios.get(
        `http://localhost:5000/orders`
      );

      const userOrders = ordersRes.data.filter(
        (order) => Number(order.userId) === Number(id)
      );

      setOrders(userOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-page">Loading...</div>;
  if (!user) return <div className="admin-page">User not found</div>;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const lastOrder =
    orders.length > 0
      ? new Date(
          orders
            .slice()
            .sort(
              (a, b) => new Date(b.date) - new Date(a.date)    //get latest order
            )[0].date
        ).toLocaleDateString()
      : "-";

  return (
    <div className="admin-page">

      {/* breadcrumb */}
      <div className="breadcrumb">
        <Link to="/admin/users">Users</Link>
        <span> / </span>
        <span>{user.name}</span>
      </div>

      {/* user header card */}
      <div className="user-header-card">
        <div className="user-header-left">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span
              className={`status ${
                user.isBlocked ? "cancelled" : "paid"
              }`}
            >
              {user.isBlocked ? "Blocked" : "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* user stats */}
      <div className="user-stats">
        <div className="stat-card">
          <p>Total Orders</p>
          <h3>{orders.length}</h3>
        </div>

        <div className="stat-card">
          <p>Total Spent</p>
          <h3>₹{totalSpent}</h3>
        </div>

        <div className="stat-card">
          <p>Last Order</p>
          <h3>{lastOrder}</h3>
        </div>
      </div>

      {/* order history card */}
      <div className="orders-card">
        <div className="orders-header">
          <h3>Order History</h3>
          <span>{orders.length} Orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-box">
            No orders found for this user.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date and Time</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() =>
                      navigate(`/admin/orders/${order.id}`)
                    }
                    style={{ cursor: "pointer" }}
                    className="clickable-row"
                  >
                    <td>{order.id}</td>

                    <td>
                      <strong>₹{order.total}</strong>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${order.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {new Date(order.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserDetails;
