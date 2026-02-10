import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";   

export const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if(!token) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if(tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
}