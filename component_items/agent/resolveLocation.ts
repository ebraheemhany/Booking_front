import { airportCoordinates } from "@/component_items/airportData";
import type { LocationValue } from "@/component_items/search/LocationPicker";

const airportNameKeywords: Record<string, keyof typeof airportCoordinates> = {
  القاهرة: "cai",
  "برج العرب": "hbe",
  الغردقة: "hrg",
  العلمين: "aac",
  "مرسى مطروح": "mum",
  "شرم الشيخ": "ssh",
  cairo: "cai",
  hurghada: "hrg",
  sharm: "ssh",
};

export async function resolveLocation(
  text?: string,
): Promise<LocationValue | null> {
  if (!text) return null;

  const lower = text.toLowerCase();
  for (const [keyword, code] of Object.entries(airportNameKeywords)) {
    if (lower.includes(keyword.toLowerCase())) {
      const coords = airportCoordinates[code];
      return { address: text, lat: coords.lat, lng: coords.lng };
    }
  }

  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data.result ?? null;
  } catch (err) {
    console.error("resolveLocation failed:", err);
    return null;
  }
}