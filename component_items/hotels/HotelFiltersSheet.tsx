"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RoomType } from "./HotelCard";

export interface HotelFiltersState {
  minStars: number | null;
  roomType: RoomType | "all";
  amenities: string[];
  minBudget: number;
  maxBudget: number;
}

const roomTypeOptions: { value: RoomType; labelKey: string }[] = [
  { value: "chalet", labelKey: "roomTypeChalet" },
  { value: "resort", labelKey: "roomTypeResort" },
  { value: "villa", labelKey: "roomTypeVilla" },
  { value: "studio", labelKey: "roomTypeStudio" },
  { value: "apartment", labelKey: "roomTypeApartment" },
  { value: "hotel", labelKey: "roomTypeHotel" },
];

const starOptions = [5, 4, 3];

interface HotelFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: HotelFiltersState;
  onChange: (filters: HotelFiltersState) => void;
  matchingCount: number;
  /** كل المرافق الموجودة فعليًا في بيانات الفنادق — بنستخرجها ديناميكيًا مش ثابتة */
  availableAmenities: string[];
}

export function HotelFiltersSheet({
  open,
  onOpenChange,
  filters,
  onChange,
  matchingCount,
  availableAmenities,
}: HotelFiltersSheetProps) {
  const t = useTranslations("Hotels");

  const update = (patch: Partial<HotelFiltersState>) =>
    onChange({ ...filters, ...patch });

  const toggleAmenity = (amenity: string) => {
    const has = filters.amenities.includes(amenity);
    update({
      amenities: has
        ? filters.amenities.filter((a) => a !== amenity)
        : [...filters.amenities, amenity],
    });
  };

  const clearAll = () => {
    onChange({
      minStars: null,
      roomType: "all",
      amenities: [],
      minBudget: filters.minBudget,
      maxBudget: filters.maxBudget,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto border-white/10 bg-[#0d1728] text-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
          <DialogTitle className="text-white">{t("refineResults")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* تصنيف النجوم */}
          <div>
            <p className="mb-2 text-sm font-bold text-white/80">
              {t("starRating")}
            </p>
            <div className="flex flex-wrap gap-2">
              {starOptions.map((stars) => {
                const isSelected = filters.minStars === stars;
                return (
                  <button
                    key={stars}
                    onClick={() =>
                      update({ minStars: isSelected ? null : stars })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 font-bold text-amber-400"
                        : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    + {stars} ★
                  </button>
                );
              })}
            </div>
          </div>

          {/* نوع الإقامة */}
          <div className="border-t border-white/5 pt-4">
            <p className="mb-2 text-sm font-bold text-white/80">
              {t("roomType")}
            </p>
            <div className="flex flex-wrap gap-2">
              {roomTypeOptions.map((option) => {
                const isSelected = filters.roomType === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      update({
                        roomType: isSelected ? "all" : option.value,
                      })
                    }
                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 font-bold text-amber-400"
                        : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* المرافق — مستخرجة ديناميكيًا من بيانات الفنادق */}
          {availableAmenities.length > 0 && (
            <div className="border-t border-white/5 pt-4">
              <p className="mb-2 text-sm font-bold text-white/80">
                {t("amenities")}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableAmenities.map((amenity) => {
                  const isSelected = filters.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 font-bold text-amber-400"
                          : "border-white/10 text-white/70 hover:bg-white/5"
                      }`}
                    >
                      {t(`amenity_${amenity}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-white/10 pt-4">
          <Button
            variant="outline"
            onClick={clearAll}
            className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
          >
            {t("clearAll")}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-amber-500 font-bold text-black hover:bg-amber-400"
          >
            {t("showResults", { count: matchingCount })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
