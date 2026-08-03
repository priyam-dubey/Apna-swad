// backend/models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId:  { type: String, required: true },
  items:   { type: Array,  required: true },
  amount:  { type: Number, required: true },
  address: { type: Object, required: true },
  status:  {
    type: String,
    default: "Food Processing",
    enum: ["Food Processing", "Out for delivery", "Delivered"],
  },
  // BUG FIX #16: `Date.now()` (with parentheses) was called ONCE at module
  // load time — every document got the exact same timestamp.
  // `Date.now` (without parentheses) is a function reference called per-document.
  date:    { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
