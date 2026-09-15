"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Minus,
  Trash2,
  Users,
  CalendarDays,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TripTypeSelector } from "./TripTypeSelector";
import { TimeWheelPicker } from "@/component_items/search/TimeWheelPicker";
import {
  LocationPicker,
  type LocationValue,
} from "@/component_items/search/LocationPicker";
import {
  airportKeys,
  airportCoordinates,
  type AirportKey,
} from "../airportData";

export type TripType = "arrival" | "departure" | "private" | "dailyRental";

export interface TripDetailsData {
  tripType: TripType | null;
  pointA: LocationValue | null;
  pointB: LocationValue | null;
  date: Date | null;
  time: string;
  passengers: number;
  luggage: number;
}

interface TripDetailsStepProps {
  value: TripDetailsData;
  onChange: (value: TripDetailsData) => void;
  onNext: () => void;
  allowedTripTypes?: TripType[];
}

function CounterField({
  icon: Icon,
  label,
  value,
  min,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-xl border border-white/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(value + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/5"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-white">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/5 disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-white/80">
        {label}
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
    </div>
  );
}

const pointLabelsByTripType: Record<TripType, { a: string; b: string }> = {
  arrival: { a: "pointAirport", b: "pointDestination" },
  departure: { a: "pointPickup", b: "pointAirport" },
  private: { a: "pointA", b: "pointB" },
  dailyRental: { a: "pointStart", b: "pointEnd" },
};

export function TripDetailsStep({
  value,
  onChange,
  onNext,
  allowedTripTypes,
}: TripDetailsStepProps) {
  const t = useTranslations("Booking");
  const tSearchBar = useTranslations("SearchBar");

  const [airport, setAirport] = useState<AirportKey>("cai");

  const update = (patch: Partial<TripDetailsData>) =>
    onChange({ ...value, ...patch });

  const isArrival = value.tripType === "arrival";
  const isDeparture = value.tripType === "departure";

  // لما نوع الرحلة يبقى وصول/مغادرة، نظبط النقطة المناسبة تلقائيًا حسب المطار المختار
  useEffect(() => {
    if (!isArrival && !isDeparture) return;

    const airportLocation: LocationValue = {
      address: tSearchBar(`airports.${airport}`),
      lat: airportCoordinates[airport].lat,
      lng: airportCoordinates[airport].lng,
    };

    if (isArrival) {
      update({ pointA: airportLocation });
    } else {
      update({ pointB: airportLocation });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airport, isArrival, isDeparture]);

  const handleSwapPoints = () => {
    update({ pointA: value.pointB, pointB: value.pointA });
  };

  const canProceed =
    value.tripType && value.pointA && value.pointB && value.date && value.time;

  const labels = value.tripType
    ? pointLabelsByTripType[value.tripType]
    : { a: "pointA", b: "pointB" };

  return (
    <div className="flex h-full flex-col space-y-4">
      <TripTypeSelector
        value={value.tripType}
        onChange={(tripType) => update({ tripType })}
        allowedTripTypes={allowedTripTypes}
      />

      <div className="space-y-4 rounded-xl border border-white/10 p-4">
        <div className="relative space-y-2">
          <button
            onClick={handleSwapPoints}
            className=" hidden sm:absolute   sm:start-0 top-1/2 z-10 sm:flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0d1728] text-white/50 hover:bg-white/5"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>

          <div className="ps-0 sm:ps-9">
            {isArrival ? (
              <AirportPickerRow
                label="A"
                airport={airport}
                onChange={setAirport}
              />
            ) : (
              <LocationPickerRow
                label="A"
                placeholder={t(labels.a)}
                value={value.pointA}
                onChange={(loc) => update({ pointA: loc })}
              />
            )}
          </div>
          <div className="ps-0  sm:ps-9 sm:mt-0 ">
            {isDeparture ? (
              <AirportPickerRow
                label="B"
                airport={airport}
                onChange={setAirport}
              />
            ) : (
              <LocationPickerRow
                label="B"
                placeholder={t(labels.b)}
                value={value.pointB}
                onChange={(loc) => update({ pointB: loc })}
              />
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-white/80">
            {t("dateAndTime")}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="rounded-xl border border-white/10 px-4 py-3 flex-1">
              <TimeWheelPicker
                value={value.time}
                onChange={(time) => update({ time })}
                label={t("dateAndTime")}
                placeholder={t("addTime")}
              />
            </div>

            <Popover>
              <PopoverTrigger className="flex-1 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5">
                <CalendarDays className="h-4 w-4 text-white/40" />
                {value.date ? value.date.toLocaleDateString() : t("addDate")}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value.date ?? undefined}
                  onSelect={(d) => update({ date: d ?? null })}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className=" flex flex-col sm:flex-row gap-2">
          <CounterField
            icon={Trash2}
            label={t("luggage")}
            value={value.luggage}
            min={0}
            onChange={(v) => update({ luggage: v })}
          />
          <CounterField
            icon={Users}
            label={t("passengers")}
            value={value.passengers}
            min={1}
            onChange={(v) => update({ passengers: v })}
          />
        </div>
      </div>

      <div className="flex-1" />

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="h-12 w-full bg-amber-500 font-bold text-black hover:bg-amber-400 disabled:opacity-40"
      >
        {t("next")}
      </Button>
    </div>
  );
}

function LocationPickerRow({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: "A" | "B";
  placeholder: string;
  value: LocationValue | null;
  onChange: (v: LocationValue) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
        {label}
      </span>
      <div className="min-w-0 flex-1">
        <LocationPicker
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

// حقل اختيار مطار من قائمة — بديل LocationPickerRow لما النقطة تمثل مطار
function AirportPickerRow({
  label,
  airport,
  onChange,
}: {
  label: "A" | "B";
  airport: AirportKey;
  onChange: (key: AirportKey) => void;
}) {
  const tSearchBar = useTranslations("SearchBar");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
        {label}
      </span>
      <div className="min-w-0 flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="flex w-full items-center justify-between text-sm text-white">
            <span className="truncate">
              {tSearchBar(`airports.${airport}`)}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/40" />
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
                      onChange(key);
                      setOpen(false);
                    }}
                    className={`px-4 py-3 text-start text-sm transition-colors hover:bg-white/5 ${
                      isSelected ? "font-bold text-amber-400" : "text-white/80"
                    }`}
                  >
                    {tSearchBar(`airports.${key}`)}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
