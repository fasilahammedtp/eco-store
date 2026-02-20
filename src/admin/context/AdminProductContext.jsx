import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AdminProductContext = createContext();
const BASE_URL = "http://localhost:5000";

export const AdminProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const plants = await axios.get(`${BASE_URL}/plants`);
      const eco = await axios.get(`${BASE_URL}/ecoProducts`);
      const terr = await axios.get(`${BASE_URL}/terrariums`);

      // Attach category manually
      const allProducts = [
        ...plants.data.map(p => ({ ...p, category: "Plants" })),
        ...eco.data.map(p => ({ ...p, category: "Eco Products" })),
        ...terr.data.map(p => ({ ...p, category: "Terrariums" })),
      ];

      setProducts(allProducts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* add */
  const addProduct = async (product) => {
    try {
      const endpoint =
        product.category === "Plants"
          ? "plants"
          : product.category === "Eco Products"
          ? "ecoProducts"
          : "terrariums";

      await axios.post(`${BASE_URL}/${endpoint}`, product);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  /* update */

  const updateProduct = async (id, product) => {
    try {
      const endpoint =
        product.category === "Plants"
          ? "plants"
          : product.category === "Eco Products"
          ? "ecoProducts"
          : "terrariums";

      await axios.put(`${BASE_URL}/${endpoint}/${id}`, product);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  /* delete */

  const deleteProduct = async (id, category) => {
    try {
      const endpoint =
        category === "Plants"
          ? "plants"
          : category === "Eco Products"
          ? "ecoProducts"
          : "terrariums";

      await axios.delete(`${BASE_URL}/${endpoint}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </AdminProductContext.Provider>
  );
};

export const useAdminProducts = () => {
  return useContext(AdminProductContext);
};
