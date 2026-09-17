"use client";
import Image from "next/image";
import logo from "@/public/image/logo.png";
import { Link, usePathname } from "@/i18n/navigation";
import TopBar from "./TopBar";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useTranslations } from "next-intl";
import { CarTaxiFront, PlaneTakeoff, Bed } from "lucide-react";

const navLinks = [
  { key: "limousine", href: "/feature/lemozeen", icon: CarTaxiFront },
  { key: "fastTrack", href: "/feature/fast-track", icon: PlaneTakeoff },
  { key: "stays", href: "/feature/stays", icon: Bed },
] as const;

const TOPBAR_HEIGHT = 65;
const NAV_HEIGHT = 96;

export default function Header() {
  const isTopBarVisible = useScrollDirection();
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-50 w-full" style={{ height: NAV_HEIGHT }}>
      <div
        className="absolute inset-x-0 top-0 bg-[#111827] backdrop-blur transition-transform duration-300 ease-in-out"
        style={{
          transform: isTopBarVisible
            ? "translateY(0)"
            : `translateY(-${TOPBAR_HEIGHT}px)`,
        }}
      >
        <div className="flex items-center justify-between px-5">
          <div className="flex flex-col" style={{ height: NAV_HEIGHT }}>
            <div className="flex items-center gap-2 mt-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-15 w-15">
                  <Image src={logo} alt="" fill />
                </div>
                <span className="font-display text-xl font-semibold tracking-wide text-[#C9A96E]">
                  Masar
                </span>
              </Link>
            </div>
            <nav className="flex items-center gap-4 lg:hidden">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`mb-3 text-[12px] text-white/80 transition-colors hover:border-b-2 hover:border-[#C9A96E] ${
                      isActive ? "border-b-2 border-[#C9A96E] text-white" : ""
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </nav>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 py-3 text-sm uppercase text-white/50 hover:border-b hover:border-[#C9A96E] hover:text-white/90 ${
                    isActive ? "border-b border-[#C9A96E] text-white/90" : ""
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <p>{t(link.key)}</p>
                </Link>
              );
            })}
          </nav>

          <div style={{ height: TOPBAR_HEIGHT }}>
            <TopBar />
          </div>
        </div>
      </div>
    </header>
  );
}
