import { useWishlist } from "../context/WishlistContext";
import { addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/wishlist.css";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  if (!wishlist || wishlist.length === 0) {
    return <h2 style={{ padding: "120px" }}>Wishlist is empty</h2>;
  }

  const handleAddToCart = async (item) => {
    await addToCart(item, user.id);
    await toggleWishlist(item); //  remove using context
  };

  return (
    <div className="featured">
      <div className="page-header">
        <h2>Your Wishlist <i className="fa-regular fa-heart"></i></h2>
      </div>

      <div className="slider">
        {wishlist.map(item => (
          <div className="product-card" key={item.id}>
            <img src={`/${item.image}`} alt={item.name} />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            <div className="wishlist-actions">
              <button
                className="add-cart-btn"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart 🛒
              </button>

              <button
                className="remove-btn"
                onClick={() => toggleWishlist(item)}  // 🔥 use context
              >
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
