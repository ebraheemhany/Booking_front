"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { CarDetailsView } from "@/component_items/cars/CarDetailsView";
import type { CarCardData } from "@/component_items/cars/CarCard";
import { mockCars } from "@/data/mockCars";

interface CarDetailData extends CarCardData {
  images: string[];
  description: { ar: string; en: string };
  bookingsCount: number;
}

const carDetails: Record<
  string,
  {
    name: { ar: string; en: string };
    category: string;
    seats: number;
    luggage: number;
    hasPrivateDriver: boolean;
    wheelchairAccessible: boolean;
    images: string[];
    description: { ar: string; en: string };
    bookingsCount: number;
  }
> = {
  "1": {
    name: { ar: "شانجان CS55", en: "Changan CS55" },
    category: "comfort",
    seats: 4,
    luggage: 2,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_1.webp", "/image/car_2.webp", "/image/car_3.jfif"],
    description: {
      ar: "سيارة SUV مريحة ومناسبة للتنقل داخل القاهرة وخدمات التوصيل للمطار.",
      en: "A comfortable SUV, ideal for trips around Cairo and airport transfers.",
    },
    bookingsCount: 1524,
  },
  "2": {
    name: { ar: "تويوتا فورتشنر", en: "Toyota Fortuner" },
    category: "family",
    seats: 7,
    luggage: 4,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_2.webp", "/image/car_1.webp", "/image/car_4.jpg"],
    description: {
      ar: "سيارة عائلية واسعة بمساحة كبيرة للركاب والأمتعة، مناسبة للرحلات الطويلة.",
      en: "A spacious family SUV with room for passengers and luggage on longer trips.",
    },
    bookingsCount: 1180,
  },
  "3": {
    name: { ar: "مرسيدس C200", en: "Mercedes C200" },
    category: "vip",
    seats: 4,
    luggage: 2,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_3.jfif", "/image/car_1.webp", "/image/car_2.webp"],
    description: {
      ar: "سيارة فاخرة بتصميم أنيق وقيادة مريحة لخدمة رجال الأعمال والمناسبات.",
      en: "A premium sedan with an elegant design for business trips and special occasions.",
    },
    bookingsCount: 936,
  },
  "4": {
    name: { ar: "شيفروليه أوبترا", en: "Chevrolet Optra" },
    category: "standard",
    seats: 4,
    luggage: 2,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_4.jpg", "/image/car_1.webp", "/image/car_3.jfif"],
    description: {
      ar: "سيارة عملية واقتصادية للاستخدام اليومي والتنقل داخل المدينة.",
      en: "A practical and economical car for daily use and city transfers.",
    },
    bookingsCount: 804,
  },
  "5": {
    name: { ar: "هيونداي إلنترا", en: "Hyundai Elantra" },
    category: "comfort",
    seats: 4,
    luggage: 2,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_1.webp", "/image/car_4.jpg", "/image/car_2.webp"],
    description: {
      ar: "سيارة سيدان مريحة وهادئة، مناسبة للرحلات الفردية والعائلية.",
      en: "A quiet and comfortable sedan for individual and family trips.",
    },
    bookingsCount: 742,
  },
  "6": {
    name: { ar: "كيا سبورتاج", en: "Kia Sportage" },
    category: "family",
    seats: 5,
    luggage: 3,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_2.webp", "/image/car_4.jpg", "/image/car_1.webp"],
    description: {
      ar: "سيارة SUV عائلية تجمع بين الراحة والمساحة وسهولة الحركة.",
      en: "A family SUV combining comfort, space, and easy handling.",
    },
    bookingsCount: 688,
  },
  "7": {
    name: { ar: "بي إم دبليو الفئة الخامسة", en: "BMW 5 Series" },
    category: "vip",
    seats: 4,
    luggage: 2,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_3.jfif", "/image/car_2.webp", "/image/car_4.jpg"],
    description: {
      ar: "تجربة فاخرة مع مساحة داخلية واسعة وخصوصية عالية أثناء الرحلة.",
      en: "A premium experience with a spacious interior and extra privacy.",
    },
    bookingsCount: 521,
  },
  "8": {
    name: { ar: "نيسان صني", en: "Nissan Sunny" },
    category: "standard",
    seats: 4,
    luggage: 2,
    hasPrivateDriver: true,
    wheelchairAccessible: false,
    images: ["/image/car_4.jpg", "/image/car_1.webp", "/image/car_3.jfif"],
    description: {
      ar: "اختيار اقتصادي وعملي للتنقلات اليومية وخدمات المطار.",
      en: "A practical and economical choice for daily trips and airport transfers.",
    },
    bookingsCount: 467,
  },
};

const mockCarsById: Record<string, CarDetailData> = Object.fromEntries(
  mockCars.map((car) => {
    const details = carDetails[car.specs.id];
    return [
      car.specs.id,
      {
        ...car,
        specs: {
          ...car.specs,
          ...details,
          name: details.name,
          image: details.images[0],
        },
        images: details.images,
        description: details.description,
        bookingsCount: details.bookingsCount,
      },
    ];
  }),
);

export default function CarDetailsPage() {
  const params = useParams();
  const locale = useLocale() as "ar" | "en";
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
        description={car.description[locale]}
        bookingsCount={car.bookingsCount}
        isMostRequested={carId === "1"}
        onBookNow={() => console.log("book now", carId)}
      />
    </div>
  );
}
