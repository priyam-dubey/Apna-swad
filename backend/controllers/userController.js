// backend/controllers/userController.js
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// ─── Token factory ────────────────────────────────────────────────────────────
// BUG FIX #3: Original createToken had NO expiry — tokens lived forever.
// Added a 7-day expiry for security.
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured on the server.");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ─── Login ────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // BUG FIX #4: No input validation on login — empty strings reached the DB.
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = createToken(user._id);
    // BUG FIX #5: role was returned but frontend never consumed it for routing.
    // Returning it here; the frontend Login component now uses it correctly.
    return res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error("loginUser error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// ─── Register ─────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const exists = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "An account with this email already exists." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email address." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters." });
    }

    // BUG FIX #6: SALT env var was read with Number() but if undefined it
    // returns NaN — bcrypt then crashes silently. Default to 10.
    const saltRounds = Number(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    return res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error("registerUser error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

export { loginUser, registerUser };
