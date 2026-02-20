// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getPlants, getEcoProducts, getTerrariums } from "../services/api";
// import { addToCart } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { useToast } from "../context/ToastContext";
// import "./ProductDetails.css";

// function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();

//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     Promise.all([getPlants(), getEcoProducts(), getTerrariums()])
//       .then(([p, e, t]) => {
//         const all = [...p.data, ...e.data, ...t.data];
//         const found = all.find(item => item.id == id);
//         setProduct(found);
//       });
//   }, [id]);

//   if (!product) return <p>Loading...</p>;

//   const isOutOfStock = !product.stock || product.stock <= 0;

//   const handleIncrease = () => {
//     if (quantity < (product.stock || 0)) {
//       setQuantity(prev => prev + 1);
//     }
//   };

//   const handleDecrease = () => {
//     if (quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     if (isOutOfStock) {
//       showToast("This product is out of stock ❌", "error");
//       return;
//     }

//     await addToCart({ ...product, quantity }, user.id);
//     showToast("Added to cart 🛒", "success");
//   };

//   const handleBuyNow = () => {
//     if (!user) {
//       showToast("Please login first ❗", "error");
//       navigate("/login");
//       return;
//     }

//     if (isOutOfStock) {
//       showToast("This product is out of stock ❌", "error");
//       return;
//     }

//     navigate("/checkout", {
//       state: { buyNowItem: { ...product, quantity } }
//     });
//   };

//   return (
//     <div className="product-details-page">
//       <div className="product-details">

//       <img
//         src={product.image.startsWith("/") ? product.image : "/" + product.image}
//         alt={product.name}
//       />

//       <div className="details-info">
//         <h1>{product.name}</h1>
//         <h2>₹{product.price}</h2>

//         <p>{product.description}</p>

//         {product.stock > 0 && product.stock <= 5 && (
//           <div className="low-stock-badge">
//             Only {product.stock} left 🔥
//           </div>
//         )}

//         {isOutOfStock && (
//           <div className="out-stock-badge">
//             Out of Stock ❌
//           </div>
//         )}

//         {product.stock > 0 && (
//           <div className="qty-box">
//             <button onClick={handleDecrease}>−</button>
//             <span>{quantity}</span>
//             <button onClick={handleIncrease}>+</button>
//           </div>
//         )}

//         <div className="details-actions">
//           <button onClick={handleAddToCart}>
//             {isOutOfStock ? "Out of Stock" : "Add to Cart"}
//           </button>

//           <button
//             className="buy-btn"
//             onClick={handleBuyNow}
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetails;



import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getPlants, getEcoProducts, getTerrariums, getCart, addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { loadCartCount } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Load product from all categories
  useEffect(() => {
    Promise.all([getPlants(), getEcoProducts(), getTerrariums()])
      .then(([p, e, t]) => {
        const all = [...p.data, ...e.data, ...t.data];
        const found = all.find(item => Number(item.id) === Number(id));
        setProduct(found);
      });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const isOutOfStock = !product.stock || product.stock <= 0;

  const handleIncrease = () => {
    if (quantity < (product.stock || 0)) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToast("Please login first ❗", "error");
      navigate("/login");
      return;
    }

    if (isOutOfStock) {
      showToast("This product is out of stock ❌", "error");
      return;
    }

    // 🔥 Fetch current cart
    const res = await getCart();
    const userCart = res.data.filter(
      item => item.userId === user.id
    );

    // 🔥 Check if already exists
    const alreadyExists = userCart.find(
      item => Number(item.productId) === Number(product.id)
    );

    if (alreadyExists) {
      showToast("Already in cart 🛒", "info");
      return;
    }

    // 🔥 Add to cart
    await addToCart({ ...product, quantity }, user.id);

    // Update navbar count instantly
    loadCartCount();

    showToast("Added to cart 🛒", "success");
  };

  const handleBuyNow = () => {
    if (!user) {
      showToast("Please login first ❗", "error");
      navigate("/login");
      return;
    }

    if (isOutOfStock) {
      showToast("This product is out of stock ❌", "error");
      return;
    }

    navigate("/checkout", {
      state: { buyNowItem: { ...product, quantity } }
    });
  };

  return (
    <div className="product-details-page">
      <div className="product-details">

        <img
          src={
            product.image.startsWith("/")
              ? product.image
              : "/" + product.image
          }
          alt={product.name}
        />

        <div className="details-info">
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>

          <p>{product.description}</p>

          {product.stock > 0 && product.stock <= 5 && (
            <div className="low-stock-badge">
              Only {product.stock} left 🔥
            </div>
          )}

          {isOutOfStock && (
            <div className="out-stock-badge">
              Out of Stock ❌
            </div>
          )}

          {product.stock > 0 && (
            <div className="qty-box">
              <button onClick={handleDecrease}>−</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
          )}

          <div className="details-actions">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              className="buy-btn"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
