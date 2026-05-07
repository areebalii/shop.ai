import express from "express";
import { allOrders, placeOrder, updateStatus, userOrders } from "../controllers/order.controller.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js";
import { authUser } from "../middleware/Auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const orderRouter = express.Router();

// admin panel routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// payment routes (Modified to accept 1 image)
orderRouter.post("/place", upload.single('paymentScreenshot'), authUser, placeOrder);

// user feature
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;