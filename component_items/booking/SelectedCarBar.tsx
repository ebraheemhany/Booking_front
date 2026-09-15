"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import type { CarSpecs } from "@/component_items/cars/CarCard";

interface SelectedCarBarProps {
  car: CarSpecs;
}

export function SelectedCarBar({ car }: SelectedCarBarProps) {
  const t = useTranslations("Booking");
  const locale = useLocale() as "ar" | "en";

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0d1728] px-4 py-3">
      <div className="text-end">
        <p className="text-[11px] text-white/40">{t("selectedCar")}</p>
        <p className="text-sm font-bold text-white">{car.name[locale]}</p>
      </div>
      <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={car.image}
          alt={car.name[locale]}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
