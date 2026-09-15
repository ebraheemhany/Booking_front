"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { format, differenceInCalendarDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Star, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";
import type { HotelDetails, RoomOption } from "../hotels/HotelCard";

interface MasarBookingSummaryProps {
  hotel: HotelDetails;
  room: RoomOption;
  checkIn: Date | null;
  checkOut: Date | null;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function MasarBookingSummary({
  hotel,
  room,
  checkIn,
  checkOut,
  onConfirm,
  isSubmitting,
}: MasarBookingSummaryProps) {
  const t = useTranslations("Checkout");
  const locale = useLocale() as "ar" | "en";
  const dateLocale = locale === "ar" ? ar : enUS;

  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 1;
  const totalPrice = room.basePrice * nights;
  const { formattedPrice, currency, isLoading } = useConvertedPrice(totalPrice);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728]">
      {/* شريط علوي بهوية مسار */}
      <div className="bg-gradient-to-l from-amber-500 to-amber-400 px-5 py-2.5">
        <p className="flex items-center gap-1.5 text-xs font-bold text-black">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("masarGuarantee")}
        </p>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <Image
              src="/image/hotal_1.jpg"
              alt={hotel.name[locale]}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">
              {hotel.name[locale]}
            </h3>
            <div className="mt-0.5 flex items-center gap-1">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 p-3">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{t("checkIn")}</span>
            <span className="font-bold text-white">
              {checkIn
                ? format(checkIn, "d MMMM", { locale: dateLocale })
                : "—"}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-white/60">
            <span>{t("checkOut")}</span>
            <span className="font-bold text-white">
              {checkOut
                ? format(checkOut, "d MMMM", { locale: dateLocale })
                : "—"}
            </span>
          </div>
          <div className="mt-2 border-t border-white/5 pt-2 text-xs text-white/40">
            {t("nightsAndRoom", { nights, room: room.name[locale] })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-white/60">{t("total")}</span>
          <span className="text-2xl font-bold text-white">
            {isLoading ? "..." : formattedPrice}{" "}
            <span className="text-sm font-normal text-white/60">
              {currency}
            </span>
          </span>
        </div>

        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="mt-4 h-12 w-full bg-amber-500 font-bold text-black hover:bg-amber-400 disabled:opacity-40"
        >
          {isSubmitting ? t("confirming") : t("confirmBooking")}
        </Button>

        <p className="mt-2 text-center text-[11px] text-white/40">
          {t("noChargeYet")}
        </p>

        <a
          href="https://wa.me/201234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 border-t border-white/10 pt-3 text-xs text-white/60 hover:text-white/80"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {t("contactConcierge")}
        </a>
      </div>
    </div>
  );
}
