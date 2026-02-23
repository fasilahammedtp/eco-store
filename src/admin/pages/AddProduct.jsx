import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminProducts } from "../context/AdminProductContext";
import { toast } from "react-toastify";
import "../styles2/admin.css";

const AddProduct = () => {
  const { addProduct } = useAdminProducts();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "Plants",
    price: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || form.stock === "") {
      toast.error("Please fill all required fields");
      return;
    }

    addProduct({
      id: Date.now(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || "/placeholder.jpg", 
    });

    toast.success("Product added successfully");
    navigate("/admin/products");
  };

  return (
    <div className="admin-page">

      <div className="breadcrumb">
        <Link to="/admin/products">Products</Link>
        <span> / </span>
        <span>Add Product</span>
      </div>

      <div className="page-header">
        <div>
          <h2 className="page-title">Add New Product</h2>
          <p className="page-subtitle">
            Create and publish a new product to your store
          </p>
        </div>
      </div>

      <div className="premium-form-wrapper">
        <div className="premium-form-card">

          <form onSubmit={handleSubmit} className="premium-form">

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name..."
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Plants</option>
                  <option>Eco Products</option>
                  <option>Terrariums</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter product price"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                placeholder="Enter available stock"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="text"
                name="image"
                placeholder="Enter image URL (leave empty for default)"
                value={form.image}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="premium-btn">
                + Save Product
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default AddProduct;