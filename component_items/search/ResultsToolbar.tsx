"use client";

import { useTranslations } from "next-intl";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Rows3,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = "featured" | "priceLow" | "priceHigh" | "rating";
export type ViewMode = "grid" | "list";

interface ResultsToolbarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenFilters: () => void;
  whatsappNumber: string;
}

const sortLabelKey: Record<SortOption, string> = {
  featured: "sortFeatured",
  priceLow: "sortPriceLow",
  priceHigh: "sortPriceHigh",
  rating: "sortRating",
};

export function ResultsToolbar({
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenFilters,
  whatsappNumber,
}: ResultsToolbarProps) {
  const t = useTranslations("Filters");

  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1728] p-2">
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        {/* واتساب */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400 transition-colors hover:bg-green-500/20"
          aria-label="WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.15-.174.199-.297.298-.496.099-.198.05-.371-.05-.52-.099-.149-.888-2.14-1.216-2.906-.28-.657-.567-.567-.777-.577-.198-.01-.42-.01-.644-.01-.223 0-.586.083-.892.42-.297.32-1.147 1.122-1.147 2.734 0 1.613 1.171 3.169 1.334 3.388.164.223 2.28 3.478 5.522 4.741.774.294 1.377.47 1.848.6.777.222 1.485.19 2.043.115.622-.093 1.907-.78 2.176-1.535.27-.755.27-1.4.189-1.536-.08-.135-.297-.199-.594-.35z" />
            <path d="M12.05 2C6.53 2 2 6.53 2 12.05c0 1.98.58 3.83 1.58 5.4L2 22l4.65-1.53a10 10 0 0 0 5.4 1.58c5.52 0 10.05-4.53 10.05-10.05S17.57 2 12.05 2zm0 18.35c-1.67 0-3.24-.46-4.6-1.28l-.33-.2-3.43 1.13 1.13-3.34-.22-.34a8.3 8.3 0 0 1-1.3-4.57c0-4.6 3.75-8.35 8.35-8.35 4.6 0 8.35 3.75 8.35 8.35 0 4.6-3.75 8.35-8.35 8.35z" />
          </svg>
        </a>

        {/* زرار الفلاتر */}
        <Button
          variant="outline"
          onClick={onOpenFilters}
          className="gap-2 border-white/10 bg-transparent text-sm text-white hover:bg-white/5"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters")}
        </Button>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col sm:flex-row gap-3">
        {/* الفرز */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              className="gap-2 border-white/10 bg-transparent text-sm text-white hover:bg-white/5"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-white/50" />
              {t(sortLabelKey[sort])}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-white/10 bg-[#0d1728] text-white"
          >
            {Object.entries(sortLabelKey).map(([value, key]) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onSortChange(value as SortOption)}
                className="cursor-pointer text-sm hover:bg-white/5 focus:bg-white/5"
              >
                {t(key)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* تبديل شكل العرض */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 p-1">
          <button
            onClick={() => onViewChange("list")}
            className={`flex h-7 w-9 items-center justify-center rounded-md transition-colors ${
              view === "list"
                ? "bg-amber-500 text-black"
                : "text-white/50 hover:bg-white/5"
            }`}
          >
            <Rows3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange("grid")}
            className={`flex h-7 w-9 items-center justify-center rounded-md transition-colors ${
              view === "grid"
                ? "bg-amber-500 text-black"
                : "text-white/50 hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
