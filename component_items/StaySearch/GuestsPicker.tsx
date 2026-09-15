"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Users, Plus, Minus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export interface GuestsValue {
  adults: number;
  children: number;
}

interface GuestsPickerProps {
  value: GuestsValue;
  onChange: (value: GuestsValue) => void;
}

function CounterRow({
  label,
  hint,
  value,
  min,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        {hint && <p className="text-xs text-white/40">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/5 disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-bold text-white">
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 hover:bg-white/5"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function GuestsPicker({ value, onChange }: GuestsPickerProps) {
  const t = useTranslations("StaySearch");
  const [open, setOpen] = useState(false);

  const total = value.adults + value.children;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex flex-1 items-center gap-3 px-4 py-3 text-start transition-colors ${
          open ? "ring-2 ring-inset ring-amber-500" : ""
        }`}
      >
        <Users className="h-4 w-4 shrink-0 text-white/30" />
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-[11px] text-white/40">
            {t("guests")}
          </p>
          <p className="truncate text-sm font-bold text-white">
            {t("guestsCount", { count: value.adults })}
          </p>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 border-white/10 bg-[#0d1728] p-4 text-white"
      >
        <div className="flex items-center justify-between border-b border-white/10">
          <p className="pb-2 text-sm font-bold">{t("guests")}</p>
        </div>

        <div className="divide-y divide-white/5">
          <CounterRow
            label={t("adults")}
            hint={t("adultsHint")}
            value={value.adults}
            min={1}
            onChange={(adults) => onChange({ ...value, adults })}
          />
          <CounterRow
            label={t("children")}
            hint={t("childrenHint")}
            value={value.children}
            min={0}
            onChange={(children) => onChange({ ...value, children })}
          />
        </div>

        {value.children > 0 && (
          <p className="mt-2 text-xs text-white/40">{t("childrenPriceNote")}</p>
        )}

        <Button
          onClick={() => setOpen(false)}
          className="mt-4 h-11 w-full bg-amber-500 font-bold text-black hover:bg-amber-400"
        >
          {t("confirm")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
