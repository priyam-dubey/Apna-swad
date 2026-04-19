import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">🍛</div>
        <span className="navbar-brand-name">
          Apna <span>Swad</span>
        </span>
        <span className="navbar-badge">Admin</span>
      </div>

      <div className="navbar-right">
        <img
          className="navbar-profile"
          src={assets.profile_image}
          alt="Admin"
        />
      </div>
    </div>
  );
};

export default Navbar;