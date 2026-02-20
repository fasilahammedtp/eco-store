import { useAdminProducts } from "../context/AdminProductContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import "../styles2/admin.css";

const Products = () => {
  const { products, deleteProduct } = useAdminProducts();

  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;


  useEffect(() => {
      setLoading(false);
  }, []);

  const handleDelete = (id, category) => {
    if (!window.confirm("Delete this product?")) return;
    deleteProduct(id, category);
    toast.success("Product deleted");
  };

  const filteredProducts = products
    .filter((p) =>
      category === "All" ? true : p.category === category
    )
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
   1,
   Math.ceil(filteredProducts.length / itemsPerPage)
  );


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category]);

  const getStockStatus = (stock) => {
    if (stock === 0) return "out";
    if (stock <= 5) return "low";
    return "in";
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Products</h2>

        <div className="header-actions">
          <Link to="/admin/products/add" className="add-btn premium-add">
            <i className="fa-solid fa-circle-plus"></i> Add Product
          </Link>

          <input
            type="text"
            placeholder="Search product..."
            className="admin-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="order-filters">
        {["All", "Plants", "Eco Products", "Terrariums"].map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td>
                    <div
                      className="shimmer"
                      style={{ height: 14, width: "80%" }}
                    />
                  </td>
                  <td>
                    <div
                      className="shimmer"
                      style={{
                        height: 20,
                        width: 90,
                        borderRadius: 999,
                      }}
                    />
                  </td>
                  <td>
                    <div
                      className="shimmer"
                      style={{ height: 14, width: "40%" }}
                    />
                  </td>
                  <td>
                    <div
                      className="shimmer"
                      style={{ height: 14, width: "40%" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      className="shimmer"
                      style={{
                        height: 28,
                        width: 70,
                        marginLeft: "auto",
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">
                  No products found
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock || 0);

                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>

                    <td>
                      <span
                        className={`pill ${
                          product.category
                            ? product.category
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            : "uncategorized"
                        }`}
                      >
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    <td>₹{product.price}</td>

                    <td>
                      <span className={`stock-badge ${stockStatus}`}>
                        {product.stock ?? 0}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="action-btn edit"
                      >
                        Edit
                      </Link>

                      <button
                        className="action-btn delete"
                        onClick={() =>
                          handleDelete(product.id, product.category)
                        }
                      >
                        Delete
                      </button>
                    </td>
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
            >Prev</button>

           {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(index + 1)}
              > {index + 1}</button>
           ))}

           <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
           >Next</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
