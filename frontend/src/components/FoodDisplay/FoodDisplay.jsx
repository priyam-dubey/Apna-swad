import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  const filtered = food_list.filter(
    (item) => category === "All" || category === item.category
  );

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>
          {category === "All" ? (
            <>Top dishes <span>near you</span></>
          ) : (
            <>{category} <span>dishes</span></>
          )}
        </h2>
        <span className="food-display-count">
          {filtered.length} {filtered.length === 1 ? "item" : "items"} found
        </span>
      </div>

      <div className="food-display-list">
        {filtered.length === 0 ? (
          <div className="food-display-empty">
            No dishes found in this category yet.
          </div>
        ) : (
          filtered.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;