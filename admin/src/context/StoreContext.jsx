// admin/src/context/StoreContext.jsx
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    // BUG FIX #25: Original code read localStorage but never validated that
    // both token AND admin flag were present — a regular user who somehow had
    // a stale "admin" key in localStorage could bypass the login screen.
    const storedToken = localStorage.getItem("token");
    const storedRole  = localStorage.getItem("role");   // set during login
    const storedAdmin = localStorage.getItem("admin");   // legacy key

    if (storedToken && (storedRole === "admin" || storedAdmin === "true")) {
      setToken(storedToken);
      setAdmin(true);
    } else {
      // Clear any inconsistent state
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      localStorage.removeItem("role");
    }
  }, []);

  // Helper so consumers can call logout() from anywhere
  const logout = () => {
    setToken("");
    setAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");
  };

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
