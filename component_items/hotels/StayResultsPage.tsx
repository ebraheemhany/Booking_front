"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  Rows3,
  ArrowUpDown,
} from "lucide-react";
import { HotelCard, type HotelCardData } from "./HotelCard";
import { HotelFiltersSheet, type HotelFiltersState } from "./HotelFiltersSheet";

type SortOption = "featured" | "priceLow" | "priceHigh";
type ViewMode = "grid" | "list";

interface StayResultsPageProps {
  hotels: HotelCardData[];
  filters: HotelFiltersState;
  onFiltersChange: (filters: HotelFiltersState) => void;
}

export function StayResultsPage({
  hotels,
  filters,
  onFiltersChange,
}: StayResultsPageProps) {
  const t = useTranslations("Hotels");
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<ViewMode>("grid");

  // نستخرج كل المرافق الفريدة الموجودة فعليًا في بيانات الفنادق
  const availableAmenities = useMemo(() => {
    const set = new Set<string>();
    hotels.forEach((h) => h.specs.amenities.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const { specs } = hotel;

      if (
        specs.pricePerNight < filters.minBudget ||
        specs.pricePerNight > filters.maxBudget
      )
        return false;

      if (filters.minStars && specs.stars < filters.minStars) return false;

      if (filters.roomType !== "all" && specs.roomType !== filters.roomType)
        return false;

      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((a) => specs.amenities.includes(a))
      )
        return false;

      return true;
    });
  }, [hotels, filters]);

  const sortedHotels = useMemo(() => {
    const list = [...filteredHotels];
    switch (sort) {
      case "priceLow":
        return list.sort(
          (a, b) => a.specs.pricePerNight - b.specs.pricePerNight,
        );
      case "priceHigh":
        return list.sort(
          (a, b) => b.specs.pricePerNight - a.specs.pricePerNight,
        );
      default:
        return list;
    }
  }, [filteredHotels, sort]);

  return (
    <div className="space-y-4">
      {/* التولبار */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("filter")}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSort((s) => (s === "featured" ? "priceLow" : "featured"))
              }
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white/80 hover:bg-white/5"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {t(`sort_${sort}`)}
            </button>

            <div className="hidden sm:flex items-center rounded-lg border border-white/10">
              <button
                onClick={() => setView("list")}
                className={`flex h-9 w-9 items-center justify-center ${
                  view === "list" ? "bg-amber-400 rounded-lg text-black" : ""
                }`}
              >
                <Rows3 className="h-4 w-4 " />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`flex h-9 w-9 items-center justify-center ${
                  view === "grid" ? "bg-amber-400 rounded-lg text-black" : ""
                }`}
              >
                <LayoutGrid className="h-4 w-4 " />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <span className="text-sm font-bold text-amber-500 ">
            {t("stayCount", { count: sortedHotels.length })}
          </span>
          <div className="flex sm:hidden items-center rounded-lg border border-white/10">
            <button
              onClick={() => setView("list")}
              className={`flex h-9 w-9 items-center justify-center ${
                view === "list" ? "bg-amber-400 rounded-lg text-black" : ""
              }`}
            >
              <Rows3 className="h-4 w-4 " />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex h-9 w-9 items-center justify-center ${
                view === "grid" ? "bg-amber-400 rounded-lg text-black" : ""
              }`}
            >
              <LayoutGrid className="h-4 w-4 " />
            </button>
          </div>
        </div>
      </div>

      <HotelFiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onChange={onFiltersChange}
        matchingCount={filteredHotels.length}
        availableAmenities={availableAmenities}
      />

      {sortedHotels.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/50">
          {t("noResults")}
        </p>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              : "flex flex-col gap-4"
          }
        >
          {sortedHotels.map((hotel) => (
            <HotelCard
              key={hotel.specs.id}
              hotel={hotel}
              layout={view}
              onView={(id) => router.push(`/feature/stays/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
