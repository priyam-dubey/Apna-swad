// backend/controllers/cartController.js
import userModel from "../models/userModel.js";

// ─── Add to cart ──────────────────────────────────────────────────────────────
// BUG FIX #7 (CRITICAL — Cart Injection Failure):
// Original code fetched cartData, mutated the plain JS object in memory, then
// called findByIdAndUpdate passing the mutated object. Because Mongoose treats
// cartData as a "Mixed" schema type it does NOT detect plain-object mutations;
// the update was silently written as an EMPTY object `{}` to MongoDB every time.
//
// Fix: use MongoDB's $set dot-notation operator to atomically update only the
// specific key, bypassing Mongoose's change-detection entirely.
const addToCart = async (req, res) => {
  const { userId, itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ success: false, message: "itemId is required." });
  }

  try {
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Read current quantity (default 0) then increment
    const currentQty = userData.cartData[itemId] || 0;
    const newQty = currentQty + 1;

    await userModel.findByIdAndUpdate(
      userId,
      { $set: { [`cartData.${itemId}`]: newQty } },
      { new: true }
    );

    return res.json({ success: true, message: "Item added to cart." });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── Remove from cart ─────────────────────────────────────────────────────────
const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ success: false, message: "itemId is required." });
  }

  try {
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const currentQty = userData.cartData[itemId] || 0;

    if (currentQty <= 1) {
      // Remove the key entirely via $unset
      await userModel.findByIdAndUpdate(
        userId,
        { $unset: { [`cartData.${itemId}`]: "" } }
      );
    } else {
      await userModel.findByIdAndUpdate(
        userId,
        { $set: { [`cartData.${itemId}`]: currentQty - 1 } }
      );
    }

    return res.json({ success: true, message: "Item removed from cart." });
  } catch (error) {
    console.error("removeFromCart error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── Get cart ─────────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export { addToCart, removeFromCart, getCart };
