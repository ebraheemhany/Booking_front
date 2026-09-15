"use client";

import { useTranslations } from "next-intl";
import { CreditCard, Wallet, Banknote, Check } from "lucide-react";

export type PaymentMethod = "card" | "wallet" | "cash";

const methods: { value: PaymentMethod; icon: React.ElementType }[] = [
  { value: "card", icon: CreditCard },
  { value: "wallet", icon: Wallet },
  { value: "cash", icon: Banknote },
];

const methodLabelKey: Record<PaymentMethod, string> = {
  card: "payByCard",
  wallet: "payByWallet",
  cash: "payByCash",
};
const methodDescKey: Record<PaymentMethod, string> = {
  card: "payByCardDesc",
  wallet: "payByWalletDesc",
  cash: "payByCashDesc",
};

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  const t = useTranslations("Payment");

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      {methods.map(({ value: optionValue, icon: Icon }, i) => {
        const isSelected = value === optionValue;
        return (
          <button
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={`flex w-full items-center justify-between px-4 py-3.5 text-start transition-colors ${
              i > 0 ? "border-t border-white/5" : ""
            } ${isSelected ? "bg-amber-500/10" : "hover:bg-white/5"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-white/5 text-white/50"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p
                  className={`text-sm font-bold ${isSelected ? "text-amber-400" : "text-white"}`}
                >
                  {t(methodLabelKey[optionValue])}
                </p>
                <p className="mt-0.5 text-xs text-white/40">
                  {t(methodDescKey[optionValue])}
                </p>
              </div>
            </div>
            {isSelected && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500">
                <Check className="h-3 w-3 text-black" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
