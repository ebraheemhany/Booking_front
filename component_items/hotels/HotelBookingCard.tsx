"use client";

import { useSelector } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import { format, differenceInCalendarDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  CreditCard,
  Wallet,
  MessageCircle,
  CalendarDays,
  Users,
} from "lucide-react";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";
import type { HotelDetails, RoomOption } from "./HotelCard";
import { useRouter } from "next/navigation";

interface HotelBookingCardProps {
  hotel: HotelDetails;
  selectedRoom?: RoomOption;
}

export function HotelBookingCard({
  hotel,
  selectedRoom,
}: HotelBookingCardProps) {
  const t = useTranslations("Hotels");
  const locale = useLocale() as "ar" | "en";
  const dateLocale = locale === "ar" ? ar : enUS;
  const router = useRouter();
  const staySearch = useSelector((state: RootState) => state.staySearch);

  const price = selectedRoom?.basePrice ?? hotel.pricePerNight;
  const { formattedPrice, currency, isLoading } = useConvertedPrice(price);

  const checkIn = staySearch.checkIn ? new Date(staySearch.checkIn) : null;
  const checkOut = staySearch.checkOut ? new Date(staySearch.checkOut) : null;
  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;

  const handleProceed = () => {
    if (!selectedRoom) return;
    router.push(`/feature/stays/${hotel.id}/checkOut?roomId=${selectedRoom.id}`);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1728] p-4">
      <h3 className="text-base font-bold text-white">{hotel.name[locale]}</h3>
      <p className="mt-1 text-xs text-white/50">
        {"★".repeat(hotel.stars)} {t("roomTypeHotel")}
      </p>

      {(checkIn || checkOut) && (
        <div className="mt-3 rounded-xl border border-white/10 p-3">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <CalendarDays className="h-3.5 w-3.5 text-amber-400" />
            <span>
              {checkIn && format(checkIn, "d MMMM", { locale: dateLocale })} –{" "}
              {checkOut && format(checkOut, "d MMMM", { locale: dateLocale })}
            </span>
          </div>
          {nights > 0 && (
            <p className="mt-1 text-[11px] text-white/40">
              {t("nightsCount", { count: nights })}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <Users className="h-3.5 w-3.5 text-amber-400" />
            <span>
              {t("guestsSummary", {
                adults: staySearch.adults,
                children: staySearch.children,
              })}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-xs text-white/40">{t("startingFrom")}</p>
        <p className="text-2xl font-bold text-white">
          {isLoading ? "..." : formattedPrice}{" "}
          <span className="text-sm font-normal text-white/60">
            {currency} / {t("perNight")}
          </span>
        </p>
      </div>

      <Button
        onClick={handleProceed}
        disabled={!selectedRoom}
        className="mt-4 h-12 w-full bg-amber-500 font-bold text-black hover:bg-amber-400 disabled:opacity-40"
      >
        {selectedRoom ? t("chooseRoom") : t("selectRoomFirst")}
      </Button>

      <p className="mt-2 text-center text-[11px] text-white/40">
        {t("noChargeYet")}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 border-t border-white/10 pt-3">
        <CreditCard className="h-4 w-4 text-white/40" />
        <Wallet className="h-4 w-4 text-white/40" />
      </div>
      <a
        href="https://wa.me/201234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 text-xs text-white/60 hover:text-white/80"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {t("contactConcierge")}
      </a>
    </div>
  );
}