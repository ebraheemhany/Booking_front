export const airportKeys = ["hbe", "cai", "hrg", "aac", "mum", "ssh"] as const;
export type AirportKey = (typeof airportKeys)[number];

export const airportCoordinates: Record<
  AirportKey,
  { lat: number; lng: number }
> = {
  hbe: { lat: 31.0733, lng: 29.9497 }, // برج العرب
  cai: { lat: 30.1219, lng: 31.4056 }, // القاهرة
  hrg: { lat: 27.1783, lng: 33.7994 }, // الغردقة
  aac: { lat: 22.99, lng: 32.8328 }, // العلمين
  mum: { lat: 31.33, lng: 27.2178 }, // مرسى مطروح
  ssh: { lat: 27.9773, lng: 34.395 }, // شرم الشيخ
};
