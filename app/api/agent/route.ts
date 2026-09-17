import { GoogleGenAI, Type, type FunctionDeclaration } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { SITE_KNOWLEDGE } from "./siteKnowledge";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const LOCALE_NAMES: Record<string, string> = {
  ar: "Arabic",
  en: "English",
  de: "German",
  ru: "Russian",
  uk: "Ukrainian",
  es: "Spanish",
  pl: "Polish",
  // ضيف أي لغة تانية عندك في next-intl config
};

function buildSystemPrompt(locale: string) {
  const fallbackLanguage = LOCALE_NAMES[locale] ?? "Arabic";

  return `أنت المساعد الذكي لموقع "مسار" — منصة حجز عربيات وفنادق في مصر.

**مهم جدًا بخصوص اللغة:**
- رد دايمًا بنفس اللغة اللي المستخدم كتب بيها آخر رسالة، من ضمن اللغات المتاحة في الموقع: العربية، الإنجليزية، الألمانية، الروسية، الأوكرانية، الإسبانية، البولندية.
- لو المستخدم غيّر اللغة في نص المحادثة (مثلاً كتب عربي وبعدين إنجليزي)، اتبع آخر لغة كتب بيها هو، مش أول رسالة.
- استخدم ${fallbackLanguage} كلغة افتراضية بس لو أول رسالة في المحادثة ومفيش نص كافي تحدد بيه اللغة (زي رسالة فاضية أو رموز بس).

${SITE_KNOWLEDGE}

قواعد استخدام أدوات العربيات:
1. متستخدمش fill_trip_search أو book_car إلا لما يكون عندك: نوع الرحلة، fromLocation، toLocation، والتاريخ.

قواعد استخدام أدوات الفنادق (تدفق من 3 خطوات):
1. لما المستخدم يطلب فندق، اجمع منه: الوجهة، تاريخ الوصول والمغادرة، عدد البالغين والأطفال. لو أي حاجة ناقصة اسأل عنها أولاً.
2. لما تجمع البيانات، استخدم recommend_hotels — هترجعلك قائمة فنادق، اعرضها للمستخدم زي ما هي واسأله يختار بالرقم أو الاسم.
3. لما يرد المستخدم برقم أو اسم فندق، استخدم select_hotel(selector) — هترجعلك قائمة غرف، اعرضها واسأله يختار غرفة بالرقم أو الاسم.
4. لما يرد باختيار الغرفة، استخدم select_room(selector) — هتودّيه لصفحة المراجعة تلقائيًا.
5. متخترش فندق أو غرفة نيابة عن المستخدم من غير ما يرد صراحة.

قواعد عامة:
- متقولش "تم الحجز" — الحجز النهائي بإيد المستخدم دايمًا.
- لو سؤال عام، جاوب من المعلومات اللي عندك فوق مباشرة من غير أداة.`;
}

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "fill_trip_search",
    description: "يملأ بيانات البحث عن عربية",
    parameters: {
      type: Type.OBJECT,
      properties: {
        tripType: {
          type: Type.STRING,
          enum: ["arrival", "departure", "private", "dailyRental"],
        },
        fromLocation: { type: Type.STRING },
        toLocation: { type: Type.STRING },
        date: { type: Type.STRING },
        time: { type: Type.STRING },
        passengers: { type: Type.NUMBER },
      },
      required: ["tripType", "fromLocation", "toLocation", "date"],
    },
  },
  {
    name: "book_car",
    description: "يختار عربية ويودّي المستخدم لصفحة المراجعة",
    parameters: {
      type: Type.OBJECT,
      properties: {
        tripType: {
          type: Type.STRING,
          enum: ["arrival", "departure", "private", "dailyRental"],
        },
        fromLocation: { type: Type.STRING },
        toLocation: { type: Type.STRING },
        date: { type: Type.STRING },
        time: { type: Type.STRING },
        passengers: { type: Type.NUMBER },
        preferredCategory: { type: Type.STRING },
        maxBudget: { type: Type.NUMBER },
      },
      required: ["tripType", "fromLocation", "toLocation", "date"],
    },
  },
  {
    name: "navigate_to_page",
    description: "يفتح صفحة معينة في الموقع",
    parameters: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          enum: ["/feature/lemozeen", "/feature/fast-track", "/feature/stays"],
        },
      },
      required: ["path"],
    },
  },
  {
    name: "recommend_hotels",
    description:
      "يبحث عن فنادق مطابقة ويرجّع قائمة مرقّمة للعرض على المستخدم. خطوة 1 من 3.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        destination: { type: Type.STRING },
        checkIn: { type: Type.STRING },
        checkOut: { type: Type.STRING },
        adults: { type: Type.NUMBER },
        children: { type: Type.NUMBER },
        minStars: { type: Type.NUMBER },
        maxBudget: { type: Type.NUMBER },
      },
      required: ["destination", "checkIn", "checkOut"],
    },
  },
  {
    name: "select_hotel",
    description:
      "يستقبل اختيار المستخدم لفندق (برقمه في آخر قائمة اتعرضت أو باسمه)، ويرجّع قائمة الغرف المتاحة فيه. خطوة 2 من 3.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        selector: {
          type: Type.STRING,
          description: "رقم الفندق في القائمة اللي فاتت، أو اسمه",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "select_room",
    description:
      "يستقبل اختيار المستخدم لغرفة (برقمها في آخر قائمة اتعرضت أو باسمها)، ويودّيه لصفحة المراجعة. خطوة 3 من 3.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        selector: {
          type: Type.STRING,
          description: "رقم الغرفة في القائمة اللي فاتت، أو اسمها",
        },
      },
      required: ["selector"],
    },
  },
];

const tools = [{ functionDeclarations }];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(contents: any, systemPrompt: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents,
        config: { systemInstruction: systemPrompt, tools },
      });
    } catch (err: any) {
      const isOverloaded =
        err?.status === 503 || err?.message?.includes("UNAVAILABLE");
      const isQuotaExceeded =
        err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED");

      if (isQuotaExceeded) throw err;
      if (isOverloaded && attempt < retries) {
        await wait(attempt * 1000);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed after retries");
}

const ERROR_MESSAGES: Record<string, { quota: string; overloaded: string; generic: string }> = {
  ar: {
    quota: "خلصت الحصة المجانية اليومية للمساعد، جرب تاني بكرة 🙏",
    overloaded: "الخدمة مزدحمة شوية دلوقتي، جرب تاني بعد لحظات 🙏",
    generic: "حصل خطأ في المساعد، جرب تاني",
  },
  en: {
    quota: "The assistant's daily free quota is used up, please try again tomorrow 🙏",
    overloaded: "The service is a bit busy right now, please try again in a moment 🙏",
    generic: "Something went wrong with the assistant, please try again",
  },
  de: {
    quota: "Das tägliche Freikontingent des Assistenten ist aufgebraucht, bitte versuch es morgen noch mal 🙏",
    overloaded: "Der Dienst ist gerade etwas ausgelastet, bitte versuch es gleich noch mal 🙏",
    generic: "Beim Assistenten ist ein Fehler aufgetreten, bitte versuch es noch mal",
  },
  ru: {
    quota: "Дневная бесплатная квота ассистента исчерпана, попробуйте завтра 🙏",
    overloaded: "Сервис сейчас немного перегружен, попробуйте через минуту 🙏",
    generic: "Произошла ошибка ассистента, попробуйте ещё раз",
  },
  uk: {
    quota: "Денну безкоштовну квоту асистента вичерпано, спробуйте завтра 🙏",
    overloaded: "Сервіс зараз трохи перевантажений, спробуйте за хвилину 🙏",
    generic: "Сталася помилка асистента, спробуйте ще раз",
  },
  es: {
    quota: "Se agotó la cuota gratuita diaria del asistente, inténtalo mañana 🙏",
    overloaded: "El servicio está algo saturado ahora mismo, inténtalo en un momento 🙏",
    generic: "Ocurrió un error con el asistente, inténtalo de nuevo",
  },
  pl: {
    quota: "Dzienny darmowy limit asystenta został wyczerpany, spróbuj ponownie jutro 🙏",
    overloaded: "Usługa jest teraz trochę przeciążona, spróbuj za chwilę 🙏",
    generic: "Wystąpił błąd asystenta, spróbuj ponownie",
  },
};

export async function POST(req: NextRequest) {
  let locale = "ar";
  try {
    const body = await req.json();
    locale = body.locale ?? "ar";
    const { messages } = body;

    const systemPrompt = buildSystemPrompt(locale);

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await generateWithRetry(contents, systemPrompt);

    return NextResponse.json({
      text: response.text ?? "",
      functionCalls: response.functionCalls ?? [],
    });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    const isOverloaded =
      err?.status === 503 || err?.message?.includes("UNAVAILABLE");
    const isQuotaExceeded =
      err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED");

    const messages = ERROR_MESSAGES[locale] ?? ERROR_MESSAGES.ar;

    return NextResponse.json(
      {
        text: isQuotaExceeded
          ? messages.quota
          : isOverloaded
            ? messages.overloaded
            : messages.generic,
        functionCalls: [],
      },
      { status: 200 },
    );
  }
}