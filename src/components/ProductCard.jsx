// import { useToast } from "../context/ToastContext";
// import { useWishlist } from "../context/WishlistContext";
// import { useAuth } from "../context/AuthContext";
// import { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";

// function ProductCard({ item, onAdd }) {
//   const { wishlist, toggleWishlist } = useWishlist();
//   const { showToast } = useToast();
//   const { user } = useAuth();
//   const { loadCartCount } = useContext(CartContext);
//   const navigate = useNavigate();

//   const isLiked = wishlist.some(
//     p => p.productId === item.id
//   );

//   const handleAddToCart = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     if (!item.stock || item.stock <= 0) {
//       showToast("This product is out of stock ❌", "error");
//       return;
//     }

//     const res = await onAdd(item, user.id);

//     if (res === undefined) {
//       showToast("Already in cart", "info");
//     } else {
//       showToast("Added to cart", "success");
//       loadCartCount();
//     }
//   };

//   const handleBuyNow = (e) => {
//     e.preventDefault();

//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     if (!item.stock || item.stock <= 0) {
//       showToast("This product is out of stock ❌", "error");
//       return;
//     }

//     navigate("/checkout", {
//       state: {
//         buyNowItem: {
//           ...item,
//           quantity: 1
//         }
//       }
//     });
//   };

//   const handleWishlist = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     await toggleWishlist(item);

//     showToast(
//       isLiked ? "Removed from wishlist" : "Added to wishlist",
//       isLiked ? "error" : "success"
//     );
//   };

//   return (
//     <Link to={`/product/${item.id}`} className="product-link">
//       <div className="product-card">

//         <button
//           className={`wishlist-floating ${isLiked ? "liked" : ""}`}
//           onClick={handleWishlist}
//         >
//           <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
//         </button>

//         <img src={item.image} alt={item.name} />

//         <h4>{item.name}</h4>
//         <p>₹{item.price}</p>

//         {item.stock > 0 && item.stock <= 5 && (
//           <div className="low-stock-badge">
//             Only {item.stock} left 🔥
//           </div>
//         )}

//         {(!item.stock || item.stock <= 0) && (
//           <div className="out-stock-badge">
//             Out of Stock ❌
//           </div>
//         )}

//         <div className="card-actions">
//           <button
//             className={`cart-btn ${(!item.stock || item.stock <= 0) ? "disabled-btn" : ""}`}
//             disabled={!item.stock || item.stock <= 0}
//             onClick={handleAddToCart}
//           >
//             <i className="fa-solid fa-cart-shopping"></i>
//             Add to Cart
//           </button>

//           <button
//             className="buy-btn"
//             disabled={!item.stock || item.stock <= 0}
//             onClick={handleBuyNow}
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default ProductCard;

//prodcutcard.jsx
// import { useToast } from "../context/ToastContext";
// import { useWishlist } from "../context/WishlistContext";
// import { useAuth } from "../context/AuthContext";
// import { useContext, useState } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";

// function ProductCard({ item, onAdd }) {
//   const { wishlist, toggleWishlist } = useWishlist();
//   const { showToast } = useToast();
//   const { user } = useAuth();
//   const { loadCartCount } = useContext(CartContext);
//   const navigate = useNavigate();

//   const [imgLoaded, setImgLoaded] = useState(false); // ✅ added

//   const isLiked = wishlist.some(
//     p => p.productId === item.id
//   );

//   const handleAddToCart = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     if (!item.stock || item.stock <= 0) {
//       showToast("This product is out of stock ❌", "error");
//       return;
//     }

//     const res = await onAdd(item, user.id);

//     if (res === undefined) {
//       showToast("Already in cart", "info");
//     } else {
//       showToast("Added to cart", "success");
//       loadCartCount();
//     }
//   };

//   const handleBuyNow = (e) => {
//     e.preventDefault();

//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     if (!item.stock || item.stock <= 0) {
//       showToast("This product is out of stock ❌", "error");
//       return;
//     }

//     navigate("/checkout", {
//       state: {
//         buyNowItem: {
//           ...item,
//           quantity: 1
//         }
//       }
//     });
//   };

//   const handleWishlist = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     await toggleWishlist(item);

//     showToast(
//       isLiked ? "Removed from wishlist" : "Added to wishlist",
//       isLiked ? "error" : "success"
//     );
//   };

//   // ✅ FIXED IMAGE PATH (important)
//   const imageSrc =
//     item.image?.startsWith("/") || item.image?.startsWith("data:")
//       ? item.image
//       : "/" + item.image;

//   return (
//     <Link to={`/product/${item.id}`} className="product-link">
//       <div className="product-card">

//         <button
//           className={`wishlist-floating ${isLiked ? "liked" : ""}`}
//           onClick={handleWishlist}
//         >
//           <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
//         </button>

//         {/* ✅ Skeleton placeholder */}
//         {!imgLoaded && <div className="img-placeholder"></div>}

//         <img
//           src={imageSrc}
//           alt={item.name}
//           loading="lazy"
//           onLoad={() => setImgLoaded(true)}
//           onError={(e) => {
//             e.target.src = "/placeholder.jpg";
//           }}
//           style={{
//             display: imgLoaded ? "block" : "none"
//           }}
//         />

//         <h4>{item.name}</h4>
//         <p>₹{item.price}</p>

//         {item.stock > 0 && item.stock <= 5 && (
//           <div className="low-stock-badge">
//             Only {item.stock} left 🔥
//           </div>
//         )}

//         {(!item.stock || item.stock <= 0) && (
//           <div className="out-stock-badge">
//             Out of Stock ❌
//           </div>
//         )}

//         <div className="card-actions">
//           <button
//             className={`cart-btn ${(!item.stock || item.stock <= 0) ? "disabled-btn" : ""}`}
//             disabled={!item.stock || item.stock <= 0}
//             onClick={handleAddToCart}
//           >
//             <i className="fa-solid fa-cart-shopping"></i>
//             Add to Cart
//           </button>

//           <button
//             className="buy-btn"
//             disabled={!item.stock || item.stock <= 0}
//             onClick={handleBuyNow}
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default ProductCard;

import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ item, onAdd }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { loadCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [imgLoaded, setImgLoaded] = useState(false);

  const isLiked = wishlist.some(
    p => p.productId === item.id
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Please login first ❗", "error");
      navigate("/login");
      return;
    }

    if (!item.stock || item.stock <= 0) {
      showToast("This product is out of stock ❌", "error");
      return;
    }

    const res = await onAdd(item, user.id);

    if (res === undefined) {
      showToast("Already in cart", "info");
    } else {
      showToast("Added to cart", "success");
      loadCartCount();
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Please login first ❗", "error");
      navigate("/login");
      return;
    }

    if (!item.stock || item.stock <= 0) {
      showToast("This product is out of stock ❌", "error");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNowItem: {
          ...item,
          quantity: 1
        }
      }
    });
  };

  const handleWishlist = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Please login first ❗", "error");
      navigate("/login");
      return;
    }

    await toggleWishlist(item);

    showToast(
      isLiked ? "Removed from wishlist" : "Added to wishlist",
      isLiked ? "error" : "success"
    );
  };

  return (
    <Link to={`/product/${item.id}`} className="product-link">
      <div className="product-card">

        <button
          className={`wishlist-floating ${isLiked ? "liked" : ""}`}
          onClick={handleWishlist}
        >
          <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
        </button>

        {/* ✅ Skeleton placeholder */}
        {!imgLoaded && <div className="img-placeholder"></div>}

        <img
          src={item.image}   // 🔥 DO NOT CHANGE (this is key)
          alt={item.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
          style={{
            display: imgLoaded ? "block" : "none",
            transition: "opacity 0.3s ease"
          }}
        />

        <h4>{item.name}</h4>
        <p>₹{item.price}</p>

        {item.stock > 0 && item.stock <= 5 && (
          <div className="low-stock-badge">
            Only {item.stock} left 🔥
          </div>
        )}

        {(!item.stock || item.stock <= 0) && (
          <div className="out-stock-badge">
            Out of Stock ❌
          </div>
        )}

        <div className="card-actions">
          <button
            className={`cart-btn ${(!item.stock || item.stock <= 0) ? "disabled-btn" : ""}`}
            disabled={!item.stock || item.stock <= 0}
            onClick={handleAddToCart}
          >
            <i className="fa-solid fa-cart-shopping"></i>
            Add to Cart
          </button>

          <button
            className="buy-btn"
            disabled={!item.stock || item.stock <= 0}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;