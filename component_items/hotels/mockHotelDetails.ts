import type { HotelDetails } from "./HotelCard";

export const mockHotelDetails: HotelDetails[] = [
  {
    id: "1",
    name: { ar: "كمبينسكي النيل جاردن سيتي", en: "Kempinski Nile Garden City" },
    location: { ar: "القاهرة", en: "Cairo" },
    roomType: "hotel",
    stars: 5,
    image: "/image/hotels/kempinski-cover.jpg",
    amenities: ["luggageRoom", "liftAccess", "breakfast", "hotelSafe"],
    pricePerNight: 7957,
    images: [
      "/image/hotal_1.jpg",
      "/image/hotal_2.jpg",
      "/image/hotal_3.jpg",
      "/image/air_3.jpg",
    ],
    facilities: [
      "luggageRoom",
      "liftAccess",
      "checkoutHour",
      "checkinHour",
      "hotelSafe",
      "breakfast",
      "reception24",
      "restaurant",
    ],
    rooms: [
      {
        id: "r1",
        name: {
          ar: "غرفة ديلوكس — إطلالة على المدينة",
          en: "Deluxe Room — City View",
        },
        sizeSqm: 36,
        bedType: { ar: "1× سرير كينج", en: "1× King Bed" },
        maxGuests: 3,
        basePrice: 7957.7,
        breakfastPrice: 9497.9,
        freeCancellation: false,
      },
      {
        id: "r2",
        name: {
          ar: "غرفة السوبيريور — إطلالة على النيل",
          en: "Superior Room — Nile View",
        },
        sizeSqm: 33,
        bedType: { ar: "2× سرير توين", en: "2× Twin Bed" },
        maxGuests: 3,
        basePrice: 8471.1,
        breakfastPrice: 10011.3,
        freeCancellation: false,
      },
    ],
  },
];
