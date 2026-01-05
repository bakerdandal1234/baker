import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

app.post("/api/generate-examples", async (req, res) => {
  const { german, level } = req.body;

  const prompt = `
أعطني 3 جمل ألمانية جديدة
بنفس معنى:
"${german}"
بمستوى ${level}
بدون ترجمة
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const text = completion.choices[0].message.content;

  const examples = text
    .split("\n")
    .map(l => l.replace(/^[-•\d.]/, '').trim())
    .filter(Boolean);

  res.json({ examples });
});

app.listen(3000);
