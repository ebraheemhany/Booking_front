"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const languageCodes = ["ar", "en", "ru", "de", "es", "uk", "pl"] as const;
const languageFlags: Record<(typeof languageCodes)[number], string> = {
  ar: "🇸🇦",
  en: "🇬🇧",
  ru: "🇷🇺",
  de: "🇩🇪",
  es: "🇪🇸",
  uk: "🇺🇦",
  pl: "🇵🇱",
};

const currencyCodes = ["USD", "EGP", "SAR", "EUR"] as const;
const currencyFlags: Record<(typeof currencyCodes)[number], string> = {
  USD: "🇺🇸",
  EGP: "🇪🇬",
  SAR: "🇸🇦",
  EUR: "🇪🇺",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lang: string, currency: string) => void;
  currentCurrency: string;
}

export default function LanguageCurrencyModal({
  open,
  onOpenChange,
  onSave,
  currentCurrency,
}: Props) {
  const t = useTranslations("LanguageModal");
  const locale = useLocale();

  const [selectedLang, setSelectedLang] = useState(locale);
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);

  function handleSave() {
    onSave(selectedLang, selectedCurrency);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 bg-background text-foreground">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-right text-lg text-foreground">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {/* اللغة */}
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            {t("languageLabel")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {languageCodes.map((code) => (
              <button
                key={code}
                onClick={() => setSelectedLang(code)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                  selectedLang === code
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {t(`languages.${code}`)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">{languageFlags[code]}</span>
                  {selectedLang === code && (
                    <Check className="h-4 w-4 shrink-0 text-amber-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* العملة */}
          <p className="mb-3 mt-6 text-sm font-medium text-muted-foreground">
            {t("currencyLabel")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {currencyCodes.map((code) => (
              <button
                key={code}
                onClick={() => setSelectedCurrency(code)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-right transition-colors ${
                  selectedCurrency === code
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currencyFlags[code]}</span>
                  <div className="flex flex-col items-start">
                    <div className="text-xs text-muted-foreground">
                      {t(`currencies.${code}`)}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {code}
                    </div>
                  </div>
                </div>
                <div>
                  {selectedCurrency === code && (
                    <Check className="h-4 w-4 shrink-0 text-amber-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button
            onClick={handleSave}
            className="flex-1 bg-amber-500 text-white hover:bg-amber-600"
          >
            {t("save")}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-amber-500/40 text-foreground hover:bg-amber-500/10"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
