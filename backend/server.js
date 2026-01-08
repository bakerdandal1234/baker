// server.js - إصدار مضمون العمل 100%
import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(cors());

console.log("🚀 بدء تشغيل الخادم...");

// إعدادات OpenRouter الصحيحة
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = "anthropic/claude-3-haiku"; // نموذج مجاني وسريع

console.log("🔑 حالة مفتاح API:", OPENROUTER_API_KEY ? "موجود" : "غير موجود");
console.log("🧠 النموذج المستخدم:", OPENROUTER_MODEL);

// إنشاء عميل OpenAI/ OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY || "EMPTY_KEY",
  defaultHeaders: {
    "HTTP-Referer": "https://your-app-name.onrender.com", // استبدل باسم تطبيقك
    "X-Title": "German Examples Generator"
  }
});

// نقطة نهاية للتحقق من حالة الخادم
app.get("/", (req, res) => {
  res.json({ 
    status: "✅ operational",
    service: "German Examples API",
    model: OPENROUTER_MODEL,
    time: new Date().toISOString()
  });
});

// نقطة نهاية مبسطة لتوليد الأمثلة
app.post("/api/generate-examples", async (req, res) => {
  console.log("📥 وصل طلب جديد:", req.body);
  
  try {
    const { german, arabic = "", level = "A1" } = req.body;
    
    if (!german) {
      return res.status(400).json({ error: "الجملة الألمانية مطلوبة" });
    }

    // ✅ نص بسيط ومباشر يعمل مع جميع النماذج
    const prompt = `Generate 3 simple German sentences at different levels based on: "${german}". Format each as: GERMAN: sentence | ARABIC: translation | LEVEL: level | NOTE: brief reason. Keep it practical and accurate.`;
    
    console.log("🧠 جاري إرسال النص إلى النموذج...");
    
    // ✅ استخدام نموذج مضمون العمل
    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const responseText = completion.choices[0].message.content;
    console.log("✅ تم الاستلام من النموذج:", responseText.substring(0, 150) + "...");

    // ✅ استخراج الأمثلة بطريقة مرنة
    const examples = [];
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && (trimmed.includes('GERMAN:') || trimmed.includes('ARABIC:'))) {
        examples.push(trimmed.replace(/^[-•\d.\s]+/, ''));
      }
    }

    // ✅ إذا لم يتم العثور على أمثلة كافية، استخدام أمثلة احتياطية
    if (examples.length < 2) {
      console.warn("⚠️ استجابة غير كافية. استخدام الأمثلة الاحتياطية.");
      return res.json({ 
        examples: generateFallbackExamples(german, arabic, level),
        warning: "تم استخدام أمثلة احتياطية"
      });
    }

    console.log(`🎉 نجاح! تم توليد ${examples.length} أمثلة`);
    res.json({ examples, original: { german, arabic, level } });

  } catch (error) {
    console.error("❌ خطأ خطير:", error.message);
    console.error("التفاصيل:", error.response?.data || error);
    
    // ✅ عرض خطأ مفصل في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({ 
        error: error.message,
        details: error.response?.data || "خطأ غير معروف"
      });
    }
    
    // ✅ أمثلة احتياطية للإنتاج
    const { german = "Beispiel", arabic = "مثال", level = "A1" } = req.body || {};
    res.json({ 
      examples: generateFallbackExamples(german, arabic, level),
      error: "تم استخدام أمثلة احتياطية"
    });
  }
});

// ✅ دالة أمثلة احتياطية مضمونة العمل
function generateFallbackExamples(german, arabic, level) {
  return [
    `GERMAN: ${german.replace('?', ', bitte?')} | ARABIC: ${arabic.replace('؟', '، من فضلك؟')} | LEVEL: A2 | NOTE: إضافة كلمات مهذبة`,
    `GERMAN: Ich möchte wissen, ${german.toLowerCase().replace('?', '').replace('.', '')}? | ARABIC: أود أن أعرف ${arabic.replace('؟', '').replace('.', '')}؟ | LEVEL: B1 | NOTE: هيكل جملة مركب`,
    `GERMAN: Es wäre hilfreich zu wissen, ${german.toLowerCase().replace('?', '').replace('.', '')}. | ARABIC: سيكون من المفيد لو أعرف ${arabic.replace('؟', '').replace('.', '')}. | LEVEL: B2 | NOTE: لغة رسمية متقدمة`
  ];
}

// ✅ تشغيل الخادم على المنفذ الصحيح لـ Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل الآن على http://localhost:${PORT}`);
  console.log(`🔍 اختبر هنا: http://localhost:${PORT}`);
  console.log(`🧪 أو: curl -X POST http://localhost:${PORT}/api/generate-examples -H "Content-Type: application/json" -d '{"german": "Wo ist die Milch?", "level": "A1"}'`);
});
