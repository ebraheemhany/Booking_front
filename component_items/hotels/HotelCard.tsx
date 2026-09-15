"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";

export type RoomType =
  | "hotel"
  | "apartment"
  | "studio"
  | "villa"
  | "resort"
  | "chalet";

export interface RoomOption {
  id: string;
  name: { ar: string; en: string };
  sizeSqm: number;
  bedType: { ar: string; en: string };
  maxGuests: number;
  basePrice: number;
  breakfastPrice: number | null; // null لو مفيش خيار إفطار
  freeCancellation: boolean;
}

export interface HotelDetails extends HotelSpecs {
  images: string[]; // أول صورة = الغلاف
  rooms: RoomOption[];
  facilities: string[]; // نفس مفاتيح amenities
}
export interface HotelSpecs {
  id: string;
  name: { ar: string; en: string };
  location: { ar: string; en: string };
  roomType: RoomType;
  stars: number; // 1 إلى 5
  image: string;
  amenities: string[]; // مفاتيح زي "luggageRoom", "breakfast" ...
  pricePerNight: number;
}

export interface HotelCardData {
  specs: HotelSpecs;
}

const roomTypeLabelKey: Record<RoomType, string> = {
  hotel: "roomTypeHotel",
  apartment: "roomTypeApartment",
  studio: "roomTypeStudio",
  villa: "roomTypeVilla",
  resort: "roomTypeResort",
  chalet: "roomTypeChalet",
};

interface HotelCardProps {
  hotel: HotelCardData;
  layout?: "grid" | "list";
  onView: (id: string) => void;
}

export function HotelCard({ hotel, layout = "grid", onView }: HotelCardProps) {
  const t = useTranslations("Hotels");
  const locale = useLocale() as "ar" | "en";
  const { specs } = hotel;

  const { formattedPrice, currency, isLoading } = useConvertedPrice(
    specs.pricePerNight,
  );

  const starsRow = (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: specs.stars }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );

  if (layout === "list") {
    return (
      <button
        onClick={() => onView(specs.id)}
        className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0d1728] p-4 text-start transition-colors hover:bg-white/5"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={specs.image}
            alt={specs.name[locale]}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-white">
              {specs.name[locale]}
            </span>
            <span className="text-xs text-white/40">
              {t(roomTypeLabelKey[specs.roomType])}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
            <MapPin className="h-3 w-3" />
            {specs.location[locale]}
          </div>
          <div className="mt-1">{starsRow}</div>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-xs text-white/40">{t("perNight")}</p>
          <p className="text-base font-bold text-white">
            {isLoading ? "..." : `${formattedPrice} ${currency}`}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onView(specs.id)}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728] text-start transition-colors hover:bg-white/5"
    >
      <div className="relative h-40 w-full">
        <Image
          src={specs.image}
          alt={specs.name[locale]}
          fill
          className="object-cover"
        />
        <span className="absolute end-3 top-3 rounded-md bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {t(roomTypeLabelKey[specs.roomType])}
        </span>
      </div>

      <div className="p-4">
        <h3 className="mb-1 truncate text-base font-bold text-white">
          {specs.name[locale]}
        </h3>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-white/50">
          <MapPin className="h-3 w-3" />
          {specs.location[locale]}
        </div>
        {starsRow}

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-xs text-white/50">{t("perNight")}</span>
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
        </div>
      </div>
    </button>
  );
}
