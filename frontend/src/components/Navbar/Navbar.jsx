import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-brand">
        <div style={{
  width:"38px", height:"38px",
  background:"linear-gradient(135deg,#FF4500,#FF7A00)",
  borderRadius:"10px", display:"flex",
  alignItems:"center", justifyContent:"center",
  fontSize:"20px"
}}>🍛</div>
        <span className="brand-name">Apna <span>Swad</span></span>
      </Link>

      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
      </ul>

      <div className="navbar-right">
        <button className="icon-btn">
          <img src={assets.search_icon} alt="" style={{width:"18px"}} />
        </button>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <button className="icon-btn">
              <img src={assets.basket_icon} alt="" style={{width:"18px"}} />
            </button>
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button className="signin-btn" onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <button className="icon-btn">
              <img src={assets.profile_icon} alt="" style={{width:"22px"}} />
            </button>
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" /><p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" /><p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;