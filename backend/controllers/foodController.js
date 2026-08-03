// backend/controllers/foodController.js
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// Shared admin check
const isAdmin = async (userId) => {
  const user = await userModel.findById(userId);
  return user && user.role === "admin";
};

// ─── Add food ─────────────────────────────────────────────────────────────────
const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image is required." });
  }

  try {
    if (!(await isAdmin(req.body.userId))) {
      // Clean up uploaded file if not authorised
      fs.unlink(`uploads/${req.file.filename}`, () => {});
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const food = new foodModel({
      name:        req.body.name,
      description: req.body.description,
      price:       req.body.price,
      category:    req.body.category,
      image:       req.file.filename,
    });
    await food.save();
    return res.json({ success: true, message: "Food item added successfully." });
  } catch (error) {
    console.error("addFood error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── List all food ────────────────────────────────────────────────────────────
const listFood = async (_req, res) => {
  try {
    const foods = await foodModel.find({});
    return res.json({ success: true, data: foods });
  } catch (error) {
    console.error("listFood error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── Remove food ──────────────────────────────────────────────────────────────
const removeFood = async (req, res) => {
  try {
    if (!(await isAdmin(req.body.userId))) {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }

    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.warn("Could not delete image file:", err.message);
    });

    await foodModel.findByIdAndDelete(req.body.id);
    return res.json({ success: true, message: "Food item removed." });
  } catch (error) {
    console.error("removeFood error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export { addFood, listFood, removeFood };
