"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Fraunces, IBM_Plex_Sans_Arabic } from "next/font/google";
import {
  Mail,
  Phone,
  BadgeCheck,
  Pencil,
  MapPin,
  CreditCard,
  Globe2,
  KeyRound,
  Plus,
  Trash2,
} from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
});

type Address = {
  id: string;
  label: string;
  detail: string;
  isDefault?: boolean;
};

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
};

type LoginMethod = {
  id: string;
  name: string;
  detail: string;
  connected: boolean;
  icon: "password" | "google" | "phone";
};

type CustomerProfile = {
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  memberSince: string;
  tier: string;
  avatarInitials: string;
  stats: { label: string; value: string }[];
  personal: { label: string; value: string }[];
  addresses: Address[];
  payments: PaymentMethod[];
  loginMethods: LoginMethod[];
};

const SAMPLE_PROFILE: CustomerProfile = {
  name: "إبراهيم هاني",
  email: "ebraheem.hany@example.com",
  emailVerified: true,
  phone: "01012345678+",
  phoneVerified: true,
  memberSince: "عضو منذ مارس 2025",
  tier: "عضوية فضية",
  avatarInitials: "إه",
  stats: [
    { label: "totalBookings", value: "14" },
    { label: "completedTrips", value: "11" },
    { label: "loyaltyPoints", value: "2,340" },
  ],
  personal: [
    { label: "fullName", value: "إبراهيم هاني محمد" },
    { label: "birthDate", value: "12 مايو 1999" },
    { label: "gender", value: "ذكر" },
    { label: "nationalId", value: "•••• •••• •••• 2841" },
    { label: "preferredLanguage", value: "العربية" },
    { label: "currency", value: "جنيه مصري (EGP)" },
  ],
  addresses: [
    {
      id: "a1",
      label: "home",
      detail: "مدينة نصر، القاهرة — شارع مكرم عبيد",
      isDefault: true,
    },
    { id: "a2", label: "work", detail: "الشيخ زايد، الجيزة — الحي المتميز" },
  ],
  payments: [
    {
      id: "p1",
      brand: "visa",
      last4: "4417",
      expiry: "08/28",
      isDefault: true,
    },
    { id: "p2", brand: "mastercard", last4: "9022", expiry: "01/27" },
  ],
  loginMethods: [
    {
      id: "m1",
      name: "password",
      detail: "passwordChanged",
      connected: true,
      icon: "password",
    },
    {
      id: "m2",
      name: "Google",
      detail: "ebraheem.hany@gmail.com",
      connected: true,
      icon: "google",
    },
    {
      id: "m3",
      name: "phone",
      detail: "otpVerification",
      connected: true,
      icon: "phone",
    },
  ],
};

const LOGIN_ICON = { password: KeyRound, google: Globe2, phone: Phone };

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTranslations("Profile");

  return (
    <div className="rounded border border-border bg-card px-5 py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold">{t(title)}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage({
  profile = SAMPLE_PROFILE,
}: {
  profile?: CustomerProfile;
}) {
  const [editingInfo, setEditingInfo] = useState(false);
  const t = useTranslations("Profile");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${plexArabic.variable} min-h-screen bg-background text-foreground`}
      style={{ fontFamily: "var(--font-plex-arabic), Tahoma, sans-serif" }}
    >
      <div className="mx-auto max-w-3xl px-5 py-8 pb-20">
        {/* Topbar */}
        <div className="mb-7 flex items-center justify-between border-b border-border pb-5">
          <span
            className="text-[22px] font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Masar<span className="text-primary">.</span>
          </span>
        </div>

        {/* Profile header */}
        <div className="mb-6 flex flex-col items-start gap-5 rounded border border-border bg-card px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full border border-border bg-accent text-[20px] font-semibold text-accent-foreground">
              {profile.avatarInitials}
            </span>
            <div>
              <div
                className="text-[20px] font-medium"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                {profile.name}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-muted-foreground">
                <span>{t("memberSince")}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[12px] font-semibold text-accent-foreground">
                  {t("tier")}
                </span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-[3px] border border-border bg-card px-4 py-2 text-[13.5px] font-medium hover:border-primary">
            <Pencil size={14} />
            {t("editPhoto")}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {profile.stats.map((s, i) => (
            <div
              key={i}
              className="rounded border border-border bg-card px-4 py-4 text-center"
            >
              <div className="text-[20px] font-semibold">{s.value}</div>
              <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                {t(s.label)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {/* Contact */}
          <SectionCard title="contactTitle">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-[3px] border border-border bg-muted px-4 py-3">
                <div className="flex items-center gap-2.5 text-[14px]">
                  <Mail size={16} className="text-muted-foreground" />
                  {profile.email}
                </div>
                {profile.emailVerified && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
                    <BadgeCheck size={14} />
                    {t("verified")}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[3px] border border-border bg-muted px-4 py-3">
                <div className="flex items-center gap-2.5 text-[14px]">
                  <Phone size={16} className="text-muted-foreground" />
                  {profile.phone}
                </div>
                {profile.phoneVerified && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
                    <BadgeCheck size={14} />
                    {t("verified")}
                  </span>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Personal info */}
          <SectionCard
            title="personalTitle"
            action={
              <button
                onClick={() => setEditingInfo((v) => !v)}
                className="flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline"
              >
                <Pencil size={13} />
                {editingInfo ? t("save") : t("edit")}
              </button>
            }
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {profile.personal.map((f, i) => (
                <div key={i}>
                  <div className="mb-1 text-[12px] text-muted-foreground">
                    {t(f.label)}
                  </div>
                  {editingInfo ? (
                    <input
                      defaultValue={f.value}
                      className="w-full rounded-[3px] border border-border bg-muted px-3 py-2 text-[14px] outline-none focus:border-primary"
                    />
                  ) : (
                    <div className="text-[14.5px] font-medium">{f.value}</div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Addresses */}
          <SectionCard
            title="addressesTitle"
            action={
              <button className="flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline">
                <Plus size={14} />
                {t("addAddress")}
              </button>
            }
          >
            <div className="flex flex-col gap-3">
              {profile.addresses.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-[3px] border border-border bg-muted px-4 py-3"
                >
                  <div className="flex items-start gap-2.5">
                    <MapPin
                      size={16}
                      className="mt-0.5 flex-none text-muted-foreground"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-[14px] font-medium">
                        {t(a.label)}
                        {a.isDefault && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                            {t("default")}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[13px] text-muted-foreground">
                        {a.detail}
                      </div>
                    </div>
                  </div>
                  <button className="text-destructive hover:opacity-70">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Payment methods */}
          <SectionCard
            title="paymentsTitle"
            action={
              <button className="flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline">
                <Plus size={14} />
                {t("addPayment")}
              </button>
            }
          >
            <div className="flex flex-col gap-3">
              {profile.payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-[3px] border border-border bg-muted px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={16} className="text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2 text-[14px] font-medium">
                        {t(p.brand)} •••• {p.last4}
                        {p.isDefault && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                            {t("default")}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[13px] text-muted-foreground">
                        {t("expiresOn")} {p.expiry}
                      </div>
                    </div>
                  </div>
                  <button className="text-destructive hover:opacity-70">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Login & security */}
          <SectionCard title="securityTitle">
            <div className="flex flex-col gap-3">
              {profile.loginMethods.map((m) => {
                const Icon = LOGIN_ICON[m.icon];
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-[3px] border border-border bg-muted px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-muted-foreground" />
                      <div>
                        <div className="text-[14px] font-medium">
                          {t(m.name)}
                        </div>
                        <div className="mt-0.5 text-[13px] text-muted-foreground">
                          {m.detail === "ebraheem.hany@gmail.com"
                            ? m.detail
                            : t(m.detail)}
                        </div>
                      </div>
                    </div>
                    {m.connected ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
                        <BadgeCheck size={14} />
                        {t("connected")}
                      </span>
                    ) : (
                      <button className="text-[13px] font-medium text-primary hover:underline">
                        {t("connect")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Danger zone */}
          <div className="flex items-center justify-between rounded border border-dashed border-border px-5 py-4">
            <div>
              <div className="text-[14px] font-medium">{t("deleteTitle")}</div>
              <div className="mt-0.5 text-[13px] text-muted-foreground">
                {t("deleteDescription")}
              </div>
            </div>
            <button className="rounded-[3px] border border-destructive px-4 py-2 text-[13.5px] font-medium text-destructive hover:bg-destructive/10">
              {t("deleteTitle")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
