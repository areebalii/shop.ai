import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// place order using COD method
export const placeOrder = async (req, res) => {
  try {
    const {userId, items, amount, address} = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: new Date(),
    }
    const newOrder = new Order(orderData);
    await newOrder.save();
    await User.findByIdAndUpdate(userId, {cartData: {}})
    res.status(200).json({success: true, message: "Order placed successfully"});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Something went wrong"});
  }
}

// place order using stripe method
export const placeOrderStripe = async (req, res) => {}

// place order using razorPay method
export const placeOrderRazorPay = async (req, res) => {}

// all order data for admin panel
export const allOrders = async (req, res) => {}

// all data for frontend
export const userOrders = async (req, res) => {}

// update order status from admin panel
export const updateStatus = async (req, res) => {}
