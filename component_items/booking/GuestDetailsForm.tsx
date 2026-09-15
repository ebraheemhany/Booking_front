"use client";

import { useTranslations } from "next-intl";
import { User, Mail, Phone, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PhoneCodeSelect } from "./PhoneCodeSelect";
import { CountryPicker } from "./CountryPicker";

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string | null;
}

interface GuestDetailsFormProps {
  value: GuestDetails;
  onChange: (value: GuestDetails) => void;
}

const phoneCountries = [
  { code: "+20", flag: "🇪🇬", labelKey: "countryEgypt" },
  { code: "+966", flag: "🇸🇦", labelKey: "countrySaudi" },
  { code: "+971", flag: "🇦🇪", labelKey: "countryUAE" },
];

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-white/60">
      <Icon className="h-3.5 w-3.5 text-amber-400" />
      {children}
    </label>
  );
}

export function GuestDetailsForm({ value, onChange }: GuestDetailsFormProps) {
  const t = useTranslations("Checkout");

  const update = (patch: Partial<GuestDetails>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1728] p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">
          {t("guestDetailsTitle")}
        </h2>
        <p className="mt-1 text-xs text-white/40">
          {t("guestDetailsSubtitle")}
        </p>
      </div>

      {/* الاسم */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel icon={User}>{t("firstName")}</FieldLabel>
          <Input
            placeholder={t("firstNamePlaceholder")}
            value={value.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
          />
        </div>
        <div>
          <FieldLabel icon={User}>{t("lastName")}</FieldLabel>
          <Input
            placeholder={t("lastNamePlaceholder")}
            value={value.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
          />
        </div>
      </div>

      {/* فاصل خفيف */}
      <div className="my-5 border-t border-white/5" />

      {/* البريد والهاتف */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <FieldLabel icon={Mail}>{t("email")}</FieldLabel>
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={value.email}
            onChange={(e) => update({ email: e.target.value })}
            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
          />
          <p className="mt-1.5 text-[11px] text-white/30">{t("emailHint")}</p>
        </div>

        <div>
          <FieldLabel icon={Phone}>{t("phone")}</FieldLabel>
          <div className="flex gap-2">
            <PhoneCodeSelect
              value={value.countryCode}
              onChange={(countryCode) => update({ countryCode })}
            />
            <Input
              placeholder={t("phonePlaceholder")}
              value={value.phone}
              onChange={(e) => update({ phone: e.target.value })}
              className="h-11 flex-1 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
            />
          </div>
        </div>

        {/* الدولة */}
        <div>
          <FieldLabel icon={Globe}>{t("country")}</FieldLabel>
          <CountryPicker
            value={value.country}
            onChange={(country) => update({ country })}
          />
        </div>
      </div>
    </div>
  );
}
