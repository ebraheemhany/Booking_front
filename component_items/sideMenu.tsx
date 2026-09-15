"use client";

import { Link } from "@/i18n/navigation";
import {
  CarTaxiFront,
  PlaneTakeoff,
  Bed,
  X,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

const navLinks = [
  { key: "limousine", href: "/limousine", icon: CarTaxiFront },
  { key: "fastTrack", href: "/fast-track", icon: PlaneTakeoff },
  { key: "stays", href: "/stays", icon: Bed },
] as const;

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "TikTok", href: "https://tiktok.com", icon: FaTiktok },
  { label: "X", href: "https://x.com", icon: FaXTwitter },
];

interface Props {
  trigger: React.ReactNode;
  lang: string;
  currency: string;
  onLanguageClick: () => void;
}

export default function SideMenu({
  trigger,
  lang,
  currency,
  onLanguageClick,
}: Props) {
  const t = useTranslations("Nav");
  const tMenu = useTranslations("SideMenu");

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] border-l border-[#C9A96E]/20 bg-[#0B1E3D] p-0 text-white [&>button]:hidden "
      >
        <div className="flex h-full flex-col">
          {/* Header جوه المنيو */}
          <div className="flex items-center justify-between border-b border-[#C9A96E]/15 px-6 py-6">
            <span className="font-display text-2xl font-semibold tracking-wide text-[#C9A96E]">
              Masar
            </span>
            <SheetTrigger asChild>
              <button className="text-white/60 transition-colors hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </SheetTrigger>
          </div>

          {/* روابط التنقل */}
          <nav className="flex flex-col gap-1 px-4 py-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-4 rounded-xl px-3 py-3.5 text-white/80 transition-all hover:bg-[#C9A96E]/10 hover:text-[#C9A96E]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-[#C9A96E]/15">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-sm font-medium tracking-wide">
                    {t(link.key)}
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-60" />
                </Link>
              );
            })}
          </nav>

          {/* فاصل ذهبي رفيع */}
          <div className="mx-6 my-2 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />

          {/* زرار اللغة والعملة */}
          <div className="px-4 pt-4">
            <button
              onClick={onLanguageClick}
              className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
                  🌐
                </span>
                <span className="font-medium tracking-wide">
                  {lang.toUpperCase()} - {currency}
                </span>
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Login / Register */}
          <div className="mt-auto flex flex-col gap-3 px-6 pt-6">
            <Link
              href="/feature/register"
              className="flex items-center justify-center rounded-full bg-[#C9A96E] px-4 py-2.5 text-sm font-semibold text-[#0B1E3D] transition-opacity hover:opacity-90"
            >
              {tMenu("createAccount")}
            </Link>
            <Link
              href="/feature/login"
              className="flex items-center justify-center rounded-full border border-[#C9A96E]/40 px-4 py-2.5 text-sm text-white/90 transition-colors hover:bg-[#C9A96E]/10"
            >
              {tMenu("login")}
            </Link>
          </div>

          {/* أيقونات السوشيال ميديا */}
          <div className="flex items-center justify-center gap-3 px-6 pb-6 pt-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:bg-[#C9A96E]/15 hover:text-[#C9A96E]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
