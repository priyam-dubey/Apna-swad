// backend/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    // BUG FIX #13: email was stored as-entered (mixed case).
    // Now normalised to lowercase before save via the setter.
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, default: "user", enum: ["user", "admin"] },
    // BUG FIX #14: cartData is Mixed type — Mongoose won't auto-detect
    // mutations. The controllers now use $set / $unset operators directly
    // (see cartController.js) which bypasses Mongoose's change tracking.
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

// BUG FIX #15: Original code used `mongoose.model.user` (property access on
// the function object — always undefined) instead of `mongoose.models.user`.
// This caused "Cannot overwrite model once compiled" errors on hot-reload.
const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
