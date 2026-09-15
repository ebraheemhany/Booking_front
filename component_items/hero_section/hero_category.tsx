"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useConvertedPrice } from "@/hooks/useConvertedPrice";
import { useLocale } from "next-intl";

interface Category {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface CategorySidebarProps {
  label: string;
  featuredTitle: string;
  featuredDescriptionPrefix: string;
  featuredPriceFrom: number;
  featuredPriceUnit: string;
  featuredIcon: React.ElementType;
  categories: Category[];
}

export function CategorySidebar({
  label,
  featuredTitle,
  featuredDescriptionPrefix,
  featuredPriceFrom,
  featuredPriceUnit,
  featuredIcon: FeaturedIcon,
  categories,
}: CategorySidebarProps) {
  const { convertedPrice, currency } = useConvertedPrice(featuredPriceFrom);
  const locale = useLocale();
  const isArabic = locale === "ar";
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-1 text-sm text-white/50">{label}</p>

      <button className="flex items-center justify-between gap-3 rounded-xl bg-[#101d33] p-3 text-start transition-colors hover:bg-[#152441]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
          <FeaturedIcon className="h-4 w-4 text-white/70" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{featuredTitle}</p>
          <p className="text-xs text-white/50">
            {featuredDescriptionPrefix}{" "}
            {convertedPrice.toLocaleString(undefined, {
              maximumFractionDigits: currency === "EGP" ? 0 : 2,
            })}{" "}
            {currency}/{featuredPriceUnit}
          </p>
        </div>
        {isArabic ? (
          <ChevronLeft className="h-4 w-4 shrink-0  text-white/40" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0  text-white/40" />
        )}
      </button>

      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.title}
            className="flex items-center justify-between gap-3 rounded-xl bg-[#0d1728] p-3 text-start transition-colors hover:bg-[#152441]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <Icon className="h-4 w-4 text-white/70" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{cat.title}</p>
              <p className="text-xs text-white/50">{cat.description}</p>
            </div>
            {/* <ChevronRight className="h-4 w-4 shrink-0  text-white/40" /> */}
            {isArabic ? (
              <ChevronLeft className="h-4 w-4 shrink-0  text-white/40" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0  text-white/40" />
            )}
          </button>
        );
      })}
    </div>
  );
}
