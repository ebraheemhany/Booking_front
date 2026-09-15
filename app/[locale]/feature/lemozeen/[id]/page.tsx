"use client";

import { useParams } from "next/navigation";
import { CarDetailsView } from "@/component_items/cars/CarDetailsView";

// بيانات تجريبية — لحد ما نربطها بالباك إند
const mockCarsById: Record<
  string,
  {
    specs: any;
    pricing: any;
    images: string[];
    description: string;
    bookingsCount: number;
  }
> = {
  "1": {
    specs: {
      id: "1",
      name: { ar: "جلوري", en: "BAIC Glory" },
      category: "comfort",
      seats: 6,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 2970 },
      departure: { price: 2900 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2970 },
    },
    images: ["/image/car_1.webp", "/image/car_2.webp", "/image/car_3.jfif"],
    description:
      "تنقّل في القاهرة على متن BAIC Glory، سيارة SUV مريحة بسبعة مقاعد مع سائق محترف — مثالية للعائلات وخدمة التوصيل للمطار والرحلات اليومية.",
    bookingsCount: 1524,
  },
};

export default function CarDetailsPage() {
  const params = useParams();
  const carId = params.id as string;

  const car = mockCarsById[carId];

  if (!car) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-white/50">
        السيارة دي مش موجودة
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <CarDetailsView
        specs={car.specs}
        pricing={car.pricing}
        activeTripType="arrival"
        images={car.images}
        description={car.description}
        bookingsCount={car.bookingsCount}
        isMostRequested
        onBookNow={() => console.log("book now", carId)}
      />
    </div>
  );
}
