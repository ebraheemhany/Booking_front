"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { MapPin, CalendarDays, Clock, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";
import type { TripDetailsData } from "./TripDetailsStep";
import type { CarSpecs } from "@/component_items/cars/CarCard";

const tripTypeLabelKey: Record<string, string> = {
  arrival: "tripArrival",
  departure: "tripDeparture",
  private: "tripPrivate",
  dailyRental: "tripDailyRental",
};

interface BookingReviewStepProps {
  tripData: TripDetailsData;
  car: CarSpecs;
  totalPrice: number;
  distanceKm: number | null;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function BookingReviewStep({
  tripData,
  car,
  totalPrice,
  distanceKm,
  onConfirm,
  onBack,
  isSubmitting,
}: BookingReviewStepProps) {
  const t = useTranslations("Booking");
  const locale = useLocale() as "ar" | "en";
  const { formattedPrice, currency, isLoading } = useConvertedPrice(totalPrice);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* السيارة المختارة */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1728] p-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
          <Image src={car.image} alt={car.name[locale]} fill className="object-cover" />
        </div>
        <div>
          <p className="text-xs text-white/40">{t("selectedCar")}</p>
          <p className="text-sm font-bold text-white">{car.name[locale]}</p>
        </div>
      </div>

      {/* تفاصيل الرحلة */}
      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0d1728] p-4">
        <p className="text-sm font-bold text-white/80">
          {tripData.tripType ? t(tripTypeLabelKey[tripData.tripType]) : ""}
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
              A
            </span>
            <p className="text-sm text-white/70">{tripData.pointA?.address}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
              B
            </span>
            <p className="text-sm text-white/70">{tripData.pointB?.address}</p>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <CalendarDays className="h-4 w-4 text-white/40" />
            {tripData.date?.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Clock className="h-4 w-4 text-white/40" />
            {tripData.time}
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Users className="h-4 w-4 text-white/40" />
            {t("passengersCount", { count: tripData.passengers })}
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Briefcase className="h-4 w-4 text-white/40" />
            {t("luggageCount", { count: tripData.luggage })}
          </div>
        </div>

        {distanceKm !== null && (
          <div className="flex items-center gap-2 border-t border-white/5 pt-3 text-sm text-white/70">
            <MapPin className="h-4 w-4 text-amber-400" />
            {t("distanceKm", { km: distanceKm })}
          </div>
        )}
      </div>

      {/* السعر الإجمالي */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1728] p-4">
        <span className="text-sm text-white/60">{t("totalPrice")}</span>
        {isLoading ? (
          <span className="inline-block h-6 w-24 animate-pulse rounded bg-white/10" />
        ) : (
          <span className="text-xl font-bold text-white">
            {formattedPrice} <span className="text-sm font-normal text-white/60">{currency}</span>
          </span>
        )}
      </div>

      {/* الأزرار */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 flex-1 border-white/10 bg-transparent font-bold text-white hover:bg-white/5"
        >
          {t("back")}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="h-12 flex-[2] bg-amber-500 font-bold text-black hover:bg-amber-400 disabled:opacity-50"
        >
          {isSubmitting ? t("confirming") : t("confirmBooking")}
        </Button>
      </div>
    </div>
  );
}