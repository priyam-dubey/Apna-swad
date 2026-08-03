// backend/server.js

import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Force Google DNS to avoid MongoDB Atlas SRV lookup issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// ─── Security middlewares ─────────────────────────────────────────────────────
// BUG FIX #17: CORS was wide-open (`cors()` with no config) — any origin
// could call the API. Locked to explicit allowed origins.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: origin ${origin} not allowed.`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

// ─── DB connection ────────────────────────────────────────────────────────────
connectDB();

// ─── API routes ───────────────────────────────────────────────────────────────
app.use("/api/food",  foodRouter);
app.use("/api/user",  userRouter);
app.use("/api/cart",  cartRouter);
app.use("/api/order", orderRouter);
app.use("/images",    express.static("uploads"));

app.get("/", (_req, res) => res.send("Apna Swad API — running ✓"));

// ─── Global error handler ─────────────────────────────────────────────────────
// BUG FIX #18: Unhandled errors crashed the process silently in production.
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const server = app.listen(port, () => {
  console.log(`Apna Swad server started on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server shut down gracefully.");
    process.exit(0);
  });
});

export default app;
