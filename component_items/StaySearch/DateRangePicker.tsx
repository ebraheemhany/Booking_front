"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format, differenceInCalendarDays, addDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export interface DateRangeValue {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const t = useTranslations("StaySearch");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  const [open, setOpen] = useState(false);

  const nights =
    value.checkIn && value.checkOut
      ? differenceInCalendarDays(value.checkOut, value.checkIn)
      : 0;

  const setQuickRange = (days: number, startFromTomorrow = false) => {
    const start = startFromTomorrow ? addDays(new Date(), 1) : new Date();
    onChange({ checkIn: start, checkOut: addDays(start, days) });
  };

  const label =
    value.checkIn && value.checkOut
      ? `${format(value.checkIn, "d MMMM", { locale: dateLocale })} – ${format(
          value.checkOut,
          "d MMMM",
          { locale: dateLocale },
        )}`
      : t("selectDates");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex flex-1 items-center gap-3 px-4 py-3 text-start transition-colors ${
          open ? "ring-2 ring-inset ring-amber-500" : ""
        }`}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-white/30" />
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-[11px] text-white/40">
            {t("when")}
          </p>
          <p className="truncate text-sm font-bold text-white">{label}</p>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto border-white/10 bg-[#0d1728] p-0 text-white"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-sm font-bold">{t("selectDates")}</p>
          {nights > 0 && (
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
              {t("nightsCount", { count: nights })}
            </span>
          )}
        </div>

        <div className="flex gap-2 border-b border-white/10 px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickRange(1)}
            className="border-white/10 bg-transparent text-white/80 hover:bg-white/5"
          >
            {t("today")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickRange(1, true)}
            className="border-white/10 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
          >
            {t("tomorrow")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickRange(7)}
            className="border-white/10 bg-transparent text-white/80 hover:bg-white/5"
          >
            {t("weekend")}
          </Button>
        </div>

        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={{
            from: value.checkIn ?? undefined,
            to: value.checkOut ?? undefined,
          }}
          onSelect={(range) =>
            onChange({
              checkIn: range?.from ?? null,
              checkOut: range?.to ?? null,
            })
          }
          locale={dateLocale}
          disabled={{ before: new Date() }}
        />

        <div className="p-3">
          <Button
            onClick={() => setOpen(false)}
            disabled={!value.checkIn || !value.checkOut}
            className="h-11 w-full bg-amber-500 font-bold text-black hover:bg-amber-400 disabled:opacity-40"
          >
            {t("confirmNights", { count: nights })}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
