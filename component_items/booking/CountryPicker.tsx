"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Search, X, ChevronDown, Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useCountries } from "@/hooks/useCountries";

interface CountryPickerProps {
  value: string | null;
  onChange: (code: string) => void;
}

const popularCodes = ["EG", "SA", "AE", "KW", "QA", "BH"];

export function CountryPicker({ value, onChange }: CountryPickerProps) {
  const t = useTranslations("Checkout");
  const countriesT = useTranslations();
  const locale = useLocale() as "ar" | "en";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { countries, isLoading } = useCountries();

  // نجيب الاسم بالعربي من ملف الترجمة لو موجود، وإلا نرجع للاسم الإنجليزي من الـ API
  const getName = (c: { code: string; nameEn: string }) => {
    if (locale === "ar") {
      const translated = countriesT(`countries.${c.code}`);
      // next-intl بيرجّع المفتاح خام لو مش موجود، فنتأكد ونرجع الإنجليزي بدلها
      return translated.startsWith("countries.") ? c.nameEn : translated;
    }
    return c.nameEn;
  };

  const selected = countries.find((c) => c.code === value);

  const popularCountries = useMemo(
    () =>
      popularCodes
        .map((code) => countries.find((c) => c.code === code))
        .filter(Boolean),
    [countries],
  ) as typeof countries;

  const filtered = query
    ? countries.filter((c) =>
        getName(c).toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery("");
  };

  const listToShow = filtered ?? popularCountries;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-start transition-colors ${
          open
            ? "border-amber-500/50 ring-2 ring-amber-500/20"
            : "border-white/10 bg-white/5"
        }`}
      >
        <Globe className="h-4 w-4 shrink-0 text-white/30" />
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-[11px] text-white/40">
            {t("country")}
          </p>
          <p className="flex items-center gap-2 truncate text-sm font-bold text-white">
            {selected ? (
              <>
                <Image
                  src={selected.flagUrl}
                  alt={getName(selected)}
                  width={18}
                  height={13}
                  unoptimized
                  className="rounded-sm object-cover"
                />
                <span>{getName(selected)}</span>
              </>
            ) : (
              <span className="font-normal text-white/40">
                {t("selectCountry")}
              </span>
            )}
          </p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/40" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 border-white/10 bg-[#0d1728] p-0 text-white"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-sm font-bold">{t("country")}</p>
          <button onClick={() => setOpen(false)}>
            <X className="h-4 w-4 text-white/50" />
          </button>
        </div>

        <div className="border-b border-white/10 p-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchCountry")}
              className="h-auto border-none bg-transparent p-0 text-sm text-white shadow-none placeholder:text-white/30 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {isLoading ? (
            <p className="px-4 py-6 text-center text-sm text-white/40">
              {t("loadingCountries")}
            </p>
          ) : (
            <>
              {!query && (
                <p className="px-4 pt-3 pb-1 text-xs text-white/40">
                  {t("mostSelected")}
                </p>
              )}
              <div className="flex flex-col divide-y divide-white/5">
                {listToShow.map((country) => {
                  const isSelected = value === country.code;
                  return (
                    <button
                      key={country.code}
                      onClick={() => handleSelect(country.code)}
                      className={`flex items-center gap-3 px-4 py-3 text-start text-sm transition-colors hover:bg-white/5 ${
                        isSelected
                          ? "font-bold text-amber-400"
                          : "text-white/80"
                      }`}
                    >
                      <Image
                        src={country.flagUrl}
                        alt={getName(country)}
                        width={20}
                        height={14}
                        unoptimized
                        className="rounded-sm object-cover"
                      />
                      {getName(country)}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
