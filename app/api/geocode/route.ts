import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query,
      )}&format=json&limit=1&accept-language=ar`,
      {
        headers: {
          "User-Agent": "Masar-App/1.0 (contact@masar.com)",
        },
      },
    );

    if (!res.ok) {
      console.error("Nominatim error:", res.status, await res.text());
      return NextResponse.json({ result: null });
    }

    const data = await res.json();
    if (data?.[0]) {
      return NextResponse.json({
        result: {
          address: query,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        },
      });
    }

    return NextResponse.json({ result: null });
  } catch (err) {
    console.error("Geocode fetch failed:", err);
    return NextResponse.json({ result: null });
  }
}