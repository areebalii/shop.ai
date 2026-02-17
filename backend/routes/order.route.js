import express from "express";
import { allOrders, placeOrder, placeOrderRazorPay, placeOrderStripe, updateStatus } from "../controllers/order.controller.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js";
import { authUser } from "../middleware/Auth.middleware.js";


const orderRouter = express.Router();

// admin panel routes
orderRouter.post("/list", adminAuth, allOrders)
orderRouter.post("/status", adminAuth, updateStatus)

// user panel routes
orderRouter.post("/place", authUser, placeOrder)
orderRouter.post("/stripe", placeOrderStripe)
orderRouter.post("/razorpay", placeOrderRazorPay)

export default orderRouter;