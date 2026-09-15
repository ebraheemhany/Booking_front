"use client";

import { useEffect, useState } from "react";
import { Menu, Cloud, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

import LanguageCurrencyModal from "./LanguageCurrencyModal";
import SideMenu from "./sideMenu";
import { useCurrency } from "./context/CurrencyContext";
import Link from "next/link";

export default function TopBar() {
  const t = useTranslations("TopBar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  const [now, setNow] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const dateFormatted = now
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now)
    : "";

  const timeFormatted = now
    ? new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now)
    : "";

  function handleSave(newLang: string, newCurrency: string) {
    setCurrency(newCurrency);
    router.replace(pathname, { locale: newLang });
  }

  return (
    <>
      <div className="w-full flex flex-col items-end gap-2 text-xs text-white/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-white/80 hover:bg-white/10"
          >
            {locale.toUpperCase()} - {currency}
            <ChevronDown className="h-3 w-3" />
          </button>

          <div className="min-[1026px]:hidden">
            <SideMenu
              trigger={
                <button
                  type="button"
                  className="text-white/80 hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </button>
              }
              lang={locale}
              currency={currency}
              onLanguageClick={() => setModalOpen(true)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6 md:mt-4">
          <Link
            href="/feature/login"
            className="hidden md:flex items-center gap-1 rounded-full border border-[#C9A96E]/30 px-3 py-1 text-[#C9A96E] transition-colors hover:bg-[#C9A96E]/10"
          >
            {t("login")}
          </Link>

          <div className="flex items-center gap-3">
            <span>{timeFormatted}</span>
            <span className="text-white/50">|</span>
            <span className="hidden md:flex">{dateFormatted}</span>
            <span className="text-white/50 hidden md:flex">|</span>
            <span>{t("cairo")}</span>
            <div className="flex items-center gap-1">
              <Cloud className="h-3.5 w-3.5" />
              <span>37°</span>
            </div>
          </div>
        </div>
      </div>

      <LanguageCurrencyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        currentCurrency={currency}
      />
    </>
  );
}
