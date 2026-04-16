// import express from 'express';
// import Groq from "groq-sdk";
// import Product from "../models/product.model.js"; // DOUBLE CHECK THIS PATH

// const chatRouter = express.Router();

// chatRouter.post("/ask", async (req, res) => {
//   try {
//     const { message } = req.body;

//     // Verify the API Key is loading from .env
//     if (!process.env.GROQ_API_KEY) {
//       console.error("ERROR: GROQ_API_KEY is undefined. Check your .env file.");
//       return res.status(500).json({ success: false, message: "Server configuration error." });
//     }

//     const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//     // 1. Fetch products from MongoDB
//     const products = await Product.find({}, "name price category description");

//     // If no products found, we still want to answer
//     const context = products.length > 0 ? JSON.stringify(products) : "No products available currently.";

//     // 2. Ask Groq
//     // 2. Ask Groq (Updated to the current active model)
//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: `You are the official AI assistant for WEARWELL.
//             Use ONLY this product data: ${context}.
//             If a user asks for something not listed, say we don't have it.
//             Keep answers short, professional, and friendly.`
//         },
//         { role: "user", content: message }
//       ],
//       model: "llama-3.1-8b-instant", // Use this updated model ID
//     });

//     const reply = chatCompletion.choices[0].message.content;
//     res.json({ success: true, reply });

//   } catch (error) {
//     console.error("GROQ ROUTE ERROR:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// export default chatRouter;



// ahmad code
