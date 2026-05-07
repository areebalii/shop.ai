import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

// Global Place Order (Handles COD, EasyPaisa, JazzCash)
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;
    const screenshotFile = req.file; // From Multer

    // 1. Parse data (If coming from Frontend FormData as strings)
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    let screenshotUrl = "";

    // 2. If it's a digital payment, upload the screenshot
    if (screenshotFile) {
      const uploadResponse = await cloudinary.uploader.upload(screenshotFile.path, {
        resource_type: "image",
        folder: "payment_screenshots"
      });
      screenshotUrl = uploadResponse.secure_url;
    }

    const orderData = {
      userId,
      items: parsedItems,
      address: parsedAddress,
      amount: Number(amount),
      paymentMethod,
      payment: false, // Always false until admin verifies
      paymentScreenshot: screenshotUrl,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({ success: true, message: "Order placed successfully. Awaiting verification." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status, payment } = req.body;
    // This allows updating either status, payment, or both
    const updateData = {};
    if (status) updateData.status = status;
    if (payment !== undefined) updateData.payment = payment;

    await orderModel.findByIdAndUpdate(orderId, updateData);
    res.status(200).json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}