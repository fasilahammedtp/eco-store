import { useEffect, useState, useMemo } from "react";
import { getTerrariums, addToCart } from "../services/api";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Terrariums() {
  const [terrariums, setTerrariums] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12;

  const { user } = useAuth();

  const handleAdd = (item) => {
    if (!user) {
      toast.error("Please login to add items");
      return;
    }
    return addToCart(item, user.id);
  };

  useEffect(() => {
    getTerrariums().then(res => {
      setTerrariums(res.data);
      setLoading(false);
    });
  }, []);


  const filteredTerrariums = useMemo(() => {
    return terrariums.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [terrariums, search]);


  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTerrariums = filteredTerrariums.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredTerrariums.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  useEffect(() => {
   const timer = setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 0);

  return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <div className="featured">
      <div className="page-header">
        <h2>Terrariums</h2>

        <input
          className="search-box"
          placeholder="Search terrariums..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>
      ) : (
        <>
          <div className="product-grid">
            {currentTerrariums.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onAdd={handleAdd}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Terrariums;
