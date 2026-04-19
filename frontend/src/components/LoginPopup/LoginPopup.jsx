import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      toast.success(currentState === "Login" ? "Welcome back!" : "Account created!");
      setShowLogin(false);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">

        {/* Brand */}
        <div className="login-popup-brand">
          <div className="login-popup-brand-icon">🍛</div>
          <span className="login-popup-brand-name">Apna <span>Swad</span></span>
        </div>

        {/* Title */}
        <div className="login-popup-title">
          <div className="login-popup-title-text">
            <h2>{currentState === "Login" ? "Welcome back" : "Create account"}</h2>
            <p>{currentState === "Login" ? "Sign in to continue ordering" : "Join us for great food"}</p>
          </div>
          <button type="button" className="login-popup-close" onClick={() => setShowLogin(false)}>
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
                placeholder="Priyambad Dubey"
                required
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
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="login-btn">
          {currentState === "Sign Up" ? "Create Account" : "Sign In"}
        </button>

        {/* Terms */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the Terms of Use & Privacy Policy.</p>
        </div>

        <div className="login-popup-divider">
          <hr /><span>or</span><hr />
        </div>

        {/* Switch */}
        <p className="login-popup-switch">
          {currentState === "Login" ? (
            <>New here? <span onClick={() => setCurrentState("Sign Up")}>Create an account</span></>
          ) : (
            <>Already have an account? <span onClick={() => setCurrentState("Login")}>Sign in</span></>
          )}
        </p>

      </form>
    </div>
  );
};

export default LoginPopup;