"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  ResultsToolbar,
  type SortOption,
  type ViewMode,
} from "./ResultsToolbar";
import { FiltersSheet, type FiltersState } from "./FiltersSheet";
import { CarCard, type CarCardData } from "../cars/CarCard";
import { useRouter } from "next/navigation";

interface SearchResultsPageProps {
  cars: CarCardData[];
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  whatsappNumber: string;
  onBookNow: (car: CarCardData) => void;
}

export function SearchResultsPage({
  cars,
  filters,
  onFiltersChange,
  whatsappNumber,
  onBookNow,
}: SearchResultsPageProps) {
  const t = useTranslations("Filters");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<ViewMode>("grid");

  const router = useRouter();

  const activeTripType =
    filters.tripPrice === "all" ? "arrival" : filters.tripPrice;

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const price = car.pricing[activeTripType]?.price;
      if (price === undefined) return false;

      if (price < filters.minBudget || price > filters.maxBudget) return false;

      if (
        filters.carCategory !== "all" &&
        car.specs.category.toLowerCase() !== filters.carCategory
      )
        return false;

      if (filters.wheelchairAccessible && !car.specs.wheelchairAccessible)
        return false;

      return true;
    });
  }, [cars, activeTripType, filters]);

  const sortedCars = useMemo(() => {
    const list = [...filteredCars];
    switch (sort) {
      case "priceLow":
        return list.sort(
          (a, b) =>
            (a.pricing[activeTripType]?.price ?? 0) -
            (b.pricing[activeTripType]?.price ?? 0),
        );
      case "priceHigh":
        return list.sort(
          (a, b) =>
            (b.pricing[activeTripType]?.price ?? 0) -
            (a.pricing[activeTripType]?.price ?? 0),
        );
      default:
        return list;
    }
  }, [filteredCars, sort, activeTripType]);

  const histogram = useMemo(() => {
    const buckets = 16;
    const bucketSize = (filters.maxBudget - filters.minBudget) / buckets || 1;
    const counts = new Array(buckets).fill(0);

    cars.forEach((car) => {
      const price = car.pricing[activeTripType]?.price;
      if (price === undefined) return;
      const bucketIndex = Math.min(
        buckets - 1,
        Math.max(0, Math.floor((price - filters.minBudget) / bucketSize)),
      );
      counts[bucketIndex]++;
    });

    return counts;
  }, [cars, activeTripType, filters.minBudget, filters.maxBudget]);

  return (
    <div className="space-y-4 mx-auto my-4  w-[90%] ">
      <ResultsToolbar
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        onOpenFilters={() => setFiltersOpen(true)}
        whatsappNumber={whatsappNumber}
      />

      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onChange={onFiltersChange}
        matchingCarsCount={filteredCars.length}
        histogram={histogram}
        budgetMin={0}
        budgetMax={25000}
      />

      {sortedCars.length === 0 ? (
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
          {sortedCars.map((car) => (
            <CarCard
              key={car.specs.id}
              car={car}
              activeTripType={activeTripType}
              layout={view}
              onViewSpecs={(id) => router.push(`/feature/lemozeen/${id}`)}
              onBookNow={() => onBookNow(car)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
