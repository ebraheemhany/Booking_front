"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const periods = ["am", "pm"] as const;
const hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const minutes = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

interface WheelColumnProps<T extends string> {
  items: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderLabel?: (item: T) => string;
}

function WheelColumn<T extends string>({
  items,
  value,
  onChange,
  renderLabel,
}: WheelColumnProps<T>) {
  return (
    <div className="flex h-40 flex-col items-center gap-2 overflow-y-auto py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const isSelected = item === value;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`flex h-9 w-14 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
              isSelected
                ? "border border-amber-500 bg-amber-500/10 text-amber-400"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            {renderLabel ? renderLabel(item) : item}
          </button>
        );
      })}
    </div>
  );
}

interface TimeWheelPickerProps {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

export function TimeWheelPicker({
  value,
  onChange,
  label,
  placeholder,
}: TimeWheelPickerProps) {
  const t = useTranslations("SearchBar");
  const [open, setOpen] = useState(false);

  const [period, setPeriod] = useState<(typeof periods)[number]>("pm");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");

  function handleConfirm() {
    const hour24 =
      period === "pm"
        ? (parseInt(hour, 10) % 12) + 12
        : parseInt(hour, 10) % 12;
    onChange(`${String(hour24).padStart(2, "0")}:${minute}`);
    setOpen(false);
  }

  const displayValue = value
    ? `${value.split(":")[1]}:${
        parseInt(value.split(":")[0], 10) % 12 === 0
          ? 12
          : parseInt(value.split(":")[0], 10) % 12
      } ${parseInt(value.split(":")[0], 10) >= 12 ? t("pm") : t("am")}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex w-full items-center gap-1 text-sm font-bold text-white">
        <span className="truncate">{displayValue}</span>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 border-white/10 bg-[#0d1728] p-0 text-white"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button onClick={() => setOpen(false)}>
            <X className="h-4 w-4 text-white/50" />
          </button>
          <p className="text-sm font-bold">{t("chooseTime")}</p>
        </div>

        <div className="py-3 text-center">
          <p className="text-2xl font-extrabold text-white">
            {hour}:{minute} {t(period)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4">
          <div>
            <p className="mb-1 text-center text-xs text-white/40">
              {t("time")}
            </p>
            <WheelColumn
              items={periods}
              value={period}
              onChange={setPeriod}
              renderLabel={(p) => t(p)}
            />
          </div>
          <div>
            <p className="mb-1 text-center text-xs text-white/40">الساعة</p>
            <WheelColumn items={hours} value={hour} onChange={setHour} />
          </div>
          <div>
            <p className="mb-1 text-center text-xs text-white/40">الدقائق</p>
            <WheelColumn items={minutes} value={minute} onChange={setMinute} />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 p-4">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-amber-500 font-bold text-black hover:bg-amber-600"
          >
            {t("confirm")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="flex-1 text-white/70 hover:bg-white/5 hover:text-white"
          >
            {t("cancel")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
