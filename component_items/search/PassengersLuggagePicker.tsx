"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Users, Briefcase, Plus, Minus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CounterRowProps {
  icon: React.ElementType;
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}

function CounterRow({
  icon: Icon,
  label,
  value,
  min,
  onChange,
}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/5"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-bold text-white">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/5 disabled:opacity-30"
        >
          {value <= min && min === 0 ? (
            <span className="text-white/30">
              <Minus className="h-3.5 w-3.5" />
            </span>
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-white/80">{label}</span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
    </div>
  );
}

interface PassengersLuggagePickerProps {
  passengers: number;
  luggage: number;
  onChange: (passengers: number, luggage: number) => void;
}

export function PassengersLuggagePicker({
  passengers,
  luggage,
  onChange,
}: PassengersLuggagePickerProps) {
  const t = useTranslations("SearchBar");
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex w-full items-center gap-1 text-sm font-bold text-white">
        <span className="truncate">
          {passengers} {t("passengersUnit")}
        </span>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-72 border-white/10 bg-[#0d1728] p-0 text-white"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button onClick={() => setOpen(false)}>
            <X className="h-4 w-4 text-white/50" />
          </button>
          <p className="text-sm font-bold">{t("passengersAndLuggage")}</p>
        </div>

        <div className="flex flex-col divide-y divide-white/5 px-4">
          <CounterRow
            icon={Users}
            label={t("passengersLabel")}
            value={passengers}
            min={1}
            onChange={(v) => onChange(v, luggage)}
          />
          <CounterRow
            icon={Briefcase}
            label={t("luggageLabel")}
            value={luggage}
            min={0}
            onChange={(v) => onChange(passengers, v)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
