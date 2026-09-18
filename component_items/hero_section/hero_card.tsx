import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

import { useConvertedPrice } from "@/hooks/useConvertedPrice";

interface OfferCardProps {
  image: string;
  badgeLabel: string;
  title: string;
  subtitle?: string;
  rating?: number;
  priceFrom: number;
  priceUnit: string;
  ctaLabel: string;
  bookingHref: string;
}

export function HotelCard({
  image,
  badgeLabel,
  title,
  subtitle,
  rating,
  priceFrom,
  priceUnit,

  ctaLabel,
  bookingHref,
}: OfferCardProps) {
  const { convertedPrice, currency } = useConvertedPrice(priceFrom);
  return (
    <Card className="overflow-hidden border-none bg-[#101d33] p-0 text-white">
      <div className="relative h-20 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
        <Badge className="absolute end-1.5 top-1.5 bg-background text-[9px] font-normal text-foreground backdrop-blur-sm">
          {badgeLabel}
        </Badge>
      </div>

      <div className="space-y-1 p-2">
        <h3 className="truncate text-xs font-semibold text-white">{title}</h3>

        {rating ? (
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 fill-amber-400" />
            ))}
          </div>
        ) : subtitle ? (
          <p className="truncate text-[10px] text-white/50">{subtitle}</p>
        ) : null}

        <p className="text-[10px] text-white/50">
          من{" "}
          <span className="text-sm font-bold text-white">
            {convertedPrice.toLocaleString(undefined, {
              maximumFractionDigits: currency === "EGP" ? 0 : 2,
            })}
          </span>{" "}
          {currency}/{priceUnit}
        </p>

        <Link
          className="flex h-7 w-full items-center justify-center gap-1 rounded-md bg-teal-500 text-xs font-medium text-white hover:bg-teal-600"
          href={bookingHref}
        >
          {ctaLabel}
        </Link>
      </div>
    </Card>
  );
}
