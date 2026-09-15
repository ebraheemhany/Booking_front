"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountries } from "@/hooks/useCountries";
import { dialCodes } from "./dialCodes";

interface PhoneCodeSelectProps {
  value: string; // dial code زي "+20"
  onChange: (code: string) => void;
}

const popularCodes = ["EG", "SA", "AE", "KW", "QA", "BH"];

export function PhoneCodeSelect({ value, onChange }: PhoneCodeSelectProps) {
  const t = useTranslations("Checkout");
  const countriesT = useTranslations();
  const locale = useLocale() as "ar" | "en";
  const [open, setOpen] = useState(false);
  const { countries, isLoading } = useCountries();

  const getName = (code: string, nameEn: string) => {
    if (locale === "ar") {
      const translated = countriesT(`countries.${code}`);
      return translated.startsWith("countries.") ? nameEn : translated;
    }
    return nameEn;
  };

  // بس الدول اللي عندنا ليها رمز اتصال معروف في dialCodes
  const availableCountries = useMemo(
    () => countries.filter((c) => dialCodes[c.code]),
    [countries],
  );

  const popularCountries = useMemo(
    () =>
      popularCodes
        .map((code) => availableCountries.find((c) => c.code === code))
        .filter(Boolean),
    [availableCountries],
  ) as typeof availableCountries;

  const selected = availableCountries.find((c) => dialCodes[c.code] === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex h-11 w-28 shrink-0 items-center justify-between gap-1.5 rounded-lg border px-2.5 text-sm font-bold text-white transition-colors ${
          open
            ? "border-amber-500/50 ring-2 ring-amber-500/20 bg-white/5"
            : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {selected && (
            <Image
              src={selected.flagUrl}
              alt={selected.code}
              width={18}
              height={13}
              unoptimized
              className="shrink-0 rounded-sm object-cover"
            />
          )}
          <span className="truncate">{value || "+20"}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-white/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-64 border-white/10 bg-[#0d1728] p-1.5 text-white"
      >
        {isLoading ? (
          <p className="px-3 py-4 text-center text-xs text-white/40">
            {t("loadingCountries")}
          </p>
        ) : (
          <div className="flex flex-col">
            {popularCountries.map((c) => {
              const dial = dialCodes[c.code];
              const isSelected = dial === value;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    onChange(dial);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${
                    isSelected
                      ? "bg-amber-500/10 font-bold text-amber-400"
                      : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Image
                      src={c.flagUrl}
                      alt={c.code}
                      width={18}
                      height={13}
                      unoptimized
                      className="shrink-0 rounded-sm object-cover"
                    />
                    <span>{getName(c.code, c.nameEn)}</span>
                  </span>
                  <span className="text-white/40">{dial}</span>
                </button>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
