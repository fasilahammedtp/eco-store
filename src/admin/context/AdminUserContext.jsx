import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AdminUserContext = createContext();

const BASE_URL = "https://eco-store-opns.onrender.com";


export const AdminUserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/users`);

    const normalUsers = res.data.filter(
      user => user.role !== "admin"
    );

    setUsers(normalUsers);

  } catch (err) {
    console.error("Failed to fetch users", err);
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/users/${id}`, {
        isBlocked: true,
      });
      fetchUsers(); 
    } catch (err) {
      console.error("Failed to block user", err);
    }
  };

  const unblockUser = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/users/${id}`, {
        isBlocked: false,
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to unblock user", err);
    }
  };

  return (
    <AdminUserContext.Provider value={{ users, blockUser, unblockUser }}>
      {children}
    </AdminUserContext.Provider>
  );
};

export const useAdminUsers = () => useContext(AdminUserContext);
