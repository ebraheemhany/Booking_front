"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaysHeroProps {
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  description: string;
  cta: string;
}

export function StaysHero({
  image,
  imageAlt,
  badge,
  title,
  description,
  cta,
}: StaysHeroProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-bl from-teal-900/40 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 text-start">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          <MapPin className="h-3 w-3" />
          {badge}
        </span>

        <h1 className="text-3xl font-extrabold text-destructive-foreground md:text-4xl">
          {title}
          <br />
          <span className="text-teal-300">Masar</span>
        </h1>

        <p className="max-w-md text-sm text-white/70">{description}</p>

        <Button className="w-fit gap-2 rounded-lg bg-teal-500 px-5 text-white hover:bg-teal-600">
          {cta}
          <Arrow className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
