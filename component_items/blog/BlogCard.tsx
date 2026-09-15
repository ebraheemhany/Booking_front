import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface BlogCardProps {
  image: string;
  badgeLabel: string;
  badgeVariant?: "gold" | "green";
  title: string;
  description: string;
  date: string;
  readLabel: string;
  href: string;
}

export function BlogCard({
  image,
  badgeLabel,
  badgeVariant = "gold",
  title,
  description,
  date,
  readLabel,
  href,
}: BlogCardProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <Card className="overflow-hidden border-none bg-[#101d33] p-0 text-white h-[350px]">
      <div className="relative h-44 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
        <Badge
          className={`absolute end-3 top-3 border-none px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
            badgeVariant === "green"
              ? "bg-emerald-950/70 text-emerald-200"
              : "bg-black/40 text-amber-200"
          }`}
        >
          {badgeLabel}
        </Badge>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="text-base font-bold leading-snug text-white">{title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            <Arrow className="h-4 w-4" />
            {readLabel}
          </Link>
          <span className="text-xs text-white/40">{date}</span>
        </div>
      </div>
    </Card>
  );
}
