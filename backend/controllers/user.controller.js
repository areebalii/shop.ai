// controllers/user.controller.js
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input first (Avoids unnecessary DB calls)
    if (!name || !email || !password) {
      return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid email address"));
    }

    if (password.length < 8) {
      return res.status(400).json(new ApiResponse(400, null, "Password must be at least 8 characters long"));
    }

    // 2. Check existence
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json(new ApiResponse(409, null, "User already exists"));
    }

    // 3. Hash and Create
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 4. Generate Token & Response
    const token = createToken(user._id);
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json(
      new ApiResponse(201, { user: userResponse, token }, "User registered successfully")
    );

  } catch (error) {
    console.error(error); // Always log your errors for debugging!
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// controllers/user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json(new ApiResponse(400, null, "Email and password are required"));
    }

    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User does not exist"));
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json(new ApiResponse(401, null, "Invalid credentials"));
    }

    // Generate Token
    const token = createToken(user._id);
    
    // Remove password before sending to client
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(
      new ApiResponse(200, { user: userResponse, token }, "User logged in successfully")
    );

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// controllers/admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email+password, process.env.JWT_SECRET);
      return res.status(200).json(new ApiResponse(200, { token }, "Admin logged in successfully"));
    } else {
      return res.status(401).json(new ApiResponse(401, null, "Invalid credentials"));
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
}