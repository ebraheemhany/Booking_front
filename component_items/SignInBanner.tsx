"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Gift, KeyRound, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROMO_CODE = "WELCOME10";

export function SignInBanner() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("SignInBanner");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="w-full border-y border-amber-500/20 bg-[#0e1421] px-4 py-6 md:px-6">
      <div className="flex flex-col items-center  gap-6 md:flex-row md:items-center md:justify-between">
        {/* الجانب الأيمن (في RTL): الأيقونة والنص */}
        <div className="flex flex-col md:flex-row  items-center  gap-4">
          <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <Gift className="h-9 w-9 text-amber-400" />
          </div>

          <div className="w-full flex flex-col items-center md:items-start">
            <p className="mb-1 text-xs font-bold tracking-wide text-amber-400">
              {t("eyebrow")}
            </p>

            <h2 className="text-xl font-extrabold text-white md:text-3xl lg:text-4xl">
              {t("titleLine1")}{" "}
              <span className="text-amber-400">{t("titlePercent")}</span>
            </h2>

            <p className="mt-2 max-w-md text-center md:text-start text-sm md:text-md text-white/60 ">
              {t("description")}
            </p>

            <button
              onClick={handleCopy}
              className="mt-3 flex w-fit items-center gap-2 rounded-md border border-dashed border-amber-500/40 px-3 py-1.5 text-xs "
            >
              <span className="text-white/50">{t("useCodeLabel")}</span>
              <span className="font-bold text-amber-400">{PROMO_CODE}</span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-white/50" />
              )}
            </button>
          </div>
        </div>

        {/* أزرار إنشاء الحساب/تسجيل الدخول */}
        <div className="flex flex-col md:flex-row w-full items-center gap-3 md:w-auto">
          <Link
            href="/feature/register"
            className="w-full md:w-fit flex items-center justify-center flex-1 gap-2 rounded-lg bg-amber-500 font-bold text-black hover:bg-amber-600 md:flex-none py-2 px-3"
          >
            {t("createAccount")}
            <KeyRound className="h-4 w-4" />
          </Link>

          <Link
            href="/feature/login"
            className="w-full md:w-fit flex flex-1 items-center justify-center rounded-lg border border-amber-500/40 px-4 py-2 text-sm font-bold text-amber-400 transition-colors hover:bg-amber-500/10 md:flex-none"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </section>
  );
}
