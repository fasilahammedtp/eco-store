import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAdminProducts } from "../context/AdminProductContext";
import {ResponsiveContainer,BarChart,Bar,PieChart,Pie,XAxis,YAxis,Tooltip,CartesianGrid,Cell} from "recharts";
import "../styles2/admin.css";

const Dashboard = () => {
  const { products } = useAdminProducts();

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [timeFilter, setTimeFilter] = useState("7");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/orders"),
      ]);
      setUsers(usersRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 100);
    }
  };

  /* stats */

  const totalUsers = users.length;
  const totalOrders = orders.length;

  const paidOrders = orders.filter(o => o.status === "Paid");
  const inTransitOrders = orders.filter(o => o.status === "In Transit");
  const deliveredOrders = orders.filter(o => o.status === "Delivered");
  const cancelledOrders = orders.filter(o => o.status === "Cancelled");

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  /* month stats*/
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return (
      orderDate.getMonth() === currentMonth &&
      orderDate.getFullYear() === currentYear
    );
  });

  const thisMonthRevenue = thisMonthOrders
    .filter(o => o.status === "Paid")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  /* time filter */
  const filteredPaidOrders = useMemo(() => {
    const days = Number(timeFilter);
    const now = new Date();

    return paidOrders.filter(order => {
      const orderDate = new Date(order.date);
      const diffTime = now - orderDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });
  }, [paidOrders, timeFilter]);

  /* revenue by date */

  const revenueData = useMemo(() => {
    const revenueByDate = {};

    filteredPaidOrders.forEach(order => {
      const date = new Date(order.date).toLocaleDateString();
      if (!revenueByDate[date]) revenueByDate[date] = 0;
      revenueByDate[date] += Number(order.total);
    });

    return Object.keys(revenueByDate)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => ({
        date,
        revenue: revenueByDate[date]
      }));
  }, [filteredPaidOrders]);

  /* pie  */

  const orderStatusData = [
    { name: "Paid", value: paidOrders.length, color: "#4caf50" },
    { name: "In Transit", value: inTransitOrders.length, color: "#2196f3" },
    { name: "Delivered", value: deliveredOrders.length, color: "#9c27b0" },
    { name: "Cancelled", value: cancelledOrders.length, color: "#f44336" }
  ];

  /*shimmer effct */

  if (loading) {
    return (
      <div className="admin-page premium-dashboard">
        <div className="dashboard-header">
          <div className="shimmer" style={{ height: 28, width: 250 }} />
          <div className="shimmer" style={{ height: 14, width: 300, marginTop: 10 }} />
        </div>

        <div className="ultra-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="ultra-card">
              <div className="shimmer" style={{ height: 20, width: "60%", marginBottom: 15 }} />
              <div className="shimmer" style={{ height: 30, width: "40%" }} />
            </div>
          ))}
        </div>

        <div className="shimmer" style={{ height: 300, width: "100%", marginTop: 40 }} />
        <div className="shimmer" style={{ height: 350, width: "100%", marginTop: 40 }} />
      </div>
    );
  }

  /* dashboard */

  return (
    <div className="admin-page premium-dashboard">

      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Real-time insights of your store performance</p>
      </div>

      <div className="ultra-grid">
        <KpiCard title="Total Revenue" value={`₹${totalRevenue}`} icon="fa-indian-rupee-sign" />
        <KpiCard title="Total Orders" value={totalOrders} icon="fa-box-open" />
        <KpiCard title="Paid Orders" value={paidOrders.length} icon="fa-circle-check" />
        <KpiCard title="Cancelled Orders" value={cancelledOrders.length} icon="fa-ban" />
        <KpiCard title="Total Users" value={totalUsers} icon="fa-users" />
        <KpiCard title="Total Products" value={products.length} icon="fa-cube" />
        <KpiCard title="This Month Orders" value={thisMonthOrders.length} icon="fa-calendar" />
        <KpiCard title="This Month Revenue" value={`₹${thisMonthRevenue}`} icon="fa-chart-line" />
      </div>

      {/* pie */}
      <div className="analytics-section">
        <div className="analytics-left">
          <h3>Order Analytics</h3>
          <p>Status distribution</p>

          {orderStatusData.map((item, index) => (
            <div key={index} className="status-row">
              <div className="status-dot" style={{ background: item.color }} />
              <span>{item.name}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <div className="analytics-right">
          <ResponsiveContainer width={320} height={320}>
            <PieChart>
              <Tooltip formatter={(value)=>`${value}`}/>
              <Pie
                data={orderStatusData}
                innerRadius={90}
                outerRadius={130}
                // paddingAngle={1}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="donut-center">
            <h2>{totalOrders}</h2>
            <span>Total Orders</span>
          </div>
        </div>
      </div>

      {/*bar*/}
      <div className="chart-container premium-chart">

        <div className="chart-header">
          <div>
            <h3>Revenue Overview</h3>
            <span>Revenue for last {timeFilter} days</span>
          </div>

          <div className="time-filter">
            {["7", "30", "60"].map(days => (
              <button
                key={days}
                className={timeFilter === days ? "active" : ""}
                onClick={() => setTimeFilter(days)}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Bar
              dataKey="revenue"
              fill="#10b981"
              radius={[10, 10, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

const KpiCard = ({ title, value, icon }) => (
  <div className="ultra-card">
    <div className="ultra-card-header">
      <div className="ultra-icon">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <span className="ultra-title">{title}</span>
    </div>
    <h2 className="ultra-value">{value}</h2>
  </div>
);

export default Dashboard;
