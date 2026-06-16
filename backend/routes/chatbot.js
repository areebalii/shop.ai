import express from "express";
import OpenAI from "openai";
import Product from "../models/product.model.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

router.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({
        output: {
          role: "assistant",
          content: "Please provide a valid message.",
        },
      });
    }

    // 1. Fetch live database items
    const dbProducts = await Product.find(
      {},
      "name description price category subCategory sizes discount bestSeller"
    );

    // 2. Clean and format — always recalculate price from discount field
    const liveProducts = dbProducts.map(p => {
      const originalPrice = Number(p.price) || 0;
      const discountPercentage = Number(p.discount) || 0;
      const currentPrice = discountPercentage > 0
        ? Math.round(originalPrice - (originalPrice * discountPercentage / 100))
        : originalPrice;

      return {
        name: p.name,
        originalPrice,
        discountPercentage,
        currentPrice,
        sizes: p.sizes || []
      };
    });

    // 3. Filter discounted items
    const discountedItemsList = liveProducts.filter(item => item.discountPercentage > 0);

    // 4. Build active sales context for the prompt
    let activeSalesContext = "No active promotions are available at this time.";
    if (discountedItemsList.length > 0) {
      activeSalesContext = discountedItemsList.map(item =>
        `• **${item.name}**: Now **${item.discountPercentage}% OFF**! Original Price: Rs. ${item.originalPrice} | Promo Price: Rs. ${item.currentPrice}`
      ).join("\n");
    }

    // 5. Store policies
    const storePolicies = {
      name: "WEARWELL",
      paymentMethods: ["Cash on Delivery (COD)", "EasyPaisa", "JazzCash"],
      shippingPolicy: "Standard Delivery takes 3-5 business days. Express Delivery takes 1-2 business days.",
      returnPolicy: "30-day return window. Products must be unused and in original packaging with tags intact.",
      customerSupport: "support@wearwell.com (Working Hours: Monday-Saturday: 9AM - 8PM)",
      sizeCharts: {
        menTops: 'S: 36-38", M: 39-41", L: 42-44", XL: 45-47", XXL: 48-50" (Chest)',
        menBottoms: 'S: 28-30", M: 32-34", L: 36-38", XL: 40-42", XXL: 44-46" (Waist)',
        womenTops: 'XS: 30-32", S: 33-35", M: 36-38", L: 39-41", XL: 42-44" (Bust)',
        womenBottoms: 'XS: 24-26", S: 27-29", M: 30-32", L: 33-35", XL: 36-38" (Waist)',
        kids: "2-3Y (92-98cm), 4-5Y (104-110cm), 6-7Y (116-122cm), 8-9Y (128-134cm), 10-11Y (140-146cm), 12-13Y (152-158cm)"
      }
    };

    // 6. Build system prompt
    const systemPrompt = `
You are the friendly and professional official AI customer support assistant for ${storePolicies.name}.

=========================================
STORE DATA & POLICIES
=========================================
- Payment Methods: ${storePolicies.paymentMethods.join(", ")}
- Shipping Timeline: ${storePolicies.shippingPolicy}
- Return Policy: ${storePolicies.returnPolicy}
- Customer Support: ${storePolicies.customerSupport}

=========================================
OFFICIAL SIZE CHART RULES
=========================================
- Men's Tops: ${storePolicies.sizeCharts.menTops}
- Men's Bottoms: ${storePolicies.sizeCharts.menBottoms}
- Women's Tops: ${storePolicies.sizeCharts.womenTops}
- Women's Bottoms: ${storePolicies.sizeCharts.womenBottoms}
- Kids Sizes: ${storePolicies.sizeCharts.kids}

=========================================
LIVE INVENTORY DATA
=========================================
${JSON.stringify(liveProducts, null, 2)}

=========================================
ACTIVE DISCOUNTS DATA (PRE-FILTERED)
=========================================
${activeSalesContext}

=========================================
CRITICAL BUSINESS RULES
=========================================
1. If the user asks about sales, discounts, or promotions, you MUST output the exact list found under ACTIVE DISCOUNTS DATA (PRE-FILTERED).
2. If the "ACTIVE DISCOUNTS DATA" section says "No active promotions...", only then can you state there are no sales.
3. If a user asks for a size that is missing from a specific product's "sizes" array in the LIVE INVENTORY DATA, explicitly state that it is out of stock.
4. Keep formatting clean using headings (###) and bullet points (•).
`;

    // 7. Call Groq API
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `<user_query>${userMessage}</user_query>` },
      ],
      temperature: 0.0,
      max_tokens: 800
    });

    res.json({
      output: completion.choices[0].message,
    });

  } catch (error) {
    console.error("Chatbot error encountered:", error);
    res.status(500).json({
      output: {
        role: "assistant",
        content: "Something went wrong. Please try rephrasing your question.",
      },
    });
  }
});

export default router;