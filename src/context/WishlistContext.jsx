import { createContext, useContext, useEffect, useState, } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const loadWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const res = await getWishlist();
    const userWishlist = res.data.filter(
      item => item.userId === user.id
    );

    setWishlist(userWishlist);
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) return;

    const productId = product.productId || product.id;

    const exists = wishlist.find(
      item => item.productId === productId
    );

    if (exists) {
      await removeFromWishlist(exists.id);


      setWishlist(prev =>
        prev.filter(i => i.id !== exists.id)
      );

    } else {
      const res = await addToWishlist(product, user.id);


      setWishlist(prev => [...prev, res.data]);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
export const useWishlist = () => useContext(WishlistContext);
