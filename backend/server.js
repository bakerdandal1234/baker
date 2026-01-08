// server.js - الإصدار الصحيح الكامل
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";  

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ إصلاح 1: المتغيرات البيئية الصحيحة
const API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const API_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://api.openai.com/v1";

console.log("API Setup:");
console.log("- Base URL:", API_BASE_URL);
console.log("- API Key (masked):", API_KEY ? `${API_KEY.substring(0, 8)}...` : "NOT SET");

// ✅ إصلاح 2: تهيئة OpenAI بشكل صحيح
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: API_BASE_URL,
});

app.get("/", (req, res) => {
  res.json({ 
    status: "operational",
    message: "✅ German Examples API is running",
    info: {
      endpoint: "/api/generate-examples",
      method: "POST",
      required_fields: ["german", "arabic", "level"]
    }
  });
});

// ✅ إصلاح 3: نقطة النهاية الصحيحة
app.post("/api/generate-examples", async (req, res) => {
  try {
    const { german, arabic, level } = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!german || !level) {
      return res.status(400).json({ 
        error: "بيانات غير كافية",
        required: ["german", "level"],
        provided: Object.keys(req.body)
      });
    }

    console.log(`📝 طلب جديد: "${german}" (${level})`);
    
    // ✅ إصلاح 4: Prompt مبسط وفعال
    const prompt = `
أنت خبير في تعليم اللغة الألمانية. أنشئ 3 أمثلة متدرجة لهذه الجملة:

الجملة الأصلية: "${german}"
المستوى الحالي: ${level}

التعليمات:
1. أنشئ 3 جمل بنفس المفهوم ولكن بمستويات تعليمية مختلفة:
   - إذا كانت A1: أنشئ أمثلة لـ A2، B1، B2
   - إذا كانت A2: أنشئ أمثلة لـ A1، B1، B2
   - إذا كانت B1: أنشئ أمثلة لـ A1، A2، B2
   - إذا كانت B2: أنشئ أمثلة لـ A1، A2، B1

2. لكل جملة، قدم بالضبط بهذا التنسيق:
   GERMAN: [الجملة] | ARABIC: [الترجمة] | LEVEL: [المستوى] | NOTE: [سبب المستوى]

3. استخدم هذه المواصفات:
   A1: جمل قصيرة جداً، كلمات أساسية، زمن المضارع فقط
   A2: جمل قصيرة، كلمات يومية، أزمنة أساسية
   B1: جمل مركبة، كلمات متنوعة، أزمنة متعددة
   B2: جمل معقدة، كلمات متخصصة، تعابير اصطلاحية

4. حافظ على السياق والمغزى الأساسي للجملة الأصلية
5. ركز على التعبيرات العملية التي يستخدمها المتحدثون الأصليون
6. تجنب الأخطاء النحوية والإملائية
    `;

    // ✅ إصلاح 5: استخدام نموذج صحيح
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "أنت مدرس لغة ألمانية محترف." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // ✅ إصلاح 6: معالجة الناتج
    const responseText = completion.choices[0].message.content;
    console.log("🤖 رد النموذج (مقتطف):", responseText.substring(0, 200) + "...");

    // استخراج الأمثلة
    const examples = [];
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      const l = line.trim();
      if (l && l.includes('GERMAN:') && l.includes('ARABIC:') && l.includes('LEVEL:')) {
        examples.push(l);
      }
    }

    // ✅ إصلاح 7: أمثلة احتياطية إذا فشل النموذج
    if (examples.length < 3) {
      console.warn(`⚠️ وجدت ${examples.length} أمثلة فقط. استخدام الأمثلة الاحتياطية.`);
      return res.json({ 
        examples: generateFallbackExamples(german, arabic, level),
        warning: "تم استخدام أمثلة احتياطية"
      });
    }

    console.log(`✅ تم توليد ${examples.length} أمثلة بنجاح`);
    res.json({ examples });

  } catch (error) {
    console.error("❌ خطأ في الخادم:", error.message);
    console.error("التفاصيل:", error);
    
    // ✅ إصلاح 8: معالجة الأخطاء بشكل ودّي
    if (error.message.includes('authentication')) {
      return res.status(401).json({ 
        error: "مشكلة في مصادقة API",
        details: "يرجى التحقق من مفتاح API"
      });
    }
    
    // أمثلة احتياطية عند حدوث أي خطأ
    const { german, arabic, level } = req.body;
    res.status(500).json({ 
      examples: generateFallbackExamples(german, arabic, level),
      error: "تم استخدام أمثلة احتياطية بسبب خطأ في الخدمة",
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ دالة الأمثلة الاحتياطية (مهمة للتشغيل)
function generateFallbackExamples(german, arabic, level) {
  const examples = [];
  const targetLevels = [];
  
  // تحديد المستويات المستهدفة
  if (level === 'A1') targetLevels.push('A2', 'B1', 'B2');
  else if (level === 'A2') targetLevels.push('A1', 'B1', 'B2');
  else if (level === 'B1') targetLevels.push('A1', 'A2', 'B2');
  else if (level === 'B2') targetLevels.push('A1', 'A2', 'B1');
  else targetLevels.push('A1', 'A2', 'B1');
  
  // إنشاء أمثلة احتياطية
  targetLevels.forEach((lvl, i) => {
    let exampleGerman, exampleArabic, note;
    
    switch(lvl) {
      case 'A1':
        exampleGerman = german.replace('?', '!').replace('.', '!');
        exampleArabic = arabic.replace('؟', '!').replace('.', '!');
        note = "ترجمة بسيطة جداً";
        break;
      case 'A2':
        exampleGerman = german.includes('?') ? 
          german.replace('?', ', bitte?') : 
          german + ', bitte.';
        exampleArabic = arabic.includes('؟') ? 
          arabic.replace('؟', '، من فضلك؟') : 
          arabic + '، من فضلك.';
        note = "إضافة كلمات مهذبة";
        break;
      case 'B1':
        exampleGerman = `Ich möchte wissen, ${german.toLowerCase().replace('?', '').replace('.', '').replace('!', '')}?`;
        exampleArabic = `أود أن أعرف ${arabic.replace('؟', '').replace('.', '').replace('!', '')}؟`;
        note = "هيكل جملة مركب";
        break;
      case 'B2':
      default:
        exampleGerman = `Es wäre hilfreich zu wissen, ${german.toLowerCase().replace('?', '').replace('.', '').replace('!', '')}.`;
        exampleArabic = `سيكون من المفيد أن أعرف ${arabic.replace('؟', '').replace('.', '').replace('!', '')}.`;
        note = "هيكل لغوي متقدم";
    }
    
    examples.push(
      `GERMAN: ${exampleGerman} | ARABIC: ${exampleArabic} | LEVEL: ${lvl} | NOTE: ${note}`
    );
  });
  
  return examples;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
  console.log(`🔗 اذهب إلى: http://localhost:${PORT}`);
  console.log(`🧪 اختبر نقطة النهاية: POST /api/generate-examples`);
});
