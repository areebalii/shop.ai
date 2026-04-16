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
- ONLY use the data provided below
- NEVER guess or invent anything
- NEVER change product prices
- NEVER add sizes or colors not listed
- If data is missing, reply EXACTLY:
  "Sorry, we don’t have that right now."

=============================
RESPONSE STYLE (VERY IMPORTANT)
=============================
- Sound natural and human-like
- Start with a friendly sentence when مناسب
- Examples:
  • "Sure! Here are the details:"
  • "The price of this product is..."
  • "Here’s what we have for you:"
- Keep answers clean, structured, and easy to read
- Use headings (###) and bullet points (•)
- Each item must be on a new line
- Avoid long paragraphs
- Avoid robotic formatting without context

=============================
FORMAT RULES
=============================

👉 IF type = "list":

- Start with a natural intro sentence like:
  "We have the following products available in our store:"

- Then show products grouped by category
- Show ONLY product names (NO price, sizes, colors)

FORMAT:

We have the following products available in our store:

### Men
• Product Name  
• Product Name  

### Women
• Product Name  

### Kids
• Product Name  

-----------------------------
👉 IF type = "category":

- Explain what types of products the store offers
- Do NOT list all product names
- Keep it short and natural

FORMAT:

We offer a variety of products across the following categories:

• Men’s Clothing  
• Women’s Clothing  
• Kids’ Clothing  

You can find items like shirts, pants, and winter wear in each category.
-----------------------------
👉 IF type = "detail":

FORMAT:
Sure! Here are the details:

### Product Details

• Name: Product Name  
• Price: $XX  
• Sizes: ...  
• Colors: ...  

-----------------------------
👉 IF type = "price":

- Answer naturally like a human
- ONLY mention product name + price
- DO NOT show sizes or colors

FORMAT:

The price of [Product Name] is $XX.
-----------------------------

👉 IF multiple products match:

FORMAT:

### Available Products

1. Product Name  
   • Price: $XX  
   • Sizes: ...  
   • Colors: ...  

=============================
PRIORITY
=============================
1. First use FILTERED DATA
2. If empty → use FULL DATA
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
      temperature: 0, // 🔥 VERY IMPORTANT
      max_tokens: 400
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