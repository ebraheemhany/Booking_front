"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  Plane,
  CalendarDays,
  Clock,
  Users,
  Search,
  ChevronDown,
  X,
  Check,
  Briefcase,
  CalendarClock,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { TimeWheelPicker } from "./search/TimeWheelPicker";
import { PassengersLuggagePicker } from "./search/PassengersLuggagePicker";
import { LocationPicker, type LocationValue } from "./search/LocationPicker";
import { airportKeys, airportCoordinates } from "./airportData";
import type { TripDetailsData, TripType } from "./booking/TripDetailsStep";

const tripTypes: { value: TripType; icon: React.ElementType }[] = [
  { value: "arrival", icon: Plane },
  { value: "departure", icon: Plane },
  { value: "private", icon: Briefcase },
  { value: "dailyRental", icon: CalendarClock },
];

interface AirportSearchBarProps {
  onSearch: (data: TripDetailsData) => void;
  /** الأنواع المسموح ظهورها في القائمة. لو مش محدد، بتتعرض الأنواع الأربعة كلهم. */
  allowedTripTypes?: TripType[];
  /** لو false، حقل المطار بيتحول لحقل نقطة عادي (LocationPicker) بدل قائمة المطارات. افتراضيًا true. */
  showAirportField?: boolean;
}

// ── حقل المطار كـ component منفصل عشان نستخدمه مرتين من غير تكرار ──
function AirportField({
  t,
  airport,
  setAirport,
  airportOpen,
  setAirportOpen,
}: {
  t: ReturnType<typeof useTranslations>;
  airport: (typeof airportKeys)[number];
  setAirport: (a: (typeof airportKeys)[number]) => void;
  airportOpen: boolean;
  setAirportOpen: (open: boolean) => void;
}) {
  return (
    <Popover open={airportOpen} onOpenChange={setAirportOpen}>
      <PopoverTrigger
        className={`flex flex-1 items-center gap-3 px-4 py-3 text-start transition-colors ${
          airportOpen ? "ring-2 ring-inset ring-amber-500" : ""
        }`}
      >
        <Plane className="h-4 w-4 shrink-0 text-white/30" />
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-[11px] text-white/40">
            {t("airport")}
          </p>
          <p className="truncate text-sm font-bold text-white">
            {t(`airports.${airport}`)}
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-72 border-white/10 bg-[#0d1728] p-0 text-white"
      >
        <div className="flex flex-col divide-y divide-white/5">
          {airportKeys.map((key) => {
            const isSelected = airport === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setAirport(key);
                  setAirportOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5 ${
                  isSelected ? "font-bold text-amber-400" : "text-white/80"
                }`}
              >
                <span className="truncate">{t(`airports.${key}`)}</span>
                <Plane className="h-3.5 w-3.5 shrink-0 text-white/30" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AirportSearchBar({
  onSearch,
  allowedTripTypes = ["arrival", "departure", "private", "dailyRental"],
  showAirportField = true,
}: AirportSearchBarProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("SearchBar");
  const tBooking = useTranslations("Booking");

  const availableTripTypes = useMemo(
    () => tripTypes.filter((type) => allowedTripTypes.includes(type.value)),
    [allowedTripTypes],
  );

  const [tripType, setTripType] = useState<TripType>(
    availableTripTypes[0]?.value ?? "arrival",
  );
  const [tripTypeOpen, setTripTypeOpen] = useState(false);

  const [airport, setAirport] = useState<(typeof airportKeys)[number]>("cai");
  const [airportOpen, setAirportOpen] = useState(false);

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const dateLocale = isArabic ? ar : enUS;

  const [destination, setDestination] = useState<LocationValue | null>(null);
  const [destinationB, setDestinationB] = useState<LocationValue | null>(null);

  // ← جديد: التحكم في ظهور رسالة "اختار العربية المناسبة"
  const [showSelectCarMessage, setShowSelectCarMessage] = useState(false);

  const tripTypeLabelKey: Record<TripType, string> = {
    arrival: "tripArrival",
    departure: "tripDeparture",
    private: "tripPrivate",
    dailyRental: "tripDailyRental",
  };

  const searchBarLabelKey: Partial<Record<TripType, string>> = {
    arrival: "tripTypeFromAirport",
    departure: "tripTypeToAirport",
  };

  const isAirportOnly =
    allowedTripTypes.length === 2 &&
    allowedTripTypes.includes("arrival") &&
    allowedTripTypes.includes("departure");

  const getTripTypeLabel = (type: TripType) => {
    const searchBarKey = searchBarLabelKey[type];
    if (isAirportOnly && searchBarKey) {
      return t(searchBarKey);
    }
    return tBooking(tripTypeLabelKey[type]);
  };

  const airportAsLocation = useMemo(
    () => ({
      address: t(`airports.${airport}`),
      lat: airportCoordinates[airport].lat,
      lng: airportCoordinates[airport].lng,
    }),
    [airport, t],
  );

  const getPoints = useCallback(() => {
    if (tripType === "arrival") {
      return {
        pointA: showAirportField ? airportAsLocation : destinationB,
        pointB: destination,
      };
    }

    if (tripType === "departure") {
      return {
        pointA: destination,
        pointB: showAirportField ? airportAsLocation : destinationB,
      };
    }

    return { pointA: destination, pointB: destinationB };
  }, [
    airportAsLocation,
    destination,
    destinationB,
    showAirportField,
    tripType,
  ]);

  useEffect(() => {
    const { pointA, pointB } = getPoints();
    onSearch({
      tripType,
      pointA,
      pointB,
      date: date ?? null,
      time,
      passengers,
      luggage,
    });
  }, [date, getPoints, luggage, onSearch, passengers, time, tripType]);

  const handleSearchClick = () => {
    const { pointA, pointB } = getPoints();

    onSearch({
      tripType,
      pointA,
      pointB,
      date: date ?? null,
      time,
      passengers,
      luggage,
    });

    setShowSelectCarMessage(true);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d1728] shadow-xl">
      <div className="flex w-full flex-col divide-y divide-white/10 md:flex-row md:divide-x md:divide-y-0 md:divide-x-reverse">
        {/* نوع المشوار */}
        <Popover open={tripTypeOpen} onOpenChange={setTripTypeOpen}>
          <PopoverTrigger
            className={`flex flex-1 items-center gap-3 px-4 py-3 text-start transition-colors ${
              tripTypeOpen ? "ring-2 ring-inset ring-amber-500" : ""
            }`}
          >
            <Plane className="h-4 w-4 shrink-0 text-white/30" />
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 truncate text-[11px] text-white/40">
                {t("tripType")}
              </p>
              <p className="truncate text-sm font-bold text-white">
                {getTripTypeLabel(tripType)}
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-72 border-white/10 bg-[#0d1728] p-0 text-white"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-bold">{t("tripType")}</p>
              <button onClick={() => setTripTypeOpen(false)}>
                <X className="h-4 w-4 text-white/50" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3">
              {availableTripTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = tripType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      setTripType(type.value);
                      setTripTypeOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 font-bold text-amber-400"
                        : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate text-start">
                      {getTripTypeLabel(type.value)}
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* المطار/نقطة إضافية + العنوان — الترتيب بيتغير حسب نوع الرحلة */}
        {tripType === "arrival" ? (
          <>
            {showAirportField ? (
              <AirportField
                t={t}
                airport={airport}
                setAirport={setAirport}
                airportOpen={airportOpen}
                setAirportOpen={setAirportOpen}
              />
            ) : (
              <LocationPicker
                value={destinationB}
                onChange={setDestinationB}
                label={t("departureLocation")}
              />
            )}
            <LocationPicker
              value={destination}
              onChange={setDestination}
              label={t("dropoffLocation")}
            />
          </>
        ) : tripType === "departure" ? (
          <>
            <LocationPicker
              value={destination}
              onChange={setDestination}
              label={t("departureLocation")}
            />
            {showAirportField ? (
              <AirportField
                t={t}
                airport={airport}
                setAirport={setAirport}
                airportOpen={airportOpen}
                setAirportOpen={setAirportOpen}
              />
            ) : (
              <LocationPicker
                value={destinationB}
                onChange={setDestinationB}
                label={t("dropoffLocation")}
              />
            )}
          </>
        ) : (
          <>
            <LocationPicker
              value={destination}
              onChange={setDestination}
              label={t("departureLocation")}
            />
            <LocationPicker
              value={destinationB}
              onChange={setDestinationB}
              label={t("dropoffLocation")}
            />
          </>
        )}

        {/* التاريخ */}
        <div className="flex flex-1 items-center gap-3 px-4 py-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-white/30" />
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 truncate text-[11px] text-white/40">
              {t("date")}
            </p>
            <Popover>
              <PopoverTrigger className="flex w-full items-center gap-1 text-sm font-bold text-white">
                <span className="truncate">
                  {date
                    ? format(date, "d MMMM", { locale: dateLocale })
                    : t("datePlaceholder")}
                </span>
                <ChevronDown className="h-3 w-3 shrink-0 text-white/40" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={dateLocale}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* الوقت */}
        <div className="flex flex-1 items-center gap-3 px-4 py-3">
          <Clock className="h-4 w-4 shrink-0 text-white/30" />
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 truncate text-[11px] text-white/40">
              {t("time")}
            </p>
            <TimeWheelPicker
              value={time}
              onChange={setTime}
              label={t("time")}
              placeholder={t("timePlaceholder")}
            />
          </div>
        </div>

        {/* الركاب والأمتعة */}
        <div className="flex flex-1 items-center gap-3 px-4 py-3">
          <Users className="h-4 w-4 shrink-0 text-white/30" />
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 truncate text-[11px] text-white/40">
              {t("passengers")}
            </p>
            <PassengersLuggagePicker
              passengers={passengers}
              luggage={luggage}
              onChange={(p, l) => {
                setPassengers(p);
                setLuggage(l);
              }}
            />
          </div>
        </div>

        {/* زرار البحث */}
        <div className="flex shrink-0 items-center bg-amber-500 px-6 py-4 transition-colors hover:bg-amber-400 md:w-35">
          <Button
            variant="ghost"
            onClick={handleSearchClick}
            className="h-auto w-full gap-2 p-0 text-sm font-bold text-black hover:bg-transparent cursor-pointer "
          >
            <Search className="h-4 w-4" />
            {t("search")}
          </Button>
        </div>
      </div>

      {showSelectCarMessage && (
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-center text-sm font-bold text-amber-400">
            {tBooking("selectSuitableCar")}
          </p>
        </div>
      )}
    </div>
  );
}
