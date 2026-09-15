"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

import { TripMapPanel } from "@/component_items/booking/TripMapPanel";
import {
  TripDetailsStep,
  type TripDetailsData,
  type TripType,
} from "@/component_items/booking/TripDetailsStep";
import { BookingReviewStep } from "@/component_items/booking/BookingReviewStep";
import type { CarSpecs } from "@/component_items/cars/CarCard";

import type { RootState } from "@/store/store";

type BookingStage = "trip" | "review";

export default function BookingPage() {
  const bookingData = useSelector((state: RootState) => state.booking);

  const [tripData, setTripData] = useState<TripDetailsData>({
    tripType: bookingData.tripType,
    pointA: bookingData.pickup,
    pointB: bookingData.dropoff,
    date: bookingData.date ? new Date(bookingData.date) : null,
    time: bookingData.time ?? "",
    passengers: bookingData.passengers ?? 1,
    luggage: bookingData.luggage ?? 0,
  });

  const [mobileView, setMobileView] = useState<"form" | "map">("form");
  const [stage, setStage] = useState<BookingStage>("trip");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

  const allowedTripTypes: TripType[] | undefined =
    bookingData.source === "fastTrack" ? ["arrival", "departure"] : undefined;

  // العربية المختارة جايه من Redux بدل الـ mock الثابت
  const selectedCar: CarSpecs | null = bookingData.selectedCar?.specs ?? null;

  const canProceedToMap = Boolean(
    tripData.tripType &&
    tripData.pointA &&
    tripData.pointB &&
    tripData.date &&
    tripData.time,
  );

  const handleFormNext = () => {
    if (!canProceedToMap) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
      setStage("review");
    } else {
      setMobileView("map");
    }
  };

  const handleMapNext = () => {
    setStage("review");
  };

  const handleConfirmBooking = async () => {
    router.push(`/feature/lemozeen/${carId}/booking/payment`);
  };

  if (!selectedCar) {
    // المستخدم وصل هنا من غير ما يختار عربية (مثلاً refresh فضّى الـ Redux)
    return (
      <div className="mx-auto w-full px-4 py-8 text-center sm:w-[80%] md:w-[70%]">
        <p className="text-white/60">
          لا توجد بيانات حجز، من فضلك ارجع واختار عربية.
        </p>
      </div>
    );
  }

  if (stage === "review") {
    return (
      <div className="mx-auto w-full px-4 py-8 sm:w-[80%] md:w-[70%]">
        <BookingReviewStep
          tripData={tripData}
          car={selectedCar}
          totalPrice={3300}
          distanceKm={distanceKm}
          onConfirm={handleConfirmBooking}
          onBack={() => setStage("trip")}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 py-8 sm:w-[80%] md:w-[70%]">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_480px]">
        <div className={mobileView === "map" ? "block" : "hidden lg:block"}>
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

        <div className={mobileView === "form" ? "block" : "hidden lg:block"}>
          <TripDetailsStep
            value={tripData}
            onChange={setTripData}
            onNext={handleFormNext}
            allowedTripTypes={allowedTripTypes}
          />
        </div>
      </div>
    </div>
  );
}
