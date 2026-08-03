// admin/src/pages/List/List.jsx
import React, { useContext, useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate          = useNavigate();
  const { token, admin }  = useContext(StoreContext);
  const [list, setList]   = useState([]);
  const [loading, setLoading] = useState(false);

  // BUG FIX #34: Guard was `!admin && !token` — changed to `||`
  useEffect(() => {
    if (!admin || !token) {
      toast.error("Please login as admin first.");
      navigate("/");
      return;
    }
    fetchList();
  }, [admin, token, navigate]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message || "Could not load food list.");
      }
    } catch (err) {
      console.error("fetchList error:", err);
      toast.error("Network error. Could not load food list.");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Item removed.");
        // Optimistic local remove — no full refetch needed
        setList((prev) => prev.filter((item) => item._id !== foodId));
      } else {
        toast.error(response.data.message || "Could not remove item.");
      }
    } catch (err) {
      console.error("removeFood error:", err);
      toast.error("Network error. Could not remove food item.");
    }
  };

  return (
    <div className="list add flex-col">
      <p>All Food List</p>

      {loading ? (
        <p style={{ padding: "20px", color: "#888" }}>Loading…</p>
      ) : (
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>

          {list.length === 0 ? (
            <p style={{ padding: "16px", color: "#888" }}>No food items found.</p>
          ) : (
            list.map((item) => (
              <div key={item._id} className="list-table-format">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <p
                  onClick={() => removeFood(item._id)}
                  className="cursor"
                  title="Remove item"
                  style={{ color: "#e53935", fontWeight: 700, cursor: "pointer" }}
                >
                  ✕
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default List;
