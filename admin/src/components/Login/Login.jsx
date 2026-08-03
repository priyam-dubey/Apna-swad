// admin/src/components/Login/Login.jsx
import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);

  const [data, setData]       = useState({ email: "", password: "" });
  // BUG FIX #26: No loading state — double-clicking Login fired duplicate
  // requests and the UI gave zero feedback during the network round-trip.
  const [loading, setLoading] = useState(false);

  // If already authenticated as admin, skip the login screen
  useEffect(() => {
    if (admin && token) {
      navigate("/add");
    }
  }, [admin, token, navigate]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/login`, data);

      if (response.data.success) {
        if (response.data.role === "admin") {
          // Persist auth state
          setToken(response.data.token);
          setAdmin(true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("admin", "true");
          // BUG FIX #27: role was never stored — on page refresh the admin
          // flag was lost and users were kicked back to login.
          localStorage.setItem("role", response.data.role);
          toast.success("Welcome back, Admin!");
          navigate("/add");
        } else {
          // Credentials valid but not an admin account
          toast.error("Access denied. This portal is for admins only.");
        }
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (err) {
      // BUG FIX #28: No try/catch meant any network error left the admin
      // portal frozen at a blank loading state with no feedback.
      console.error("Admin login error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Cannot reach the server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Login</h2>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
            Apna Swad — Management Portal
          </p>
        </div>

        <div className="login-popup-inputs">
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Admin email"
            required
            disabled={loading}
            autoComplete="email"
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
            disabled={loading}
            autoComplete="current-password"
            minLength={8}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
