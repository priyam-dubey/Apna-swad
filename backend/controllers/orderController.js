// backend/controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Helpers ──────────────────────────────────────────────────────────────────
// BUG FIX #8: frontend_url was hardcoded to localhost — breaks in production.
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// BUG FIX #9 (RBAC helper): Admin role check was copy-pasted into every
// controller function. Extracted to a reusable helper so it cannot drift.
const requireAdmin = async (userId, res) => {
  const user = await userModel.findById(userId);
  if (!user || user.role !== "admin") {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
    return false;
  }
  return true;
};

// ─── Place order ──────────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty." });
    }

    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();

    // Clear the user's cart after order is created
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr", // BUG FIX #10: was "usd" but prices are in ₹
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("placeOrder error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not create order. Please try again." });
  }
};

// ─── Verify payment (Stripe webhook callback) ─────────────────────────────────
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Payment confirmed." });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment cancelled." });
    }
  } catch (error) {
    console.error("verifyOrder error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Verification error." });
  }
};

// ─── User: fetch own orders ───────────────────────────────────────────────────
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .sort({ date: -1 }); // newest first
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("userOrders error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── Admin: list ALL orders ───────────────────────────────────────────────────
// BUG FIX #11 (Admin Dashboard Pipeline Failure):
// Original route was GET /api/order/list — but GET requests have no body,
// so req.body.userId was always undefined after authMiddleware set it.
// The RBAC check `userModel.findById(req.body.userId)` always got null → returned
// "You are not admin" to every admin. Fixed by:
//   1. Changing the route to POST so authMiddleware can inject userId via body.
//   2. Using the requireAdmin helper which now reliably reads userId.
const listOrders = async (req, res) => {
  try {
    const isAdmin = await requireAdmin(req.body.userId, res);
    if (!isAdmin) return;

    const orders = await orderModel.find({}).sort({ date: -1 });
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("listOrders error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── Admin: update order status ───────────────────────────────────────────────
const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  const validStatuses = ["Food Processing", "Out for delivery", "Delivered"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid status value." });
  }

  try {
    const isAdmin = await requireAdmin(req.body.userId, res);
    if (!isAdmin) return;

    await orderModel.findByIdAndUpdate(orderId, { status });
    return res.json({ success: true, message: "Order status updated successfully." });
  } catch (error) {
    console.error("updateStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── Admin: confirm order (new explicit confirm endpoint) ─────────────────────
// BUG FIX #12: There was no dedicated PUT /api/orders/:id/confirm endpoint
// as required by the spec. Added here; also exposed in orderRoute.js.
const confirmOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const isAdmin = await requireAdmin(req.body.userId, res);
    if (!isAdmin) return;

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status: "Out for delivery", payment: true },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    return res.json({ success: true, message: "Order confirmed.", data: order });
  } catch (error) {
    console.error("confirmOrder error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, confirmOrder };
