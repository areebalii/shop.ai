import express from "express";
import OpenAI from "openai";
import { searchCompanyData } from "../utils/companySearch.js";
import { companyData } from "../data/companyData.js";

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

    const relevantContext = searchCompanyData(userMessage);

    const systemPrompt = `
You are a friendly and professional ecommerce assistant for ${companyData.name}.

=============================
CRITICAL RULES (MUST FOLLOW)
=============================
- Use the FILTERED DATA or FULL COMPANY DATA provided below to answer questions.
- If the user asks about payment methods, shipping, returns, or customer support, use the data in FULL COMPANY DATA.
- NEVER guess or invent anything.
- NEVER change product prices.
- NEVER add sizes or colors not listed.
- If data is completely missing from both data fields, reply EXACTLY:
  "Sorry, we don’t have that right now."

=============================
RESPONSE STYLE (VERY IMPORTANT)
=============================
- Sound natural and human-like.
- Keep answers clean, structured, and easy to read.
- Use headings (###) and bullet points (•).
- Avoid long paragraphs.

=============================
FORMAT RULES
=============================

👉 IF type = "list":
We have the following products available in our store:
### Men
• Product Name  
### Women
• Product Name  
### Kids
• Product Name  

👉 IF type = "category":
We offer a variety of products across the following categories:
• Men’s Clothing  
• Women’s Clothing  
• Kids’ Clothing  

👉 IF type = "detail":
### Product Details
• Name: Product Name  
• Price: $XX  
• Sizes: ...  
• Colors: ...  

👉 IF type = "price":
The price of [Product Name] is $XX.

👉 IF asking about store info/payments/shipping (General Query):
Answer the question directly, cleanly, and naturally using bullet points if multiple items exist.

=============================
PRIORITY
=============================
1. First use FILTERED DATA
2. If info isn't there → use FULL COMPANY DATA
3. If still not found → fallback message

-------------------------
FILTERED DATA (JSON):
${relevantContext}

-------------------------
FULL COMPANY DATA:
${JSON.stringify(companyData, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0,
      max_tokens: 800 // 🚀 Bumped up so answers don't get cut off halfway
    });

    res.json({
      output: completion.choices[0].message,
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      output: {
        role: "assistant",
        content: "Something went wrong. Please try again later.",
      },
    });
  }
});

export default router;