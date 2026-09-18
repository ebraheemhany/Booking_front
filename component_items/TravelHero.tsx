"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Plane,
  CarFront,
  BedDouble,
  Ticket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function TravelHero() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("TravelHero");

  const CtaChevron = isArabic ? ChevronLeft : ChevronRight;

  const services = [
    {
      icon: Plane,
      title: t("services.airportPickup"),
      href: "/feature/fast-track",
    },
    {
      icon: CarFront,
      title: t("services.privateDriver"),
      href: "/feature/lemozeen",
    },
    {
      icon: BedDouble,
      title: t("services.curatedStays"),
      href: "/feature/stays",
    },
    {
      icon: Ticket,
      title: t("services.singlePayment"),
      href: "/feature/stays",
    },
  ];

  return (
    <section className="w-full py-14 text-foreground">
      <div className="sm:mx-6 flex flex-col items-center gap-12 px-6 lg:flex-row lg:justify-between lg:gap-16">
        {/* =========================
            جانب المحتوى
        ========================== */}
        <div className="w-full text-start lg:w-[48%]">
          {/* عنوان صغير */}
          <p className="mb-5 text-sm font-bold text-popover-foreground md:text-base">
            {t("eyebrow")}
          </p>

          {/* العنوان الرئيسي */}
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            {t("titleLine1")}
            <br />
            <span className="text-[#f5a623]">{t("titleHighlight")}</span>
          </h1>

          {/* الوصف */}
          <div className="flex justify-start">
            <p className="mt-6 w-[100%] sm:w-[65%] text-base sm:leading-8 text-gray-400 md:text-lg">
              {t("description")}
            </p>
          </div>

          {/* الزرار */}
          <Link
            href="/feature/stays"
            className="
              mt-7
              h-12
              min-w-[168px]
              w-full
              sm:w-[168px]
              rounded-md
              bg-[#f5a623]
              px-7
              text-base
              font-bold
              text-black
              transition-all
              hover:bg-[#ffb52e]
              hover:scale-[1.02]
              cursor-pointer
              flex items-center justify-center gap-2
            "
          >
            {t("cta")}
            <CtaChevron className="me-2 h-5 w-5" />
          </Link>
        </div>

        {/* =========================
            جانب الكارت
        ========================== */}
        <div className="w-full lg:w-[40%] bg-popover-background rounded-2xl shadow-lg border border-border">
          {/* الخدمات */}
          <div>
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Link
                  key={index}
                  href={service.href}
                  className="
                    flex items-center justify-between px-3 border-b border-border text-foreground hover:text-primary
                    hover:bg-[#2a303c] transition-all py-2
                    first:rounded-t-2xl cursor-pointer
                  "
                >
                  <div className="flex items-center gap-2 sm:gap-3 my-2">
                    {/* الأيقونة */}
                    <div
                      className="
                        flex h-6 w-6 sm:h-8 sm:w-8
                        shrink-0 items-center justify-center
                        rounded-md border border-[#424953] bg-[#11151b]
                      "
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-[#f5a623]" />
                    </div>

                    {/* النص */}
                    <p className=" flex-1 text-[11px] sm:text-sm font-semibold md:text-md">
                      {service.title}
                    </p>
                  </div>
                  {isArabic ? (
                    <ChevronLeft className="h-5 w-5 text-gray-400 transition-transform" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400 transition-transform" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* معلومات أسفل الكارت */}
          <div className="flex items-center gap-1  px-2 py-4">
            {/* النص */}
            <div className="relative h-12 w-12">
              <Image src="/image/logo.png" alt="logo" fill />
            </div>
            <p className="text-sm font-semibold text-gray-400">
              {t("sinceStat")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
