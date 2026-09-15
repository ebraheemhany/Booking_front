"use client";

import { useSelector } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  CalendarDays,
  Users,
  User,
  Mail,
  Phone,
  Star,
  Download,
  Globe,
} from "lucide-react";
import type { RootState } from "@/store/store";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";
import { generateReceiptPdf } from "@/component_items/booking/generateReceiptPdf";
import { useCountries } from "@/hooks/useCountries";

export default function ConfirmationPage() {
  const t = useTranslations("Checkout");
  const hotelsT = useTranslations("Hotels");
  const countriesT = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  const { countries } = useCountries();
  const confirmed = useSelector((state: RootState) => state.confirmedStay);
  const { formattedPrice, currency, isLoading } = useConvertedPrice(
    confirmed.totalPrice ?? 0,
  );

  if (!confirmed.bookingRef) {
    return (
      <div className="mx-auto w-full px-4 py-16 text-center">
        <p className="text-white/60">{t("noConfirmedBooking")}</p>
        <Link
          href="/feature/stays"
          className="mt-4 inline-block text-sm font-bold text-amber-400 hover:underline"
        >
          {t("backToSearch")}
        </Link>
      </div>
    );
  }

  const checkIn = confirmed.checkIn ? new Date(confirmed.checkIn) : null;
  const checkOut = confirmed.checkOut ? new Date(confirmed.checkOut) : null;
  const guest = confirmed.guestDetails;

  //   generate pdf
  const handleDownloadReceipt = async () => {
    if (!confirmed.bookingRef || !guest) return;

    await generateReceiptPdf({
      bookingRef: confirmed.bookingRef,
      hotelName: confirmed.hotelName ?? "",
      roomName: confirmed.roomName ?? "",
      hotelStars: confirmed.hotelStars ?? 0,
      checkIn,
      checkOut,
      nights: confirmed.nights ?? 0,
      adults: confirmed.adults ?? 0,
      children: confirmed.children ?? 0,
      totalPrice: confirmed.totalPrice ?? 0,
      currency: "EGP", // أو currency الفعلية لو متاحة عندك كمتغير
      guestName: `${guest.firstName} ${guest.lastName}`,
      guestEmail: guest.email,
      guestPhone: `${guest.countryCode} ${guest.phone}`,
      guestCountry:
        countries.find((c) => c.code === guest.country)?.nameEn ??
        guest.country ??
        "-",
    });
  };
  return (
    <div className="mx-auto w-full px-4 py-10 sm:w-[85%] lg:w-[65%]">
      {/* رأس التأكيد */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <CheckCircle2 className="h-9 w-9 text-amber-400" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          {t("bookingConfirmedTitle")}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {t("bookingRef", { ref: confirmed.bookingRef })}
        </p>
      </div>

      {/* بطاقة الفندق والحجز */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728]">
        <div className="flex items-center gap-4 border-b border-white/10 p-5">
          {confirmed.hotelImage && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={confirmed.hotelImage}
                alt={confirmed.hotelName ?? ""}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-white">
              {confirmed.hotelName}
            </h2>
            <div className="mt-1 flex items-center gap-1">
              {Array.from({ length: confirmed.hotelStars ?? 0 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-white/40">{confirmed.roomName}</p>
          </div>
        </div>

        {/* التواريخ والضيوف */}
        <div className="grid grid-cols-1 divide-y divide-white/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:divide-x-reverse">
          <div className="flex items-center gap-3 p-5">
            <CalendarDays className="h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-xs text-white/40">{t("checkIn")}</p>
              <p className="text-sm font-bold text-white">
                {checkIn
                  ? format(checkIn, "d MMMM yyyy", { locale: dateLocale })
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-5">
            <CalendarDays className="h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-xs text-white/40">{t("checkOut")}</p>
              <p className="text-sm font-bold text-white">
                {checkOut
                  ? format(checkOut, "d MMMM yyyy", { locale: dateLocale })
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-white/5 p-5">
          <Users className="h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <p className="text-xs text-white/40">{t("guests")}</p>
            <p className="text-sm font-bold text-white">
              {hotelsT("guestsSummary", {
                adults: confirmed.adults ?? 0,
                children: confirmed.children ?? 0,
              })}
            </p>
          </div>
        </div>

        {/* الإجمالي */}
        <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] p-5">
          <span className="text-sm text-white/60">{t("total")}</span>
          <span className="text-xl font-bold text-white">
            {isLoading ? "..." : formattedPrice}{" "}
            <span className="text-sm font-normal text-white/60">
              {currency}
            </span>
          </span>
        </div>
      </div>

      {/* بيانات صاحب الحجز */}
      {guest && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1728] p-5">
          <h3 className="mb-4 text-base font-bold text-white">
            {t("guestDetailsTitle")}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <User className="h-3.5 w-3.5 text-white/40" />
              {guest.firstName} {guest.lastName}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Mail className="h-3.5 w-3.5 text-white/40" />
              {guest.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Phone className="h-3.5 w-3.5 text-white/40" />
              {guest.countryCode} {guest.phone}
            </div>
            {guest.country && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Globe className="h-3.5 w-3.5 text-white/40" />
                {countriesT(`countries.${guest.country}`)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* أزرار */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleDownloadReceipt}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-white hover:bg-white/5"
        >
          <Download className="h-4 w-4" />
          {t("downloadReceipt")}
        </button>
        <Link
          href="/"
          className="flex flex-1 items-center justify-center rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400"
        >
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
