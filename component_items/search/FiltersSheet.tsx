"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plane,
  CalendarClock,
  Briefcase,
  Accessibility,
  SlidersHorizontal,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type TripPriceFilter =
  | "all"
  | "arrival"
  | "departure"
  | "private"
  | "dailyRental";
export type CarCategory = "all" | "vip" | "standard" | "family" | "comfort";

export interface FiltersState {
  tripPrice: TripPriceFilter;
  carCategory: CarCategory;
  wheelchairAccessible: boolean;
  minBudget: number;
  maxBudget: number;
}

interface FiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  matchingCarsCount: number;
  histogram: number[]; // توزيع عدد السيارات على شرائح السعر، لعرض الأعمدة فوق السلايدر
  budgetMin: number;
  budgetMax: number;
}

const tripPriceOptions: { value: TripPriceFilter; icon: React.ElementType }[] =
  [
    { value: "all", icon: SlidersHorizontal },
    { value: "arrival", icon: Plane },
    { value: "departure", icon: Plane },
    { value: "dailyRental", icon: CalendarClock },
    { value: "private", icon: Briefcase },
  ];

const tripPriceLabelKey: Record<TripPriceFilter, string> = {
  all: "allPrices",
  arrival: "arrivalTrip",
  departure: "departureTrip",
  private: "privateTrip",
  dailyRental: "dailyRentalTrip",
};

const carCategoryOptions: CarCategory[] = [
  "all",
  "vip",
  "standard",
  "family",
  "comfort",
];
const carCategoryLabelKey: Record<CarCategory, string> = {
  all: "categoryAll",
  vip: "categoryVip",
  standard: "categoryStandard",
  family: "categoryFamily",
  comfort: "categoryComfort",
};

export function FiltersSheet({
  open,
  onOpenChange,
  filters,
  onChange,
  matchingCarsCount,
  histogram,
  budgetMin,
  budgetMax,
}: FiltersSheetProps) {
  const t = useTranslations("Filters");
  const maxBarHeight = Math.max(...histogram, 1);

  const update = (patch: Partial<FiltersState>) =>
    onChange({ ...filters, ...patch });

  const handleClearAll = () => {
    onChange({
      tripPrice: "all",
      carCategory: "all",
      wheelchairAccessible: false,
      minBudget: budgetMin,
      maxBudget: budgetMax,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-white/10 bg-[#0d1728] p-0 text-white sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/10 px-5 py-4">
          <SheetTitle className="text-white">{t("filters")}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {/* التسعير حسب المشوار */}
          <div>
            <p className="mb-3 text-sm font-bold text-white/80">
              {t("priceByTrip")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {tripPriceOptions.map(({ value, icon: Icon }) => {
                const isSelected = filters.tripPrice === value;
                return (
                  <button
                    key={value}
                    onClick={() => update({ tripPrice: value })}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 font-bold text-amber-400"
                        : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {t(tripPriceLabelKey[value])}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* فئة السيارة */}
          <div>
            <p className="mb-3 text-sm font-bold text-white/80">
              {t("carCategory")}
            </p>
            <div className="flex flex-wrap gap-2">
              {carCategoryOptions.map((value) => {
                const isSelected = filters.carCategory === value;
                return (
                  <button
                    key={value}
                    onClick={() => update({ carCategory: value })}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border-white bg-white font-bold text-black"
                        : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {t(carCategoryLabelKey[value])}
                  </button>
                );
              })}
            </div>
          </div>

          {/* إمكانية الوصول */}
          <div>
            <p className="mb-3 text-sm font-bold text-white/80">
              {t("accessibility")}
            </p>
            <button
              onClick={() =>
                update({ wheelchairAccessible: !filters.wheelchairAccessible })
              }
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                filters.wheelchairAccessible
                  ? "border-amber-500 bg-amber-500/10 font-bold text-amber-400"
                  : "border-white/10 text-white/70 hover:bg-white/5"
              }`}
            >
              <Accessibility className="h-4 w-4" />
              {t("wheelchairAccessible")}
            </button>
          </div>

          {/* الميزانية */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-white/80">{t("budget")}</p>
              <span className="text-xs text-white/50">
                {filters.minBudget.toLocaleString()}–
                {filters.maxBudget.toLocaleString()} EGP
              </span>
            </div>

            {/* Histogram */}
            <div className="mb-2 flex h-14 items-end gap-0.5">
              {histogram.map((count, i) => {
                const inRange =
                  budgetMin +
                    (i / histogram.length) * (budgetMax - budgetMin) >=
                    filters.minBudget &&
                  budgetMin +
                    (i / histogram.length) * (budgetMax - budgetMin) <=
                    filters.maxBudget;
                return (
                  <div
                    key={i}
                    style={{
                      height: `${Math.max((count / maxBarHeight) * 100, 6)}%`,
                    }}
                    className={`flex-1 rounded-sm ${inRange ? "bg-amber-500" : "bg-white/15"}`}
                  />
                );
              })}
            </div>

            <Slider
              min={budgetMin}
              max={budgetMax}
              step={100}
              value={[filters.minBudget, filters.maxBudget]}
              onValueChange={([min, max]) =>
                update({ minBudget: min, maxBudget: max })
              }
              className="mb-2"
            />

            <div className="mb-3 flex justify-between text-[11px] text-white/40">
              <span>{budgetMin.toLocaleString()}</span>
              <span>
                {Math.round((budgetMin + budgetMax) / 2).toLocaleString()}
              </span>
              <span>{budgetMax.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={filters.maxBudget}
                onChange={(e) => update({ maxBudget: Number(e.target.value) })}
                className="border-white/10 bg-white/5 text-center text-sm text-white"
              />
              <Button
                variant="ghost"
                onClick={handleClearAll}
                className="shrink-0 text-xs text-white/60 hover:bg-white/5 hover:text-white"
              >
                {t("resetBudget")}
              </Button>
              <Input
                type="number"
                value={filters.minBudget}
                onChange={(e) => update({ minBudget: Number(e.target.value) })}
                className="border-white/10 bg-white/5 text-center text-sm text-white"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
          <button
            onClick={handleClearAll}
            className="text-sm font-bold text-white/60 underline-offset-2 hover:underline"
          >
            {t("clearAllFilters")}
          </button>
          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-amber-500 font-bold text-black hover:bg-amber-400"
          >
            {t("showCars", { count: matchingCarsCount })}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
