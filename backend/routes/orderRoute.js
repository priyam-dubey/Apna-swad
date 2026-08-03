// backend/routes/orderRoute.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
  confirmOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);

// BUG FIX #11 (continued): Changed GET → POST so authMiddleware can
// inject userId from the decoded JWT into req.body.
orderRouter.post("/list", authMiddleware, listOrders);

orderRouter.post("/status", authMiddleware, updateStatus);

// BUG FIX #12: New explicit confirm endpoint for the admin dashboard.
orderRouter.put("/orders/:id/confirm", authMiddleware, confirmOrder);

export default orderRouter;
