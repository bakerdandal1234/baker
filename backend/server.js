// server.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";  
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ إصلاح 1: التأكد من تحميل المتغيرات البيئية
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://api.openai.com/v1";

console.log("Using API Key (masked):", OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 5)}...` : "No API key found");
console.log("API Base URL:", OPENROUTER_BASE_URL);

// ✅ إصلاح 2: إنشاء عميل OpenAI بشكل صحيح
const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
  dangerouslyAllowBrowser: true
});

app.get("/", (req, res) => {
  res.json({ 
    message: "👋 Hello from the German examples API!",
    status: "operational",
    endpoints: {
      generateExamples: "POST /api/generate-examples"
    }
  });
});

// ✅ إصلاح 3: معالجة POST request بشكل صحيح
app.post("/api/generate-examples", async (req, res) => {
  try {
    // ✅ التحقق من وجود البيانات المطلوبة
    const { german, arabic, level } = req.body;
    
    if (!german || !level) {
      return res.status(400).json({ 
        error: "بيانات ناقصة",
        details: "يرجى تضمين الحقول: german, arabic, level"
      });
    }
    
    console.log(`جاري توليد أمثلة للجملة: "${german}" (المستوى: ${level})`);
    
    // ✅ إصلاح 4: prompt مبسط ومنظم
    const prompt = `
أنت مدرس لغة ألمانية محترف. ولد 3 أمثلة متدرجة لهذه الجملة الألمانية:

**الجملة الأصلية:** "${german}"
**الترجمة العربية:** "${arabic || 'غير متوفرة'}"
**المستوى الحالي:** ${level}

**التعليمات:**
1. ولد 3 جمل جديدة بنفس المفهوم ولكن بمستويات مختلفة وفقاً للقاعدة التالية:
   - إذا كانت الجملة A1: أنشئ أمثلة لـ A2، B1، B2
   - إذا كانت الجملة A2: أنشئ أمثلة لـ A1، B1، B2
   - إذا كانت الجملة B1: أنشئ أمثلة لـ A1، A2، B2
   - إذا كانت الجملة B2: أنشئ أمثلة لـ A1، A2، B1

2. لكل جملة متولدة، قدم بالضبط بالتنسيق التالي:
   GERMAN: [الجملة الألمانية] | ARABIC: [الترجمة العربية] | LEVEL: [المستوى] | NOTE: [سبب المستوى]

3. اتبع مواصفات المستويات بدقة:
   - A1: جمل قصيرة جداً، كلمات أساسية، تركيب بسيط، زمن المضارع فقط
   - A2: جمل قصيرة، كلمات يومية، أزمنة أساسية (مضارع، ماضي بسيط)
   - B1: جمل مركبة، كلمات متنوعة، أزمنة متعددة، تعابير اصطلاحية أساسية
   - B2: جمل معقدة، كلمات متخصصة، أزمنة وأوضاع نحوية متقدمة

**مثال:**
للجملة الأصلية "Wo ist die Milch?" (المستوى A1):
GERMAN: Wo kann ich Milch kaufen? | ARABIC: أين يمكنني شراء الحليب؟ | LEVEL: A2 | NOTE: استخدام فعل "können" ويضاف سياق الشراء
GERMAN: Könnten Sie mir bitte sagen, wo sich die Milchabteilung befindet? | ARABIC: هل يمكنكم إخباري أين يقع قسم الألبان؟ | LEVEL: B1 | NOTE: استخدام صيغة مهذبة مع هيكل جملة معقد
GERMAN: Ich würde es sehr schätzen, wenn Sie mich darüber informieren könnten, in welchem Bereich des Geschäfts die verschiedenen Milchsorten, einschließlich laktosefreier Optionen, verfügbar sind. | ARABIC: سأكون ممتناً لو أمكنكم إعلامي في أي قسم من المحل تتوفر أنواع الحليب المختلفة، بما في ذلك الخيارات الخالية من اللاكتوز. | LEVEL: B2 | NOTE: لغة رسمية معقدة مع جمل فرعية متعددة

**الآن، ولد الأمثلة لهذه الجملة: "${german}" (المستوى ${level})
**`;

    // ✅ إصلاح 5: استخدام نموذج صحيح وتكوين مناسب
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // النموذج الصحيح
      messages: [
        {
          role: "system", 
          content: "أنت مدرس لغة ألمانية ممتاز. قدم إجابات دقيقة ومفيدة."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "text" }
    });

    // ✅ إصلاح 6: معالجة الناتج بشكل صحيح
    const responseText = completion.choices[0].message.content;
    console.log("الرد من النموذج:", responseText.substring(0, 200) + "...");

    // ✅ استخراج الأمثلة من النص
    const examples = [];
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && trimmedLine.includes('GERMAN:') && trimmedLine.includes('ARABIC:')) {
        // تقسيم السطر إلى أجزاء
        const parts = {
          german: '',
          arabic: '',
          level: '',
          note: ''
        };
        
        // استخراج كل جزء
        const germanMatch = trimmedLine.match(/GERMAN:\s*([^|]+)/i);
        const arabicMatch = trimmedLine.match(/ARABIC:\s*([^|]+)/i);
        const levelMatch = trimmedLine.match(/LEVEL:\s*([^|]+)/i);
        const noteMatch = trimmedLine.match(/NOTE:\s*(.+)/i);
        
        if (germanMatch && arabicMatch && levelMatch && noteMatch) {
          parts.german = germanMatch[1].trim();
          parts.arabic = arabicMatch[1].trim();
          parts.level = levelMatch[1].trim();
          parts.note = noteMatch[1].trim();
          
          examples.push(
            `GERMAN: ${parts.german} | ARABIC: ${parts.arabic} | LEVEL: ${parts.level} | NOTE: ${parts.note}`
          );
        }
      }
    }

    // ✅ التحقق من وجود أمثلة
    if (examples.length === 0) {
      console.warn("لم يتم العثور على أمثلة صالحة في رد النموذج");
      
      // ✅ إنشاء أمثلة احتياطية
      const fallbackExamples = generateFallbackExamples(german, arabic, level);
      return res.json({ 
        examples: fallbackExamples,
        warning: "تم استخدام أمثلة احتياطية لأن النموذج لم يولد أمثلة صالحة"
      });
    }

    console.log(`تم توليد ${examples.length} أمثلة بنجاح`);
    res.json({ examples, original: { german, arabic, level } });

  } catch (err) {
    console.error("❌ خطأ في توليد الأمثلة:", err);
    
    // ✅ تفاصيل الخطأ للمطورين (للتصحيح فقط)
    const errorDetails = {
      message: err.message || "حدث خطأ غير معروف",
      code: err.code,
      status: err.status,
      body: err.body
    };
    
    console.error("تفاصيل الخطأ:", JSON.stringify(errorDetails, null, 2));
    
    // ✅ رسالة خطأ مفيدة للمستخدم
    res.status(500).json({ 
      error: "فشل في توليد الأمثلة",
      details: "يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم",
      debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }
});

// ✅ إصلاح 7: دالة أمثلة احتياطية عند فشل النموذج
function generateFallbackExamples(german, arabic, level) {
  const examples = [];
  
  // تحديد المستويات المستهدفة
  const targetLevels = [];
  if (level === 'A1') targetLevels.push('A2', 'B1', 'B2');
  else if (level === 'A2') targetLevels.push('A1', 'B1', 'B2');
  else if (level === 'B1') targetLevels.push('A1', 'A2', 'B2');
  else if (level === 'B2') targetLevels.push('A1', 'A2', 'B1');
  
  // إنشاء أمثلة احتياطية
  targetLevels.forEach((targetLevel, index) => {
    let exampleGerman, exampleArabic, note;
    
    switch(targetLevel) {
      case 'A1':
        exampleGerman = german.replace('?', '!').replace('.', '!');
        exampleArabic = arabic.replace('؟', '!').replace('.', '!');
        note = "جملة بسيطة مع تركيب أساسي";
        break;
      case 'A2':
        exampleGerman = german.includes('?') ? 
          german.replace('?', ', bitte?') : 
          german + ', bitte.';
        exampleArabic = arabic.includes('؟') ? 
          arabic.replace('؟', '، من فضلك؟') : 
          arabic + '، من فضلك.';
        note = "إضافة كلمات مهذبة مع هيكل بسيط";
        break;
      case 'B1':
        exampleGerman = `Ich möchte wissen, ${german.toLowerCase().replace('?', '').replace('.', '').replace('!', '')}?`;
        exampleArabic = `أود أن أعرف ${arabic.replace('؟', '').replace('.', '').replace('!', '')}؟`;
        note = "هيكل جملة مركب مع استخدام أدوات الربط";
        break;
      case 'B2':
        exampleGerman = `Es wäre äußerst hilfreich, wenn ich Informationen darüber erhalten könnte, ${german.toLowerCase().replace('?', '').replace('.', '').replace('!', '')}.`;
        exampleArabic = `سيكون من المفيد للغاية لو استطعت الحصول على معلومات حول ${arabic.replace('؟', '').replace('.', '').replace('!', '')}.`;
        note = "جملة رسمية معقدة مع هيكل لغوي متقدم";
        break;
      default:
        exampleGerman = german;
        exampleArabic = arabic;
        note = "مثال افتراضي";
    }
    
    examples.push(
      `GERMAN: ${exampleGerman} | ARABIC: ${exampleArabic} | LEVEL: ${targetLevel} | NOTE: ${note}`
    );
  });
  
  return examples;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
  console.log(`✅ نقطة نهاية API: http://localhost:${PORT}/api/generate-examples`);
});
