import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
}