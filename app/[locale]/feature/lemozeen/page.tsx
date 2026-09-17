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
import { SearchResultsPage } from "@/component_items/search/SearchResultsPage";
import type { FiltersState } from "@/component_items/search/FiltersSheet";
import type { CarCardData } from "@/component_items/cars/CarCard";
import { HeroSection } from "@/component_items/Hero_page_Section";
import { SignInBanner } from "@/component_items/SignInBanner";
// import { AiAssistant } from "@/component_items/agent/AiAssistant";
import { useRegisterAiHandlers } from "@/component_items/agent/AiAssistantContext";
import type { AppDispatch } from "@/store/store";
import { setBookingData } from "@/store/slices/bookingSlice";
import { resolveLocation } from "@/component_items/agent/resolveLocation";
import { mockCars } from "@/data/mockCars";

export default function LimousinePage() {
  const t = useTranslations("HeroLimousine");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [filters, setFilters] = useState<FiltersState>({
    tripPrice: "arrival",
    carCategory: "all",
    wheelchairAccessible: false,
    minBudget: 2000,
    maxBudget: 8000,
  });

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
        source: "lemozeen",
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

  // ← الـ AI يملأ الفورم بالنقطتين الفعليتين (مش مطار بس)
  const handleAiFillTripSearch = async (data: {
    tripType?: "arrival" | "departure" | "private" | "dailyRental";
    fromLocation?: string;
    toLocation?: string;
    date?: string;
    time?: string;
    passengers?: number;
  }) => {
    const [pointA, pointB] = await Promise.all([
      resolveLocation(data.fromLocation),
      resolveLocation(data.toLocation),
    ]);

    setTripData((prev) => ({
      ...prev,
      tripType: data.tripType ?? prev.tripType,
      pointA: pointA ?? prev.pointA,
      pointB: pointB ?? prev.pointB,
      date: data.date ? new Date(data.date) : prev.date,
      time: data.time ?? prev.time,
      passengers: data.passengers ?? prev.passengers,
    }));
  };

  // ← الـ AI يختار عربية ويوديك لصفحة المراجعة، بنقطتين فعليتين
  const handleAiBookCar = async (criteria: {
    tripType: "arrival" | "departure" | "private" | "dailyRental";
    fromLocation?: string;
    toLocation?: string;
    date: string;
    time?: string;
    passengers?: number;
    preferredCategory?: string;
    maxBudget?: number;
  }) => {
    let candidates = mockCars;

    if (criteria.preferredCategory) {
      candidates = candidates.filter(
        (c) => c.specs.category === criteria.preferredCategory,
      );
    }

    if (criteria.maxBudget) {
      candidates = candidates.filter(
        (c) =>
          (c.pricing[criteria.tripType]?.price ?? Infinity) <=
          criteria.maxBudget!,
      );
    }

    if (candidates.length === 0) {
      return {
        success: false,
        message: "معلش، مفيش عربية مطابقة للمعايير دي دلوقتي 😕",
      };
    }

    const chosenCar = candidates.reduce((cheapest, current) => {
      const cheapestPrice =
        cheapest.pricing[criteria.tripType]?.price ?? Infinity;
      const currentPrice =
        current.pricing[criteria.tripType]?.price ?? Infinity;
      return currentPrice < cheapestPrice ? current : cheapest;
    });

    const [pointA, pointB] = await Promise.all([
      resolveLocation(criteria.fromLocation),
      resolveLocation(criteria.toLocation),
    ]);

    dispatch(
      setBookingData({
        source: "lemozeen",
        tripType: criteria.tripType,
        pickup: pointA,
        dropoff: pointB,
        date: criteria.date,
        time: criteria.time ?? "",
        passengers: criteria.passengers ?? 1,
        luggage: 0,
        selectedCar: chosenCar,
      }),
    );

    router.push(`/feature/lemozeen/${chosenCar.specs.id}/booking`);

    return {
      success: true,
      message: `اخترتلك ${chosenCar.specs.name.ar} — راجع بياناتك في صفحة تأكيد الحجز وكمّل من هناك`,
    };
  };
  useRegisterAiHandlers({
    onFillTripSearch: handleAiFillTripSearch,
    onBookCar: handleAiBookCar,
  });
  return (
    <div>
      <HeroSection
        tagline={t("tagline")}
        title={t("title")}
        description={t("description")}
        image="/image/car_2.webp"
      />
      <div className="mx-auto my-4 hidden w-[90%] lg:block">
        <AirportSearchBar onSearch={setTripData} showAirportField={false} />
      </div>

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

      {/* <AiAssistant
        onFillTripSearch={handleAiFillTripSearch}
        onBookCar={handleAiBookCar}
      /> */}
    </div>
  );
}
