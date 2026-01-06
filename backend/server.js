import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
  res.json({ 
    status: "✅ Server running with FREE Google Gemini!",
    model: "Gemini 1.5 Flash"
  });
});

app.post("/api/generate-examples", async (req, res) => {
  const { german, level } = req.body;

  console.log("📥 Request:", { german, level });

  if (!german || !level) {
    return res.status(400).json({ 
      error: "الرجاء إرسال الجملة الألمانية والمستوى" 
    });
  }

  // 🔹 هنا التغيير الأساسي: طلب الترجمة العربية لكل جملة
  const prompt = `أنت معلم لغة ألمانية. أعطني 3 جمل ألمانية جديدة بنفس معنى: "${german}" بمستوى ${level}.

القواعد:
- 3 جمل فقط
- لكل جملة، ضع الجملة الألمانية أولًا ثم ترجمتها العربية مباشرة
- استخدم جمل قصيرة وواضحة
- أرجع النتائج كـ JSON مع مفاتيح "german" و "arabic"`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log("✅ Gemini Response:", text);

    // استخراج الجمل مع الترجمة
    const examples = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split("–"); // 🔹 فصل الجملة الألمانية عن الترجمة العربية
        if (parts.length < 2) return null;
        return {
          german: parts[0].trim(),
          arabic: parts[1].trim()
        };
      })
      .filter(Boolean)
      .slice(0, 3);

    if (examples.length === 0) {
      return res.status(500).json({ 
        error: "لم يتم إنشاء أمثلة. حاول مرة أخرى." 
      });
    }

    console.log("📤 Sending:", examples);
    res.json({ examples });

  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ 
      error: "حدث خطأ أثناء توليد الأمثلة",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🆓 Using FREE Google Gemini API`);
});
