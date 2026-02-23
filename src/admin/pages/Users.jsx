import { useAdminUsers } from "../context/AdminUserContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles2/admin.css";



const Users = () => {
  const { users, blockUser, unblockUser } = useAdminUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
   1,
   Math.ceil(filteredUsers.length / itemsPerPage)
  );


  useEffect(() => {
    setCurrentPage(1);
  },[searchTerm]);


  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Search user..."
          className="admin-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <tr key={index}>
                  <td>
                    <div
                      className="shimmer"
                      style={{ height: "14px", width: "70%" }}
                    />
                  </td>
                  <td>
                    <div
                      className="shimmer"
                      style={{ height: "14px", width: "90%" }}
                    />
                  </td>
                  <td>
                    <div
                      className="shimmer"
                      style={{
                        height: "28px",
                        width: "90px",
                        borderRadius: "999px",
                      }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      className="shimmer"
                      style={{
                        height: "32px",
                        width: "110px",
                        marginLeft: "auto",
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`status ${
                        user.isBlocked ? "cancelled" : "paid"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <button
                      className={`action-btn ${
                        user.isBlocked ? "unblock-btn" : "block-btn"
                      }`}
                      onClick={() =>
                        user.isBlocked
                          ? unblockUser(user.id)
                          : blockUser(user.id)
                      }
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <Link
                      to={`/admin/users/${user.id}`}
                      className="action-btn view"
                      style={{ marginLeft: "8px" }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
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
          > Next</button>
        </div>
       )}
      </div>
    </div>
  );
};

export default Users;
