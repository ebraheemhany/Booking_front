"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PaymentMethodSelector,
  type PaymentMethod,
} from "@/component_items/booking/PaymentMethodSelector";
import {
  CardPaymentForm,
  type CardDetails,
} from "@/component_items/booking/CardPaymentForm";

export default function PaymentPage() {
  const t = useTranslations("Payment");
  const router = useRouter();

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const isCardValid =
    method !== "card" ||
    (cardDetails.number.length >= 15 &&
      cardDetails.name.trim().length > 0 &&
      cardDetails.expiry.length === 5 &&
      cardDetails.cvc.length === 3);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // هنا هيتم نداء الـ API بتاع بوابة الدفع فعليًا لاحقًا
      console.log("Processing payment:", { method, cardDetails });
      await new Promise((r) => setTimeout(r, 1500));
      // بعد النجاح: التوجيه لصفحة تأكيد الحجز
      // router.push(`/feature/lemozeen/${id}/booking/success`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto w-full px-4 py-8 sm:w-[80%] md:w-[70%]">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* العنوان */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{t("title")}</h1>
          <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
        </div>

        {/* ملخص السعر المصغّر */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d1728] p-4">
          <span className="text-sm text-white/60">{t("amountDue")}</span>
          <span className="text-xl font-bold text-white">
            3,300 <span className="text-sm font-normal text-white/60">EGP</span>
          </span>
        </div>

        {/* اختيار طريقة الدفع */}
        <div>
          <p className="mb-2 text-sm font-bold text-white/80">
            {t("choosePaymentMethod")}
          </p>
          <PaymentMethodSelector value={method} onChange={setMethod} />
        </div>

        {/* فورم البطاقة — يظهر بس لو method === "card" */}
        {method === "card" && (
          <CardPaymentForm value={cardDetails} onChange={setCardDetails} />
        )}

        {/* رسالة توضيحية لطرق الدفع التانية */}
        {method === "wallet" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            {t("walletInstructions")}
          </div>
        )}
        {method === "cash" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            {t("cashInstructions")}
          </div>
        )}

        {/* ملاحظة أمان */}
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Lock className="h-3.5 w-3.5" />
          {t("securePaymentNote")}
        </div>

        {/* زرار الدفع */}
        <Button
          onClick={handlePay}
          disabled={!isCardValid || isProcessing}
          className="h-12 w-full gap-2 bg-amber-500 font-bold text-black hover:bg-amber-400 disabled:opacity-40"
        >
          <ShieldCheck className="h-4 w-4" />
          {isProcessing ? t("processing") : t("payNow")}
        </Button>
      </div>
    </div>
  );
}
