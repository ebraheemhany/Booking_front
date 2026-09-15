"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import {
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa6";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "Snapchat", href: "https://snapchat.com", icon: FaSnapchat },
  { label: "TikTok", href: "https://tiktok.com", icon: FaTiktok },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
];

export function NightsHero() {
  const t = useTranslations("NightsHero");

  return (
    <section className="relative h-[420px] w-full overflow-hidden border-y border-amber-500/30 md:h-[460px]">
      <Image
        src="/image/hero_2.jpg"
        alt={t("title")}
        fill
        className="object-cover"
        priority
      />

      {/* تظليل غامق فوق الصورة لتحسين وضوح النص */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6 md:px-10">
        <div>
          <h1 className="text-2xl font-extrabold uppercase leading-tight text-white md:text-3xl">
            {t("title")}
          </h1>
          <div className="mt-3 h-1 w-16 bg-amber-500" />
        </div>

        <p className="max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
          {t("description")}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://wa.me/201234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-emerald-400"
          >
            <FaWhatsapp className="h-4 w-4" />
            {t("chatWithUs")}
          </a>

          <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <Users className="h-4 w-4 text-amber-400" />
            {t("trustedBy")}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold tracking-wide text-amber-400">
            {t("followUs")}
          </p>

          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
