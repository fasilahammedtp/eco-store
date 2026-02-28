// import { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles2/admin.css";
// import { useNavigate } from "react-router-dom";

// const Orders2 = () => {
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;


//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [loading, setLoading] = useState(true); 

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [ordersRes, usersRes] = await Promise.all([
//         axios.get("http://localhost:5000/orders"),
//         axios.get("http://localhost:5000/users"),
//       ]);
//       setOrders(ordersRes.data);
//       setUsers(usersRes.data);
//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//     } finally {
//       setTimeout(() => {
//         setLoading(false); 
//       }, 100);
//     }
//   };

//   const restoreStock = async (items) => {
//   for (let item of items) {
//     const productId = item.productId || item.id;

//     try {
//       const res = await axios.get(`http://localhost:5000/plants/${productId}`);
//       if (res.data) {
//         await axios.patch(`http://localhost:5000/plants/${productId}`, {
//           stock: (res.data.stock || 0) + item.quantity
//         });
//         continue;
//       }
//     } catch {}

//     try {
//       const res = await axios.get(`http://localhost:5000/ecoProducts/${productId}`);
//       if (res.data) {
//         await axios.patch(`http://localhost:5000/ecoProducts/${productId}`, {
//           stock: (res.data.stock || 0) + item.quantity
//         });
//         continue;
//       }
//     } catch {}

//     try {
//       const res = await axios.get(`http://localhost:5000/terrariums/${productId}`);
//       if (res.data) {
//         await axios.patch(`http://localhost:5000/terrariums/${productId}`, {
//           stock: (res.data.stock || 0) + item.quantity
//         });
//       }
//     } catch {}
//   }
// };

//   const updateStatus = async (id, newStatus) => {
//   try {
//     const order = orders.find(o => o.id === id);
//     if (!order) return;

    
//     if (newStatus === "Cancelled" && order.status !== "Cancelled") {
//       await restoreStock(order.items);
//     }

//     await axios.patch(`http://localhost:5000/orders/${id}`, {
//       status: newStatus,
//     });

//     setOrders((prev) =>
//       prev.map((order) =>
//         order.id === id ? { ...order, status: newStatus } : order
//       )
//     );

//   } catch (err) {
//     console.error("Failed to update status:", err);
//   }
// };

//   const filteredOrders = orders
//     .filter((o) =>
//       statusFilter === "All"
//         ? true
//         : o.status?.toLowerCase() === statusFilter.toLowerCase()
//     )
//     .filter((o) => {
//       if (!fromDate && !toDate) return true;

//       const orderDate = new Date(o.date);
//       const start = fromDate ? new Date(fromDate) : null;
//       const end = toDate ? new Date(toDate) : null;

//       if (start && orderDate < start) return false;

//       if (end) {
//         end.setHours(23, 59, 59, 999);
//         if (orderDate > end) return false;
//       }

//       return true;
//     })
//     .filter((o) => {
//       if (!searchTerm) return true;

//       const user = users.find((u) => u.id === o.userId);

//       return (
//         o.id.toString().includes(searchTerm) ||
//         user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     });

//   const filters = [
//     "All",
//     "Paid",
//     "In Transit",
//     "Delivered",
//     "Cancelled",
//   ];

//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.max(
//    1,
//    Math.ceil(filteredOrders.length / itemsPerPage)
//   );


//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter, fromDate, toDate]);


//   return (
//     <div className="admin-page">

//       <div className="admin-header">
//         <h2>Orders</h2>

//         <input
//           type="text"
//           placeholder="Search by Order ID, Name or Email..."
//           className="admin-search"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}/>
//       </div>

//       <div className="order-filters">
//         {filters.map((filter) => (
//           <button
//             key={filter}
//             className={`filter-chip ${
//               statusFilter === filter ? "active" : ""
//             }`}
//             onClick={() => setStatusFilter(filter)}>
//             {filter}
//           </button>
//         ))}
//       </div>
//       <div className="date-filters">
//         <div>
//           <label>From:</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>To:</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         {(fromDate || toDate) && (
//           <button
//             className="clear-date-btn"
//             onClick={() => {
//               setFromDate("");
//               setToDate("");
//             }}
//           >Clear</button>
//         )}
//       </div>

//       <div className="table-wrapper">
//         <table className="admin-table premium-table">
//           <thead>
//             <tr>
//               <th>Order</th>
//               <th>Customer</th>
//               <th>Products</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Date & Time</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               [...Array(6)].map((_, index) => (
//                 <tr key={index}>
//                   <td>
//                     <div className="shimmer" style={{ height: "14px", width: "60%" }} />
//                   </td>
//                   <td>
//                     <div className="shimmer" style={{ height: "14px", width: "80%" }} />
//                   </td>
//                   <td>
//                     <div className="shimmer" style={{ height: "40px", width: "100%" }} />
//                   </td>
//                   <td>
//                     <div className="shimmer" style={{ height: "14px", width: "50%" }} />
//                   </td>
//                   <td>
//                     <div className="shimmer" style={{ height: "30px", width: "90px", borderRadius: "999px" }} />
//                   </td>
//                   <td>
//                     <div className="shimmer" style={{ height: "14px", width: "70%" }} />
//                   </td>
//                 </tr>
//               ))
//             ) : filteredOrders.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="empty">
//                   No orders found
//                 </td>
//               </tr>
//             ) : (
//               currentOrders.map((order) => {
//                 const user = users.find(
//                   (u) => u.id === order.userId
//                 );

//                 const formattedDate = new Date(
//                   order.date
//                 ).toLocaleString();

//                 return (
//                   <tr
//                     key={order.id}
//                     className="clickable-row"
//                     onClick={() =>
//                       navigate(`/admin/orders/${order.id}`) //navigate to order details page
//                     }
//                   >
//                     <td><strong>{order.id}</strong></td>

//                     <td>
//                       <div className="customer-info">
//                         <strong>{user?.name}</strong>
//                         <small>{user?.email || "-"}</small>
//                       </div>
//                     </td>

//                     <td>
//                       {order.items?.slice(0, 2).map((item, index) => (
//                         <div key={index} className="order-product compact">
//                           <img
//                             src={`/${item.image}`}
//                             alt={item.name}
//                             className="order-img"
//                             onError={(e) =>
//                               (e.target.src = "/images/placeholder.png")
//                             }
//                           />
//                           <div>
//                             <div>{item.name}</div>
//                             <small>Qty : {item.quantity}</small>
//                           </div>
//                         </div>
//                       ))}
//                     </td>

//                     <td>
//                       <strong className="price">₹{order.total}</strong>
//                     </td>

//                     <td onClick={(e) => e.stopPropagation()}>
//                       <select
//                         value={order.status}
//                         className={`status ${order.status
//                           ?.toLowerCase()
//                           .replace(" ", "-")}`}
//                         onChange={(e) =>
//                           updateStatus(order.id, e.target.value)
//                         }
//                       >
//                         <option>Paid</option>
//                         <option>In Transit</option>
//                         <option>Delivered</option>
//                         <option>Cancelled</option>
//                       </select>
//                     </td>

//                     <td>{formattedDate}</td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//         {totalPages > 1 && (
//           <div className="pagination">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//             > Prev</button>

//             {[...Array(totalPages)].map((_, index) => (
//              <button
//                key={index}
//                className={currentPage === index + 1 ? "active-page" : ""}
//                onClick={() => setCurrentPage(index + 1)}
//              >{index + 1}</button>
//             ))}

//            <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//            >Next </button>
//          </div>
//         )}      
//       </div>
//     </div>
//   );
// };

// export default Orders2;





import { useEffect, useState } from "react";
import axios from "axios";
import "../styles2/admin.css";
import { useNavigate } from "react-router-dom";

const Orders2 = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
const BASE_URL = "https://ecostore-backend.onrender.com";

  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get(`${BASE_URL}/orders`),
        axios.get(`${BASE_URL}/users`),
      ]);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setTimeout(() => {
        setLoading(false); 
      }, 100);
    }
  };

  const restoreStock = async (items) => {
  for (let item of items) {
    const productId = item.productId || item.id;

    try {
      const res = await axios.get(`${BASE_URL}/plants/${productId}`);
      if (res.data) {
        await axios.patch(`${BASE_URL}/plants/${productId}`, {
          stock: (res.data.stock || 0) + item.quantity
        });
        continue;
      }
    } catch {}

    try {
      const res = await axios.get(`${BASE_URL}/ecoProducts/${productId}`);
      if (res.data) {
        await axios.patch(`${BASE_URL}/ecoProducts/${productId}`, {
          stock: (res.data.stock || 0) + item.quantity
        });
        continue;
      }
    } catch {}

    try {
      const res = await axios.get(`${BASE_URL}/terrariums/${productId}`);
      if (res.data) {
        await axios.patch(`${BASE_URL}/terrariums/${productId}`, {
          stock: (res.data.stock || 0) + item.quantity
        });
      }
    } catch {}
  }
};

  const updateStatus = async (id, newStatus) => {
  try {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    
    if (newStatus === "Cancelled" && order.status !== "Cancelled") {
      await restoreStock(order.items);
    }

    await axios.patch(`${BASE_URL}/orders/${id}`, {
      status: newStatus,
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

  } catch (err) {
    console.error("Failed to update status:", err);
  }
};

  const filteredOrders = orders
    .filter((o) =>
      statusFilter === "All"
        ? true
        : o.status?.toLowerCase() === statusFilter.toLowerCase()
    )
    .filter((o) => {
      if (!fromDate && !toDate) return true;

      const orderDate = new Date(o.date);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate ? new Date(toDate) : null;

      if (start && orderDate < start) return false;

      if (end) {
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }

      return true;
    })
    .filter((o) => {
      if (!searchTerm) return true;

      const user = users.find((u) => u.id === o.userId);

      return (
        o.id.toString().includes(searchTerm) ||
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const filters = [
    "All",
    "Paid",
    "In Transit",
    "Delivered",
    "Cancelled",
  ];

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
   1,
   Math.ceil(filteredOrders.length / itemsPerPage)
  );


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, fromDate, toDate]);


  return (
    <div className="admin-page">

      <div className="admin-header">
        <h2>Orders</h2>

        <input
          type="text"
          placeholder="Search by Order ID, Name or Email..."
          className="admin-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="order-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-chip ${
              statusFilter === filter ? "active" : ""
            }`}
            onClick={() => setStatusFilter(filter)}>
            {filter}
          </button>
        ))}
      </div>
      <div className="date-filters">
        <div>
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {(fromDate || toDate) && (
          <button
            className="clear-date-btn"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
          >Clear</button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="admin-table premium-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date & Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className="shimmer" style={{ height: "14px", width: "60%" }} />
                  </td>
                  <td>
                    <div className="shimmer" style={{ height: "14px", width: "80%" }} />
                  </td>
                  <td>
                    <div className="shimmer" style={{ height: "40px", width: "100%" }} />
                  </td>
                  <td>
                    <div className="shimmer" style={{ height: "14px", width: "50%" }} />
                  </td>
                  <td>
                    <div className="shimmer" style={{ height: "30px", width: "90px", borderRadius: "999px" }} />
                  </td>
                  <td>
                    <div className="shimmer" style={{ height: "14px", width: "70%" }} />
                  </td>
                </tr>
              ))
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No orders found
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => {
                const user = users.find(
                  (u) => u.id === order.userId
                );

                const formattedDate = new Date(
                  order.date
                ).toLocaleString();

                return (
                  <tr
                    key={order.id}
                    className="clickable-row"
                    onClick={() =>
                      navigate(`/admin/orders/${order.id}`) //navigate to order details page
                    }
                  >
                    <td><strong>{order.id}</strong></td>

                    <td>
                      <div className="customer-info">
                        <strong>{user?.name}</strong>
                        <small>{user?.email || "-"}</small>
                      </div>
                    </td>

                    <td>
                      {order.items?.slice(0, 2).map((item, index) => (
                        <div key={index} className="order-product compact">
                          <img
                            src={`/${item.image}`}
                            alt={item.name}
                            className="order-img"
                            onError={(e) =>
                              (e.target.src = "/images/placeholder.png")
                            }
                          />
                          <div>
                            <div>{item.name}</div>
                            <small>Qty : {item.quantity}</small>
                          </div>
                        </div>
                      ))}
                    </td>

                    <td>
                      <strong className="price">₹{order.total}</strong>
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        className={`status ${order.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                      >
                        <option>Paid</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>

                    <td>{formattedDate}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            > Prev</button>

            {[...Array(totalPages)].map((_, index) => (
             <button
               key={index}
               className={currentPage === index + 1 ? "active-page" : ""}
               onClick={() => setCurrentPage(index + 1)}
             >{index + 1}</button>
            ))}

           <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
           >Next </button>
         </div>
        )}      
      </div>
    </div>
  );
};

export default Orders2;
