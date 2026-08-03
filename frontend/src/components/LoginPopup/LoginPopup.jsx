// frontend/src/components/LoginPopup/LoginPopup.jsx
import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  // BUG FIX #21: No loading state — clicking Login multiple times fired
  // duplicate requests and the button had no visual feedback.
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    const endpoint =
      currentState === "Login"
        ? `${url}/api/user/login`
        : `${url}/api/user/register`;

    try {
      const response = await axios.post(endpoint, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        // BUG FIX #22: role was returned by backend but never stored
        // in localStorage — admin panel had no way to detect user type.
        if (response.data.role) {
          localStorage.setItem("role", response.data.role);
        }
        toast.success(
          currentState === "Login" ? "Welcome back!" : "Account created!"
        );
        setShowLogin(false);
      } else {
        toast.error(response.data.message || "Authentication failed.");
      }
    } catch (err) {
      // BUG FIX #23: Original had NO try/catch — a network error (CORS,
      // timeout, backend down) would throw an unhandled promise rejection,
      // leaving the UI completely frozen with the popup open.
      console.error("Login error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">

        {/* Brand */}
        <div className="login-popup-brand">
          <div className="login-popup-brand-icon">🍛</div>
          <span className="login-popup-brand-name">
            Apna <span>Swad</span>
          </span>
        </div>

        {/* Title */}
        <div className="login-popup-title">
          <div className="login-popup-title-text">
            <h2>
              {currentState === "Login" ? "Welcome back" : "Create account"}
            </h2>
            <p>
              {currentState === "Login"
                ? "Sign in to continue ordering"
                : "Join us for great food"}
            </p>
          </div>
          <button
            type="button"
            className="login-popup-close"
            onClick={() => setShowLogin(false)}
            aria-label="Close"
          >
            <img src={assets.cross_icon} alt="Close" />
          </button>
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">
          {currentState !== "Login" && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={8}
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading
            ? "Please wait…"
            : currentState === "Login"
            ? "Sign In"
            : "Create Account"}
        </button>

        {/* Terms */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the Terms of Use &amp; Privacy Policy.</p>
        </div>

        <div className="login-popup-divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        {/* Switch */}
        <p className="login-popup-switch">
          {currentState === "Login" ? (
            <>
              New here?{" "}
              <span onClick={() => !loading && setCurrentState("Sign Up")}>
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => !loading && setCurrentState("Login")}>
                Sign in
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
