"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { BlogCard } from "./BlogCard";

export function BlogCarousel() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("BlogSection");

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

  const posts = [
    {
      id: "roadTrip",
      image: "/image/travel_blog.png",
      badgeVariant: "gold" as const,
      href: "/blog/cairo-to-alamein-road-trip",
    },
    {
      id: "carGuide",
      image: "/image/car_4.jpg",
      badgeVariant: "gold" as const,
      href: "/blog/choosing-your-car-class",
    },
    {
      id: "airportGuide",
      image: "/image/air_1.jpg",
      badgeVariant: "green" as const,
      href: "/blog/egypt-evisa-2026",
    },
  ];

  const ReadAllArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="w-full bg-[#0a1120] px-4 py-14 md:px-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="text-start">
          <p className="mb-1 text-sm text-white/50">{t("eyebrow")}</p>
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            {t("title")}
          </h2>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-lg border-white/15 bg-transparent text-white hover:bg-white/5"
        >
          {t("readAll")}
          <ReadAllArrow className="h-4 w-4" />
        </Button>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ direction: isArabic ? "rtl" : "ltr", align: "start" }}
        className="w-full"
      >
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post.id} className="sm:basis-1/2 lg:basis-1/3">
              <BlogCard
                image={post.image}
                badgeLabel={t(`posts.${post.id}.badge`)}
                badgeVariant={post.badgeVariant}
                title={t(`posts.${post.id}.title`)}
                description={t(`posts.${post.id}.description`)}
                date={t(`dates.${post.id}`)}
                readLabel={t("readGuide")}
                href={post.href}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-6 flex items-center justify-center gap-3">
          <CarouselNext className="static h-8 w-8 translate-x-0 translate-y-0 border-white/10 bg-[#101d33] text-white hover:bg-[#152441]" />

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

          <CarouselPrevious className="static h-8 w-8 translate-x-0 translate-y-0 border-white/10 bg-[#101d33] text-white hover:bg-[#152441]" />
        </div>
      </Carousel>
    </section>
  );
}
