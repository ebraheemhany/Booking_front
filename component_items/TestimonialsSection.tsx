"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const reviewKeys = ["sara", "ahmed", "layla", "khalid", "andrew"] as const;

const avatarColors = [
  "bg-amber-500/20 text-amber-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-sky-500/20 text-sky-400",
  "bg-rose-500/20 text-rose-400",
  "bg-violet-500/20 text-violet-400",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function TestimonialsSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("TestimonialsSection");

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  useEffect(() => {
    if (!api) return;

    queueMicrotask(() => {
      setScrollSnaps(api.scrollSnapList());
      setSelectedIndex(api.selectedScrollSnap());
    });

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="w-full bg-[#0a1120] px-4 py-16 md:px-6">
      <div className="mb-10 text-start">
        <p className="mb-2 text-xs font-bold tracking-widest text-amber-400">
          {t("eyebrow")}
        </p>
        <h2 className="text-2xl font-extrabold leading-tight text-white md:text-4xl">
          {t("title")}
        </h2>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ direction: isArabic ? "rtl" : "ltr", align: "start" }}
        className="w-full"
      >
        <CarouselContent>
          {reviewKeys.map((key, index) => (
            <CarouselItem
              key={key}
              className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card className="relative flex h-full flex-col gap-4 overflow-hidden border border-white/5 bg-[#101d33] p-5">
                <Quote className="absolute -end-2 -top-2 h-16 w-16 text-white/5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColors[index % avatarColors.length]}`}
                    >
                      {getInitials(t(`reviews.${key}.name`))}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {t(`reviews.${key}.name`)}
                      </p>
                      <p className="text-xs text-white/40">
                        {t(`reviews.${key}.date`)}
                      </p>
                    </div>
                  </div>

                  {/* <FcGoogle className="h-5 w-5 shrink-0" /> */}
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="line-clamp-4 text-sm leading-relaxed text-white/70">
                  {t(`reviews.${key}.text`)}
                </p>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-8 flex items-center justify-center gap-3">
          <CarouselPrevious className="static h-8 w-8 translate-x-0 translate-y-0 border-white/10 bg-[#101d33] text-white hover:bg-[#152441]" />

          <div className="flex items-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`اذهب إلى الشريحة ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? "w-6 bg-amber-400"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <CarouselNext className="static h-8 w-8 translate-x-0 translate-y-0 border-white/10 bg-[#101d33] text-white hover:bg-[#152441]" />
        </div>
      </Carousel>

      <p className="mt-8 text-xs text-white/30">{t("footerNote")}</p>
    </section>
  );
}
