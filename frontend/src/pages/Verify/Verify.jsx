import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(url + "/api/order/verify", { success, orderId });
    if (response.data.success) {
      toast.success("Order placed successfully! 🎉");
      navigate("/myorders");
    } else {
      toast.error("Payment verification failed.");
      navigate("/");
    }
  };

  useEffect(() => { verifyPayment(); }, []);

  return (
    <div className='verify'>
      <div className="verify-card">

        <div className="verify-brand">
          <div className="verify-brand-icon">🍛</div>
          <span className="verify-brand-name">Apna <span>Swad</span></span>
        </div>

        <div className="verify-spinner-ring">
          <div className="spinner"></div>
          <div className="verify-icon">🔐</div>
        </div>

        <h2 className="verify-title">Verifying your payment</h2>
        <p className="verify-subtitle">
          Please wait while we confirm your order.<br />
          This will only take a moment.
        </p>

        <div className="verify-steps">
          <div className="verify-step active">
            <div className="verify-step-dot"></div>
            Confirming payment with Stripe
          </div>
          <div className="verify-step">
            <div className="verify-step-dot"></div>
            Notifying the restaurant
          </div>
          <div className="verify-step">
            <div className="verify-step-dot"></div>
            Preparing your order summary
          </div>
        </div>

      </div>
    </div>
  );
};

export default Verify;