"use client";

import { useTranslations } from "next-intl";
import { Plane, Building2, CalendarClock, ChevronDown } from "lucide-react";
import type { TripType } from "./TripDetailsStep";

const tripTypeOptions: { value: TripType; icon: React.ElementType }[] = [
  { value: "arrival", icon: Plane },
  { value: "departure", icon: Plane },
  { value: "private", icon: Building2 },
  { value: "dailyRental", icon: CalendarClock },
];

const tripTypeLabelKey: Record<TripType, string> = {
  arrival: "tripArrival",
  departure: "tripDeparture",
  private: "tripPrivate",
  dailyRental: "tripDailyRental",
};
const tripTypeDescKey: Record<TripType, string> = {
  arrival: "tripArrivalDesc",
  departure: "tripDepartureDesc",
  private: "tripPrivateDesc",
  dailyRental: "tripDailyRentalDesc",
};

// تسميات بديلة "من/إلى المطار" — تُستخدم لما allowedTripTypes مقيدة بالمطارات بس
const airportLabelKey: Partial<Record<TripType, string>> = {
  arrival: "tripTypeFromAirport",
  departure: "tripTypeToAirport",
};

interface TripTypeSelectorProps {
  value: TripType | null;
  onChange: (value: TripType) => void;
  /** الأنواع المسموح ظهورها. لو مش محدد، بتتعرض الأنواع الأربعة كلهم. */
  allowedTripTypes?: TripType[];
}

export function TripTypeSelector({
  value,
  onChange,
  allowedTripTypes = ["arrival", "departure", "private", "dailyRental"],
}: TripTypeSelectorProps) {
  const t = useTranslations("Booking");
  const tSearchBar = useTranslations("SearchBar");

  const availableOptions = tripTypeOptions.filter((option) =>
    allowedTripTypes.includes(option.value),
  );

  // لو النوع مقيد بالمطارات بس (arrival/departure)، استخدم تسمية "من/إلى المطار"
  const isAirportOnly =
    allowedTripTypes.length === 2 &&
    allowedTripTypes.includes("arrival") &&
    allowedTripTypes.includes("departure");

  const getLabel = (optionValue: TripType) => {
    if (isAirportOnly && airportLabelKey[optionValue]) {
      return tSearchBar(airportLabelKey[optionValue]!);
    }
    return t(tripTypeLabelKey[optionValue]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      {availableOptions.map(({ value: optionValue, icon: Icon }, i) => {
        const isSelected = value === optionValue;
        return (
          <button
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={`flex w-full items-center justify-between px-4 py-3.5 text-start transition-colors ${
              i > 0 ? "border-t border-white/5" : ""
            } ${isSelected ? "bg-amber-500/10" : "hover:bg-white/5"}`}
          >
            <div>
              <p
                className={`text-sm font-bold ${
                  isSelected ? "text-amber-400" : "text-white"
                }`}
              >
                {getLabel(optionValue)}
              </p>
              <p className="mt-0.5 text-xs text-white/40">
                {t(tripTypeDescKey[optionValue])}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Icon
                className={`h-4 w-4 ${
                  isSelected ? "text-amber-400" : "text-white/30"
                }`}
              />
              {isSelected ? (
                <ChevronDown className="h-4 w-4 text-white/40" />
              ) : (
                <span className="text-white/20">←</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
