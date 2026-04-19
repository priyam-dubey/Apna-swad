import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "",
    street: "", city: "", state: "",
    zipcode: "", country: "", phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [token]);

  const Field = ({ label, ...props }) => (
    <div className="input-row">
      <label>{label}</label>
      <input onChange={onChangeHandler} {...props} />
    </div>
  );

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <span className="section-tag">📦 Step 1 of 2</span>
        <p className="title">Delivery <span>Information</span></p>

        <div className="multi-fields">
          <Field label="First Name" name="firstName" value={data.firstName} type="text" placeholder="Priyambad" required />
          <Field label="Last Name" name="lastName" value={data.lastName} type="text" placeholder="Dubey" required />
        </div>
        <Field label="Email Address" name="email" value={data.email} type="email" placeholder="you@example.com" required />
        <Field label="Street Address" name="street" value={data.street} type="text" placeholder="123, Main Street" required />
        <div className="multi-fields">
          <Field label="City" name="city" value={data.city} type="text" placeholder="Patna" required />
          <Field label="State" name="state" value={data.state} type="text" placeholder="Bihar" required />
        </div>
        <div className="multi-fields">
          <Field label="ZIP Code" name="zipcode" value={data.zipcode} type="text" placeholder="800001" required />
          <Field label="Country" name="country" value={data.country} type="text" placeholder="India" required />
        </div>
        <Field label="Phone Number" name="phone" value={data.phone} type="text" placeholder="+91 98765 43210" required />
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
          <button type="submit">Proceed to Payment →</button>
          <p className="order-note">🔒 Secured by Stripe</p>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;