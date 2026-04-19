import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "";
    if (s === "processing" || s === "out for delivery") return "processing";
    return "pending";
  };

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <h2>My <span>Orders</span></h2>
        <span className="my-orders-count">
          {data.length} {data.length === 1 ? "order" : "orders"} found
        </span>
      </div>

      <div className="my-orders-container">
        {data.length === 0 ? (
          <div className="my-orders-empty">
            <p>🛵 No orders yet — go explore our menu!</p>
          </div>
        ) : (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">

              <div className="order-icon-wrap">
                <img src={assets.parcel_icon} alt="Order" />
              </div>

              <p className="order-items-text">
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} × ${item.quantity}`
                    : `${item.name} × ${item.quantity}, `
                )}
              </p>

              <p className="order-amount">₹{order.amount}.00</p>

              <span className="order-items-count">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </span>

              <div className={`order-status ${getStatusClass(order.status)}`}>
                <span className="order-status-dot"></span>
                {order.status}
              </div>

              <button className="order-track-btn" onClick={fetchOrders}>
                Track Order
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;