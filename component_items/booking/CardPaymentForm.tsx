"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";

export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

interface CardPaymentFormProps {
  value: CardDetails;
  onChange: (value: CardDetails) => void;
}

export function CardPaymentForm({ value, onChange }: CardPaymentFormProps) {
  const t = useTranslations("Payment");

  const update = (patch: Partial<CardDetails>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-3 rounded-xl border border-white/10 p-4">
      <div>
        <label className="mb-1.5 block text-xs text-white/50">
          {t("cardNumber")}
        </label>
        <div className="relative">
          <CreditCard className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            value={value.number}
            onChange={(e) => update({ number: e.target.value })}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="border-white/10 bg-white/5 ps-10 text-sm text-white placeholder:text-white/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-white/50">
          {t("cardholderName")}
        </label>
        <Input
          value={value.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder={t("cardholderNamePlaceholder")}
          className="border-white/10 bg-white/5 text-sm text-white placeholder:text-white/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs text-white/50">
            {t("expiry")}
          </label>
          <Input
            value={value.expiry}
            onChange={(e) => update({ expiry: e.target.value })}
            placeholder="MM/YY"
            maxLength={5}
            className="border-white/10 bg-white/5 text-sm text-white placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50">CVC</label>
          <Input
            value={value.cvc}
            onChange={(e) => update({ cvc: e.target.value })}
            placeholder="123"
            maxLength={3}
            className="border-white/10 bg-white/5 text-sm text-white placeholder:text-white/20"
          />
        </div>
      </div>
    </div>
  );
}
