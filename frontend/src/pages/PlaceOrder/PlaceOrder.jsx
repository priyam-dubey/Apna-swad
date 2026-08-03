// frontend/src/pages/PlaceOrder/PlaceOrder.jsx
import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "", lastName: "",  email:   "",
    street:    "", city:      "", state:   "",
    zipcode:   "", country:   "", phone:   "",
  });

  // Guard: redirect away if not logged in or cart is empty
  useEffect(() => {
    if (!token) {
      toast.error("Please login to place an order.");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const orderItems = food_list
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => ({ ...item, quantity: cartItems[item._id] }));

      if (orderItems.length === 0) {
        toast.error("Your cart is empty.");
        navigate("/cart");
        return;
      }

      const orderData = {
        address: data,
        items:   orderItems,
        amount:  getTotalCartAmount() + 2,
      };

      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message || "Could not place order. Please try again.");
      }
    } catch (err) {
      // BUG FIX #35: No try/catch — a Stripe misconfiguration or network
      // error left the page frozen with the button permanently disabled.
      console.error("placeOrder error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Network error. Could not place order."
      );
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, ...props }) => (
    <div className="input-row">
      <label>{label}</label>
      <input onChange={onChangeHandler} disabled={loading} {...props} />
    </div>
  );

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <span className="section-tag">📦 Step 1 of 2</span>
        <p className="title">
          Delivery <span>Information</span>
        </p>

        <div className="multi-fields">
          <Field label="First Name" name="firstName" value={data.firstName} type="text" placeholder="First name" required />
          <Field label="Last Name"  name="lastName"  value={data.lastName}  type="text" placeholder="Last name"  required />
        </div>
        <Field label="Email Address" name="email"   value={data.email}   type="email" placeholder="you@example.com"  required />
        <Field label="Street Address" name="street" value={data.street}  type="text"  placeholder="123, Main Street" required />
        <div className="multi-fields">
          <Field label="City"  name="city"  value={data.city}  type="text" placeholder="City"  required />
          <Field label="State" name="state" value={data.state} type="text" placeholder="State" required />
        </div>
        <div className="multi-fields">
          <Field label="ZIP Code" name="zipcode" value={data.zipcode} type="text" placeholder="ZIP" required />
          <Field label="Country"  name="country" value={data.country} type="text" placeholder="Country" required />
        </div>
        <Field label="Phone Number" name="phone" value={data.phone} type="tel" placeholder="+91 98765 43210" required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Redirecting to payment…" : "Proceed to Payment →"}
          </button>
          <p className="order-note">🔒 Secured by Stripe</p>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
