"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ResultsToolbar,
  type SortOption,
  type ViewMode,
} from "../search/ResultsToolbar";
import { HotelCard, type HotelCardData } from "./HotelCard";
import { HotelFiltersSheet, type HotelFiltersState } from "./HotelFiltersSheet";
import type { RootState } from "@/store/store";

interface StayResultsPageProps {
  hotels: HotelCardData[];
  filters: HotelFiltersState;
  onFiltersChange: (filters: HotelFiltersState) => void;
  destination?: string;
}

export function StayResultsPage({
  hotels,
  filters,
  onFiltersChange,
  destination,
}: StayResultsPageProps) {
  const t = useTranslations("Hotels");
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<ViewMode>("grid");

  // ← بيانات البحث من Redux مباشرة
  const staySearch = useSelector((state: RootState) => state.staySearch);

  const hasSearched = Boolean(
    staySearch.destination && staySearch.checkIn && staySearch.checkOut,
  );

  const availableAmenities = useMemo(() => {
    const set = new Set<string>();
    hotels.forEach((h) => h.specs.amenities.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const { specs } = hotel;

      if (
        destination &&
        destination.toLowerCase() !== "anywhere" &&
        !specs.location.ar.includes(destination) &&
        !specs.location.en.toLowerCase().includes(destination.toLowerCase())
      ) {
        return false;
      }

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
      case "rating":
        return list.sort((a, b) => b.specs.stars - a.specs.stars);
      default:
        return list;
    }
  }, [filteredHotels, sort]);

  // ← المنع فعليًا هنا
  const handleView = (id: string) => {
    if (!hasSearched) {
      toast.error(t("searchRequired"));
      return;
    }
    router.push(`/feature/stays/${id}`);
  };

  return (
    <div className="space-y-4">
      <ResultsToolbar
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        onOpenFilters={() => setFiltersOpen(true)}
        whatsappNumber="201234567890"
      />

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
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
