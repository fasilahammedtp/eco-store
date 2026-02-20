import { createContext, useEffect, useState } from "react";
import { getCart } from "../services/api";
import { useAuth } from "./AuthContext";

export const CartContext = createContext(); 

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const loadCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const res = await getCart();

    const userCart = res.data.filter(
      item => item.userId === user.id
    );

    setCartCount(userCart.length);
  };

  useEffect(() => {
    loadCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
