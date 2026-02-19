import express from "express";
import { allOrders, placeOrder, placeOrderRazorPay, placeOrderStripe, updateStatus, userOrders } from "../controllers/order.controller.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js";
import { authUser } from "../middleware/Auth.middleware.js";


const orderRouter = express.Router();

// admin panel routes
orderRouter.post("/list", adminAuth, allOrders)
orderRouter.post("/status", adminAuth, updateStatus)

// payment routes
orderRouter.post("/place", authUser, placeOrder)
orderRouter.post("/stripe", placeOrderStripe)
orderRouter.post("/razorpay", placeOrderRazorPay)

// user feature
orderRouter.post("/userorders", authUser, userOrders)

export default orderRouter;