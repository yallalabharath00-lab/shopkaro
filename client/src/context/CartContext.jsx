import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

const API_URL = "http://localhost:5000/api/cart";

export function CartProvider({ children }) {
  const { token, isLoggedIn } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==============================
  // GET CART FROM BACKEND
  // ==============================

  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      setCart(data.cart.items || []);
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart whenever user logs in
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isLoggedIn, token]);

  // ==============================
  // ADD TO CART
  // ==============================

  const addToCart = async (product) => {
    if (!token) {
      alert("Please login to add products to cart.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add product");
      }

      setCart(data.cart.items || []);

      alert("Product added to cart!");
    } catch (error) {
      console.error("Add Cart Error:", error);
      alert(error.message);
    }
  };

  // ==============================
  // REMOVE FROM CART
  // ==============================

  const removeFromCart = async (productId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/remove/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to remove product");
      }

      setCart(data.cart.items || []);
    } catch (error) {
      console.error("Remove Cart Error:", error);
      alert(error.message);
    }
  };

  // ==============================
  // UPDATE QUANTITY
  // ==============================

  const updateQuantity = async (productId, quantity) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/update`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update cart");
      }

      setCart(data.cart.items || []);
    } catch (error) {
      console.error("Update Cart Error:", error);
      alert(error.message);
    }
  };

  // ==============================
  // INCREASE QUANTITY
  // ==============================

  const increaseQuantity = (productId) => {
    const item = cart.find(
      (item) => item.product?._id === productId
    );

    if (!item) return;

    updateQuantity(
      productId,
      item.quantity + 1
    );
  };

  // ==============================
  // DECREASE QUANTITY
  // ==============================

  const decreaseQuantity = (productId) => {
    const item = cart.find(
      (item) => item.product?._id === productId
    );

    if (!item) return;

    updateQuantity(
      productId,
      item.quantity - 1
    );
  };

  // ==============================
  // CALCULATE TOTAL
  // ==============================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartTotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}