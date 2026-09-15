import { NextResponse } from "next/server";

// كل الأسعار بالنسبة للجنيه المصري (EGP) كعملة أساسية
// لأن كل الأسعار في مشروعك مخزنة بالجنيه المصري أصلاً
export async function GET() {
  try {
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/EGP",
      { next: { revalidate: 3600 } }, // تحديث كل ساعة
    );
    const data = await res.json();

    return NextResponse.json({
      base: "EGP",
      rates: {
        EGP: 1,
        USD: data.rates?.USD ?? 0.021,
        SAR: data.rates?.SAR ?? 0.078,
        EUR: data.rates?.EUR ?? 0.019,
      },
    });
  } catch {
    // fallback بأسعار تقريبية لو الـ API فشل
    return NextResponse.json({
      base: "EGP",
      rates: { EGP: 1, USD: 0.021, SAR: 0.078, EUR: 0.019 },
    });
  }
}
