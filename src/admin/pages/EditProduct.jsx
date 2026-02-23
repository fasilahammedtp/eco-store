import { useParams, useNavigate ,Link} from "react-router-dom";
import { useAdminProducts } from "../context/AdminProductContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../styles2/admin.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useAdminProducts();

  const product = products.find(p => p.id === Number(id));

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setStock(product.stock ?? 0);
    }
  }, [product]);

  if (!product) {
    return <div className="admin-page">Loading...</div>;
  }

  const getCollection = (cat) => {
    if (cat === "Plants") return "plants";
    if (cat === "Eco Products") return "ecoProducts";
    if (cat === "Terrariums") return "terrariums";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateProduct(
      product.id,
      {
        ...product,
        name,
        category,
        price: Number(price),
        stock: Number(stock),
      },
      getCollection(category)
    );

    toast.success("Product updated successfully");
    navigate("/admin/products");
  };

  return (
    <div className="admin-page">
             <div className="breadcrumb">
               <Link to="/admin/products">Products</Link>
               <span> / </span>
               <span>products details</span>
             </div>
      <div className="premium-form-wrapper">
        <div className="premium-form-card">

          <div className="form-header">
            <h2>Edit Product</h2>
            <p>Update product details below</p>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="premium-btn">
                Update Product
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

export default EditProduct;
