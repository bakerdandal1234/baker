// server.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

// ⚡ لا تحتاج لمكتبة node-fetch في Node 18+
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "" // ضع مفتاح OpenAI هنا إذا كان لديك
});
console.log("OpenRouter API Key:", process.env.OPENROUTER_API_KEY);

app.post("/api/generate-examples", async (req, res) => {
  const { german, level } = req.body;

  const prompt = `
أعطني 3 جمل ألمانية جديدة
بنفس معنى:
"${german}"
بمستوى ${level}
بدون ترجمة
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const text = completion.choices[0].message.content;

    const examples = text
      .split("\n")
      .map(l => l.replace(/^[-•\d.]/, "").trim())
      .filter(Boolean);

    res.json({ examples });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ أثناء توليد الأمثلة" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
