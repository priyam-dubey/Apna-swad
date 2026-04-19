import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <div className="footer-logo-icon">🍛</div>
            <span className="footer-logo-name">Apna <span>Swad</span></span>
          </div>
          <p>
            Bringing the taste of home to your doorstep. Fresh ingredients,
            bold flavours, and fast delivery — every single day.
          </p>
          <div className="footer-social-icons">
            <a><img src={assets.facebook_icon} alt="Facebook" /></a>
            <a><img src={assets.twitter_icon} alt="Twitter" /></a>
            <a><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Get in Touch</h3>
          <ul>
            <li>+91-98765-43210</li>
            <li>contact@apnaswad.com</li>
            <li>Mon–Sat, 9am–9pm</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2024 <span>Apna Swad</span> — All Rights Reserved.
        </p>
        <div className="footer-bottom-links">
          <a>Terms of Service</a>
          <a>Privacy Policy</a>
          <a>Refund Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;