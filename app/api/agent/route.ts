import { GoogleGenAI, Type, type FunctionDeclaration } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `أنت المساعد الذكي لموقع "مسار" — منصة حجز عربيات وفنادق في مصر.

معلومات عن الموقع:
- المستخدم يقدر يحجز عربية ليموزين (من/إلى المطار، مشوار خاص، إيجار يومي) من صفحة lemozeen
- فاست تراك: خدمة مطارات سريعة، من/إلى المطار بس
- حجز فنادق وإقامات من صفحة stays
- الأسعار بالجنيه المصري

مهمتك:
1. لو المستخدم عايز يحجز حاجة، استخدم الأدوات المتاحة لتنفيذ الطلب فعليًا
2. لو عنده سؤال عام، جاوبه مباشرة من غير أداة
3. اتكلم بالعربي المصري العامي البسيط، ودود ومختصر`;

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "fill_trip_search",
    description:
      "يملأ بيانات البحث عن عربية (نوع الرحلة، المطار، التاريخ، الوقت، عدد الركاب)",
    parameters: {
      type: Type.OBJECT,
      properties: {
        tripType: {
          type: Type.STRING,
          enum: ["arrival", "departure", "private", "dailyRental"],
        },
        airport: { type: Type.STRING },
        date: { type: Type.STRING, description: "بصيغة YYYY-MM-DD" },
        time: { type: Type.STRING },
        passengers: { type: Type.NUMBER },
      },
      required: ["tripType"],
    },
  },
  {
    name: "search_hotels",
    description: "يبحث عن فنادق حسب الوجهة والتواريخ وعدد الضيوف",
    parameters: {
      type: Type.OBJECT,
      properties: {
        destination: { type: Type.STRING },
        checkIn: { type: Type.STRING },
        checkOut: { type: Type.STRING },
        adults: { type: Type.NUMBER },
        children: { type: Type.NUMBER },
      },
      required: ["destination"],
    },
  },
  {
    name: "navigate_to_page",
    description: "يفتح صفحة معينة في الموقع للمستخدم",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          enum: ["/feature/lemozeen", "/feature/fasttrack", "/feature/stays"],
        },
      },
      required: ["path"],
    },
  },
];

const tools = [{ functionDeclarations }];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(contents: any, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools,
        },
      });
    } catch (err: any) {
      const isOverloaded =
        err?.status === 503 || err?.message?.includes("UNAVAILABLE");

      if (isOverloaded && attempt < retries) {
        console.warn(`Model overloaded, retrying (${attempt}/${retries})...`);
        await wait(attempt * 1000);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed after retries");
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await generateWithRetry(contents);

    return NextResponse.json({
      text: response.text ?? "",
      functionCalls: response.functionCalls ?? [],
    });
  } catch (err: any) {
    console.error("Gemini API error:", err);

    const isOverloaded =
      err?.status === 503 || err?.message?.includes("UNAVAILABLE");

    return NextResponse.json(
      {
        text: isOverloaded
          ? "الخدمة مزدحمة شوية دلوقتي، جرب تاني بعد لحظات 🙏"
          : "حصل خطأ في المساعد، جرب تاني",
        functionCalls: [],
      },
      { status: 200 },
    );
  }
}
