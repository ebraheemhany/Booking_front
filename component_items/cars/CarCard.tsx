"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { List, Users, Briefcase, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripPriceFilter } from "@/component_items/search/FiltersSheet";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";

export interface TripPricing {
  price: number;
  hoursIncluded?: number;
  kmIncluded?: number;
}

export interface CarSpecs {
  id: string;
  name: { ar: string; en: string };
  category: string;
  image: string;
  seats: number;
  luggage: number;
  hasPrivateDriver: boolean;
  wheelchairAccessible: boolean;
  whatsappNumber: string;
}

export interface CarPricing {
  arrival?: TripPricing;
  departure?: TripPricing;
  private?: TripPricing;
  dailyRental?: TripPricing;
}

export interface CarCardData {
  specs: CarSpecs;
  pricing: CarPricing;
}

interface CarCardProps {
  car: CarCardData;
  activeTripType: Exclude<TripPriceFilter, "all">;
  layout?: "grid" | "list";
  currency?: string;
  onViewSpecs: (carId: string) => void;
  onBookNow: (carId: string) => void;
}

const categoryLabelKey: Record<string, string> = {
  comfort: "categoryComfort",
  vip: "categoryVip",
  standard: "categoryStandard",
  family: "categoryFamily",
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.15-.174.199-.297.298-.496.099-.198.05-.371-.05-.52-.099-.149-.888-2.14-1.216-2.906-.28-.657-.567-.567-.777-.577-.198-.01-.42-.01-.644-.01-.223 0-.586.083-.892.42-.297.32-1.147 1.122-1.147 2.734 0 1.613 1.171 3.169 1.334 3.388.164.223 2.28 3.478 5.522 4.741.774.294 1.377.47 1.848.6.777.222 1.485.19 2.043.115.622-.093 1.907-.78 2.176-1.535.27-.755.27-1.4.189-1.536-.08-.135-.297-.199-.594-.35z" />
    <path d="M12.05 2C6.53 2 2 6.53 2 12.05c0 1.98.58 3.83 1.58 5.4L2 22l4.65-1.53a10 10 0 0 0 5.4 1.58c5.52 0 10.05-4.53 10.05-10.05S17.57 2 12.05 2zm0 18.35c-1.67 0-3.24-.46-4.6-1.28l-.33-.2-3.43 1.13 1.13-3.34-.22-.34a8.3 8.3 0 0 1-1.3-4.57c0-4.6 3.75-8.35 8.35-8.35 4.6 0 8.35 3.75 8.35 8.35 0 4.6-3.75 8.35-8.35 8.35z" />
  </svg>
);

export function CarCard({
  car,
  activeTripType,
  layout = "grid",
  onViewSpecs,
  onBookNow,
}: CarCardProps) {
  const t = useTranslations("CarCard");
  const tFilters = useTranslations("Filters");
  const locale = useLocale() as "ar" | "en";
  const { specs } = car;
  const tripPricing = car.pricing[activeTripType];

  const { formattedPrice, currency, isLoading } = useConvertedPrice(
    tripPricing?.price ?? 0,
  );

  const priceUnitLabel =
    tripPricing?.hoursIncluded && tripPricing?.kmIncluded
      ? t("priceUnitHourly", {
          hours: tripPricing.hoursIncluded,
          km: tripPricing.kmIncluded,
        })
      : t(`priceUnit_${activeTripType}`);

  const specTags = (
    <div className="flex items-center gap-2 text-xs text-white/70">
      <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5">
        <Users className="h-3.5 w-3.5 text-white/40" />
        {t("seatsCount", { count: specs.seats })}
      </span>
      <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5">
        <Briefcase className="h-3.5 w-3.5 text-white/40" />
        {t("luggageCount", { count: specs.luggage })}
      </span>
      {specs.hasPrivateDriver && (
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5">
          <User className="h-3.5 w-3.5 text-white/40" />
          {t("privateDriver")}
        </span>
      )}
    </div>
  );

  const whatsappButton = (
    <a
      href={`https://wa.me/${specs.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400 transition-colors hover:bg-green-500/20"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );

  // ── شكل الـ List (أفقي) — زي الصورة ──
  if (layout === "list") {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0d1728] p-4">
        {/* الاسم + المواصفات + زرار المواصفات */}
        <div className="flex flex-1 flex-col gap-2">
          <div>
            <span className="text-base font-bold text-white">
              {specs.name[locale]}
            </span>
            <span className="ms-2 text-xs text-white/40">
              {tFilters(categoryLabelKey[specs.category] ?? "categoryAll")}
            </span>
          </div>
          {specTags}
        </div>

        <button
          onClick={() => onViewSpecs(specs.id)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/5"
        >
          <List className="h-3.5 w-3.5" />
          {t("viewSpecs")}
        </button>

        {/* الصورة */}
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={specs.image}
            alt={specs.name[locale]}
            fill
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  // ── شكل الـ Grid (عمودي) — الأصلي ──
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728]">
      <div className="relative h-44 w-full">
        <Image
          src={specs.image}
          alt={specs.name[locale]}
          fill
          className="object-cover"
        />

        <span className="absolute end-3 top-3 rounded-md bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {tFilters(categoryLabelKey[specs.category] ?? "categoryAll")}
        </span>

        <button
          onClick={() => onViewSpecs(specs.id)}
          className="absolute bottom-3 start-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/90"
        >
          <List className="h-3.5 w-3.5" />
          {t("viewSpecs")}
        </button>
      </div>

      <div className="p-4">
        <h3 className="mb-3 text-base font-bold text-white">
          {specs.name[locale]}
        </h3>

        <div className="mb-4">{specTags}</div>

        <div className="mb-4 flex items-center justify-between border-t border-white/5 pt-3">
          {tripPricing ? (
            <>
              <span className="text-xs text-white/50">{priceUnitLabel}</span>
              <span className="text-lg font-bold text-white">
                {isLoading ? (
                  <span className="inline-block h-5 w-16 animate-pulse rounded bg-white/10" />
                ) : (
                  <>
                    {formattedPrice}{" "}
                    <span className="text-sm font-normal text-white/60">
                      {currency}
                    </span>
                  </>
                )}
              </span>
            </>
          ) : (
            <span className="text-xs text-white/40">
              {t("priceUnavailable")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {whatsappButton}
          <Button
            onClick={() => onBookNow(specs.id)}
            className="h-11 flex-1 gap-2 bg-white font-bold text-black hover:bg-white/90"
          >
            <Mail className="h-4 w-4" />
            {t("bookNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
