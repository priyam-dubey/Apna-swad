// admin/src/pages/Orders/Orders.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

// How often to auto-refresh orders (ms). Set to 0 to disable polling.
const POLL_INTERVAL_MS = 15_000;

const Orders = ({ url }) => {
  const navigate          = useNavigate();
  const { token, admin, logout } = useContext(StoreContext);
  const [orders, setOrders]     = useState([]);
  // BUG FIX #29: No loading / error states — blank screen with zero feedback
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const pollRef                 = useRef(null);

  // ─── Fetch all orders ────────────────────────────────────────────────────────
  // BUG FIX #30 (Admin Dashboard Pipeline — core fix):
  // Original used GET /api/order/list. authMiddleware sets userId via req.body,
  // which is always empty on GET requests → RBAC check returned "not admin".
  // Now uses POST so req.body carries the decoded userId from the JWT.
  const fetchAllOrders = async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${url}/api/order/list`,
        {},                          // empty body — userId injected by authMiddleware
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else if (response.data.message?.toLowerCase().includes("not admin")) {
        // Token valid but user is not admin — force logout
        toast.error("Session invalid. Please log in again.");
        logout();
        navigate("/");
      } else {
        setError(response.data.message || "Failed to load orders.");
        if (!silent) toast.error(response.data.message || "Failed to load orders.");
      }
    } catch (err) {
      console.error("fetchAllOrders error:", err);
      const msg = "Network error. Could not fetch orders.";
      setError(msg);
      if (!silent) toast.error(msg);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // ─── Update order status via dropdown ────────────────────────────────────────
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(
        `${url}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // Optimistic local update — no need to refetch
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(response.data.message || "Status update failed.");
        await fetchAllOrders(true); // re-sync from server
      }
    } catch (err) {
      console.error("statusHandler error:", err);
      toast.error("Network error. Status not updated.");
    }
  };

  // ─── Confirm order (new dedicated endpoint) ───────────────────────────────
  // BUG FIX #31: New confirmOrder endpoint added per spec.
  const confirmOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `${url}/api/order/orders/${orderId}/confirm`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order confirmed and sent for delivery!");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, status: "Out for delivery", payment: true }
              : o
          )
        );
      } else {
        toast.error(response.data.message || "Confirmation failed.");
      }
    } catch (err) {
      console.error("confirmOrder error:", err);
      toast.error("Network error. Could not confirm order.");
    }
  };

  // ─── Guard + mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    // BUG FIX #32: Original guard was `!admin && !token` (AND) — only
    // redirected when BOTH were falsy. A user with a token but admin=false
    // could reach the orders page. Changed to OR.
    if (!admin || !token) {
      toast.error("Please login as admin first.");
      navigate("/");
      return;
    }

    fetchAllOrders();

    // Set up periodic polling for real-time-ish order updates
    if (POLL_INTERVAL_MS > 0) {
      pollRef.current = setInterval(() => fetchAllOrders(true), POLL_INTERVAL_MS);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [token, admin]);

  // ─── Render ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="order add">
        <h3>Order Page</h3>
        <div className="orders-loading">
          <p>Loading orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order add">
        <h3>Order Page</h3>
        <div className="orders-error">
          <p>{error}</p>
          <button onClick={() => fetchAllOrders()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order add">
      <div className="orders-header">
        <h3>Order Page</h3>
        <button
          className="orders-refresh-btn"
          onClick={() => fetchAllOrders()}
          title="Refresh orders"
        >
          ↻ Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>No orders yet. They will appear here automatically.</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />

              <div>
                <p className="order-item-food">
                  {order.items.map((item, i) =>
                    i === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>

              {/* Payment badge */}
              <span
                className={`order-payment-badge ${
                  order.payment ? "paid" : "unpaid"
                }`}
              >
                {order.payment ? "Paid" : "Unpaid"}
              </span>

              {/* Status dropdown */}
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

              {/* Confirm button (only visible when still processing) */}
              {order.status === "Food Processing" && (
                <button
                  className="confirm-order-btn"
                  onClick={() => confirmOrder(order._id)}
                >
                  Confirm
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
