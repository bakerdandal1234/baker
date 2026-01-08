import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";  
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "👋 Hello from the German examples API!" });
});

// ⚡ لا تحتاج لمكتبة node-fetch في Node 18+
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "" // ضع مفتاح OpenAI هنا إذا كان لديك
});
console.log("OpenRouter API Key:", process.env.OPENROUTER_API_KEY);

app.post("/api/generate-examples", async (req, res) => {
  const { german, level } = req.body;

  const prompt = `
أنت مدرس لغة ألمانية محترف. مهمتك هي توليد أمثلة متدرجة لجمل ألمانية بناءً على مستواها التعليمي وفقاً لنظام CEFR. 

## التعليمات:
1. سأرسل لك جملة ألمانية بمستوى محدد (A1، A2، B1، أو B2) مع ترجمتها العربية.
2. قم بتوليد 3 جمل جديدة بنفس المفهوم ولكن بمستويات مختلفة وفقاً للقاعدة التالية:
   - إذا كانت الجملة A1: أنشئ أمثلة لـ A2، B1، B2
   - إذا كانت الجملة A2: أنشئ أمثلة لـ A1، B1، B2
   - إذا كانت الجملة B1: أنشئ أمثلة لـ A1، A2، B2
   - إذا كانت الجملة B2: أنشئ أمثلة لـ A1، A2، B1

3. لكل جملة متولدة، قدم:
   - الجملة الألمانية
   - الترجمة العربية الواضحة
   - وصف مختصر لمستوى التعقيد (لماذا تعتبر من هذا المستوى)

## مواصفات المستويات:
- **A1 (مبتدئ)**: جمل قصيرة جداً، كلمات أساسية، تركيب بسيط جداً، زمن المضارع فقط
- **A2 (ابتدائي)**: جمل قصيرة، كلمات يومية، أزمنة أساسية (مضارع، ماضي بسيط)، عبارات مألوفة
- **B1 (متوسط)**: جمل مركبة، كلمات متنوعة، أزمنة متعددة، تعابير اصطلاحية أساسية
- **B2 (متوسط متقدم)**: جمل معقدة، كلمات متخصصة، أزمنة وأوضاع نحوية متقدمة، تعابير اصطلاحية ولغة مجازية

## تنسيق الخرج المطلوب (JSON):
{
  "original_sentence": {
    "german": "الجملة الألمانية الأصلية",
    "arabic": "الترجمة العربية الأصلية",
    "level": "المستوى الأصلي"
  },
  "generated_examples": [
    {
      "german": "جملة ألمانية للمستوى الجديد",
      "arabic": "ترجمة عربية دقيقة",
      "level": "المستوى الجديد",
      "complexity_note": "ملاحظة مختصرة عن سبب هذا المستوى (بالعربية)"
    },
    // ... مثالان آخران
  ]
}

## مثال توضيحي (لا تكرره في الخرج، فقط للتوجيه):
إذا أرسلت لك: 
{
  "german": "Wo ist die Milch?",
  "arabic": "أين الحليب؟", 
  "level": "A1"
}

ستولد أمثلة لـ A2 و B1 و B2 بنفس السياق (البحث عن الحليب في متجر).

## ملاحظات هامة:
- حافظ على السياق والمغزى الأساسي للجملة الأصلية
- تأكد من دقة الترجمة العربية وملاءمتها للمستوى
- لا تستخدم مصطلحات أو هياكل لغوية فوق مستوى الجملة المستهدفة
- ركز على التعبيرات العملية التي يستخدمها المتحدثون الأصليون
- تجنب الأخطاء النحوية والإملائية في اللغة الألمانية

الآن، سأرسل لك الجملة الأصلية لتبدأ العمل.
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
