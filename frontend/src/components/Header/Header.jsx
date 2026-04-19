import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <div className="header-badge">
          <span></span> Now delivering near you
        </div>

        <h2>
          Taste the love,<br />
          <em>Apna Swad</em> delivered
        </h2>

        <p>
          From your favourite local kitchens to your doorstep — fresh,
          fast, and full of flavour. Explore hundreds of dishes crafted
          with the finest ingredients.
        </p>

        <div className="header-actions">
          <button className="btn-primary" onClick={() => document.getElementById('explore-menu')?.scrollIntoView({behavior:'smooth'})}>
            Explore Menu
          </button>
          <button className="btn-secondary">
            How it works
          </button>
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Dishes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">30 min</span>
            <span className="stat-label">Avg delivery</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.8★</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;