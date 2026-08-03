// frontend/src/context/StoreContext.jsx
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems]   = useState({});
  const [food_list, setFoodList]    = useState([]);
  const [token, setToken]           = useState("");
  // BUG FIX #19: VITE_BACKEND_URL was read directly — if undefined every
  // axios call went to "undefined/api/..." and silently 404-ed.
  // Added a localhost fallback so dev still works without a .env file.
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // ─── Cart: add ──────────────────────────────────────────────────────────────
  const addToCart = async (itemId) => {
    // Optimistic UI update first
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        const response = await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
        if (!response.data.success) {
          // Roll back optimistic update on failure
          setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
          }));
          toast.error(response.data.message || "Failed to add item.");
        }
      } catch {
        setCartItems((prev) => ({
          ...prev,
          [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
        }));
        toast.error("Network error. Could not add item to cart.");
      }
    }
  };

  // ─── Cart: remove ────────────────────────────────────────────────────────────
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));

    if (token) {
      try {
        const response = await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
        if (!response.data.success) {
          // Roll back
          setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
          }));
          toast.error(response.data.message || "Failed to remove item.");
        }
      } catch {
        setCartItems((prev) => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + 1,
        }));
        toast.error("Network error. Could not remove item.");
      }
    }
  };

  // ─── Cart: total ─────────────────────────────────────────────────────────────
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((p) => p._id === itemId);
        if (item) total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  // ─── Food list ───────────────────────────────────────────────────────────────
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        toast.error("Could not load the menu. Please refresh.");
      }
    } catch {
      toast.error("Server unreachable. Please check your connection.");
    }
  };

  // ─── Cart sync from server ───────────────────────────────────────────────────
  // BUG FIX #20: loadCardData (typo) had no error handling — if the token
  // was expired the catch was silent and cartItems was left as `undefined`
  // (response.data.cartData could be null), crashing getTotalCartAmount.
  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: authToken } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (err) {
      console.warn("Could not load cart data:", err.message);
      // Non-fatal — user can still browse and add items
    }
  };

  // ─── Bootstrap on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    init();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
