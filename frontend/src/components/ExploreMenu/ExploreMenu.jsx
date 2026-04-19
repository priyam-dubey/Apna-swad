import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-header">
        <span className="explore-menu-tag">🍽 Our Menu</span>
        <h1>What are you <span>craving</span> today?</h1>
        <p className="explore-menu-text">
          Browse through our diverse categories — from spicy street food to
          wholesome meals. Fresh ingredients, bold flavours, delivered fast.
        </p>
      </div>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? "All" : item.menu_name
              )
            }
            className={`explore-menu-list-item ${
              category === item.menu_name ? "active-card" : ""
            }`}
          >
            <img src={item.menu_image} alt={item.menu_name} />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>

      <hr className="explore-menu-divider" />
    </div>
  );
};

export default ExploreMenu;