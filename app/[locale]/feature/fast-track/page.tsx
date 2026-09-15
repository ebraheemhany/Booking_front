"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { AirportSearchBar } from "@/component_items/AirportSearchBar";
import { TripMapPanel } from "@/component_items/booking/TripMapPanel";
import {
  TripDetailsStep,
  type TripDetailsData,
} from "@/component_items/booking/TripDetailsStep";
import { HeroSection } from "@/component_items/Hero_page_Section";
import { SearchResultsPage } from "@/component_items/search/SearchResultsPage";
import type { FiltersState } from "@/component_items/search/FiltersSheet";
import type { CarCardData } from "@/component_items/cars/CarCard";
import { SignInBanner } from "@/component_items/SignInBanner";

import type { AppDispatch } from "@/store/store";
import { setBookingData } from "@/store/slices/bookingSlice";

const mockCars: CarCardData[] = [
  {
    specs: {
      id: "1",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/cars/changan-cs55.webp",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
  {
    specs: {
      id: "2",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/cars/changan-cs55.webp",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
  {
    specs: {
      id: "3",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/car_4.jpg",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
  {
    specs: {
      id: "4",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/car_4.jpg",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
  {
    specs: {
      id: "5",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/car_4.jpg",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
  {
    specs: {
      id: "6",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/car_4.jpg",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
  {
    specs: {
      id: "7",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/car_4.jpg",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
  {
    specs: {
      id: "8",
      name: { ar: "شانجان CS55", en: "Changan CS55" },
      category: "comfort",
      image: "/image/car_4.jpg",
      seats: 4,
      luggage: 2,
      hasPrivateDriver: true,
      wheelchairAccessible: false,
      whatsappNumber: "201234567890",
    },
    pricing: {
      arrival: { price: 3300 },
      departure: { price: 3100 },
      private: { price: 250, hoursIncluded: 12, kmIncluded: 150 },
      dailyRental: { price: 2800 },
    },
  },
];

export default function FastTrackPage() {
  const t = useTranslations("HeroFastTrack");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [filters, setFilters] = useState<FiltersState>({
    tripPrice: "arrival",
    carCategory: "all",
    wheelchairAccessible: false,
    minBudget: 2000,
    maxBudget: 8000,
  });

  // --- بيانات الرحلة (فورم/خريطة الموبايل) ---
  const [tripData, setTripData] = useState<TripDetailsData>({
    tripType: null,
    pointA: null,
    pointB: null,
    date: null,
    time: "",
    passengers: 1,
    luggage: 0,
  });
  const [mobileView, setMobileView] = useState<"form" | "map">("form");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const canProceedToMap = Boolean(
    tripData.tripType &&
    tripData.pointA &&
    tripData.pointB &&
    tripData.date &&
    tripData.time,
  );

  const handleFormNext = () => {
    if (!canProceedToMap) return;
    setMobileView("map");
  };

  const handleMapNext = () => {
    setMobileView("form");
  };

  const handleBookNow = (car: CarCardData) => {
    dispatch(
      setBookingData({
        source: "fastTrack",
        tripType: tripData.tripType,
        pickup: tripData.pointA,
        dropoff: tripData.pointB,
        date: tripData.date ? tripData.date.toISOString() : null,
        time: tripData.time,
        passengers: tripData.passengers,
        luggage: tripData.luggage,
        selectedCar: car,
      }),
    );

    router.push(`/feature/lemozeen/${car.specs.id}/booking`);
  };

  return (
    <div>
      <HeroSection
        tagline={t("tagline")}
        title={t("title")}
        description={t("description")}
        image="/image/air_2.jpg"
      />

      {/* الشاشات الكبيرة: AirportSearchBar (arrival/departure بس) */}
      <div className="mx-auto my-4 hidden w-[90%] lg:block">
        <AirportSearchBar
          onSearch={setTripData}
          allowedTripTypes={["arrival", "departure"]}
        />
      </div>

      {/* الشاشات الصغيرة: فورم/خريطة زي lemozeen بالظبط */}
      <div className="mx-auto my-4 w-[90%] lg:hidden">
        <div className={mobileView === "map" ? "block" : "hidden"}>
          <TripMapPanel
            tripType={tripData.tripType}
            pointA={tripData.pointA}
            pointB={tripData.pointB}
            passengers={tripData.passengers}
            whatsappNumber="201234567890"
            onNext={handleMapNext}
            onBack={() => setMobileView("form")}
            onDistanceCalculated={setDistanceKm}
          />
        </div>

        <div className={mobileView === "form" ? "block" : "hidden"}>
          <TripDetailsStep
            value={tripData}
            onChange={setTripData}
            onNext={handleFormNext}
            allowedTripTypes={["arrival", "departure"]}
          />
        </div>
      </div>

      <div className="h-[1px] w-full bg-border" />

      <div className="my-3">
        <SearchResultsPage
          cars={mockCars}
          filters={filters}
          onFiltersChange={setFilters}
          whatsappNumber="201234567890"
          onBookNow={handleBookNow}
        />
      </div>
      <SignInBanner />
    </div>
  );
}
