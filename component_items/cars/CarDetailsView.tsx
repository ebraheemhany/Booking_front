"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Briefcase, Users, User, Tag, Check, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";
import type { CarSpecs, CarPricing } from "./CarCard";
import type { TripPriceFilter } from "@/component_items/search/FiltersSheet";
import Link from "next/link";

const categoryLabelKey: Record<string, string> = {
  comfort: "categoryComfort",
  vip: "categoryVip",
  standard: "categoryStandard",
  family: "categoryFamily",
};

interface CarDetailsViewProps {
  specs: CarSpecs;
  pricing: CarPricing;
  activeTripType: Exclude<TripPriceFilter, "all">;
  images: string[];
  description: string;
  bookingsCount: number;
  isMostRequested?: boolean;
  onBookNow: () => void;
}

export function CarDetailsView({
  specs,
  pricing,
  activeTripType,
  images,
  description,
  bookingsCount,
  isMostRequested,
  onBookNow,
}: CarDetailsViewProps) {
  const t = useTranslations("CarDetails");
  const tCarCard = useTranslations("CarCard");
  const tFilters = useTranslations("Filters");
  const locale = useLocale() as "ar" | "en";
  const [activeImage, setActiveImage] = useState(0);

  const tripPricing = pricing[activeTripType];
  const { formattedPrice, currency, isLoading } = useConvertedPrice(
    tripPricing?.price ?? 0,
  );

  return (
    <div className=" flex flex-col gap-3">
      {/* اسم السيارة */}
      <div className="">
        <h1 className="text-2xl font-bold text-white">{specs.name[locale]}</h1>
        <p className="text-sm text-white/40">
          {tFilters(categoryLabelKey[specs.category] ?? "categoryAll")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* العمود الأيمن — البطاقة الجانبية */}
        <div className="order-2 h-fit space-y-4 rounded-2xl border border-white/10 bg-[#0d1728] p-5 lg:order-1">
          {/* السعر */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                {isLoading ? (
                  <span className="inline-block h-8 w-24 animate-pulse rounded bg-white/10" />
                ) : (
                  <>
                    <span className="text-3xl font-bold text-white">
                      {formattedPrice}
                    </span>
                    <span className="text-sm font-normal text-white/60">
                      {currency}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs text-white/40">{t("perDay")}</span>
            </div>
            <span className="text-xs text-white/40">{t("startingFrom")}</span>
          </div>

          {bookingsCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60">
              <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
              {t("bookedCount", { count: bookingsCount })}
            </div>
          )}

          <div className="h-px bg-white/5" />

          {/* المواصفات */}
          <div>
            <p className="mb-3 text-xs text-white/40">{t("specs")}</p>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 py-3">
                <Briefcase className="h-4 w-4 text-white/50" />
                <span className="text-sm font-bold text-white">
                  {specs.luggage}
                </span>
                <span className="text-[11px] text-white/50">
                  {t("luggage")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 py-3">
                <Users className="h-4 w-4 text-white/50" />
                <span className="text-sm font-bold text-white">
                  {specs.seats}
                </span>
                <span className="text-[11px] text-white/50">{t("seats")}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-1.5 text-white/50">
                  <User className="h-3.5 w-3.5" />
                  {t("driver")}
                </span>
                <span className="font-bold text-white">
                  {specs.hasPrivateDriver
                    ? t("driverIncluded")
                    : t("driverNotIncluded")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-1.5 text-white/50">
                  <Tag className="h-3.5 w-3.5" />
                  {t("category")}
                </span>
                <span className="font-bold text-white">
                  {tFilters(categoryLabelKey[specs.category] ?? "categoryAll")}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* السعر + زرار الحجز */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">{t("startingFrom")}</span>
            {isLoading ? (
              <span className="inline-block h-5 w-20 animate-pulse rounded bg-white/10" />
            ) : (
              <span className="text-sm font-bold text-white">
                {formattedPrice} {currency}
              </span>
            )}
          </div>

          <Link
            href={`/feature/lemozeen/${specs.id}/booking`}
            onClick={onBookNow}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-bold text-black transition-colors hover:bg-amber-400"
          >
            <Check className="h-4 w-4" />
            {t("bookThisCar")}
          </Link>
        </div>

        {/* العمود الأيسر — الصور والوصف */}
        <div className="order-1 space-y-4 lg:order-2">
          {/* الصورة الرئيسية */}
          <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 md:h-96">
            <Image
              src={images[activeImage]}
              alt={specs.name[locale]}
              fill
              className="object-cover"
            />
            {isMostRequested && (
              <span className="absolute start-4 top-4 rounded-md bg-amber-500 px-3 py-1 text-xs font-bold text-black">
                {t("mostRequested")}
              </span>
            )}
          </div>

          {/* صور مصغرة (thumbnails) لو فيه أكتر من صورة */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-11 w-15 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i
                      ? "border-amber-500"
                      : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* الوصف */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1728] p-5">
            <p className="mb-3 text-xs font-bold text-white/40">{t("note")}</p>
            <p className="text-sm leading-relaxed text-white/70">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
