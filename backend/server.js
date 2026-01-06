import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://bakerdandal1234.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1" // إذا كنت تستخدم OpenRouter
});

app.post("/api/generate-examples", async (req, res) => {
  const { german, level } = req.body;

  const prompt = `أعطني 3 جمل ألمانية جديدة بنفس معنى: "${german}" بمستوى ${level} بدون ترجمة`;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // ✅ اسم صحيح لـ OpenRouter
      messages: [{ role: "user", content: prompt }]
    });

    const text = completion.choices[0].message.content;
    const examples = text.split("\n").map(l => l.replace(/^[-•\d.]+/, "").trim()).filter(Boolean);

    res.json({ examples });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ error: "حدث خطأ أثناء توليد الأمثلة" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));