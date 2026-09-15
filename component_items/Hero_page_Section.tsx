"use client";

import { useLocale } from "next-intl";

interface HeroSectionProps {
  tagline: string;
  title: string;
  description: string;
  image?: string;
}

export function HeroSection({
  tagline,
  title,
  description,
  image = "/image/car_2.webp",
}: HeroSectionProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative flex min-h-[350px] w-full items-center  overflow-hidden bg-cover bg-center bg-no-repeat px-6 text-white md:min-h-[350px] md:px-16 border-y border-border"
      style={{ backgroundImage: `url('${image}')` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content Container */}
      <div
        className={`relative z-10 max-w-2xl space-y-3 md:space-y-4 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <span className="block text-xs font-light tracking-wide text-amber-400 md:text-sm">
          {tagline}
        </span>

        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="text-sm font-normal leading-relaxed text-gray-200 md:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
