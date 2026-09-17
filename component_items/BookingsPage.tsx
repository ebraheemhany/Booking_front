"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Fraunces, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Car, Plane, Building2, ArrowLeft } from "lucide-react";

/**
 * Fonts — put this in your root layout if you already load fonts there,
 * or keep it here and spread `fraunces.variable` / `plexArabic.variable`
 * on <html> / <body>.
 */
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

type Status = "upcoming" | "done" | "cancelled";

type Booking = {
  id: string;
  refNumber: string;
  service: string;
  icon: "car" | "plane" | "hotel";
  status: Status;
  from: { label: string; value: string };
  to: { label: string; value: string };
  meta: { label: string; value: string }[];
  price: number;
  actions: { label: string; variant?: "primary" | "ghost" | "default" }[];
};

const STATUS_LABEL: Record<Status, string> = {
  upcoming: "statusUpcoming",
  done: "statusDone",
  cancelled: "statusCancelled",
};

const STATUS_CLASSES: Record<Status, string> = {
  upcoming: "bg-accent text-accent-foreground",
  done: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const ICONS = {
  car: Car,
  plane: Plane,
  hotel: Building2,
};

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "1",
    refNumber: "MSR-10432",
    service: "ليموزين مطار",
    icon: "car",
    status: "upcoming",
    from: { label: "من", value: "مطار القاهرة الدولي — T2" },
    to: { label: "إلى", value: "مدينة نصر، القاهرة" },
    meta: [
      { label: "الأحد، 27 سبتمبر", value: "موعد الاستلام 6:45 مساءً" },
      { label: "مرسيدس E-Class", value: "سائق: كريم فتحي" },
      { label: "4 ركاب", value: "حقيبتان كبيرتان" },
    ],
    price: 850,
    actions: [
      { label: "تفاصيل", variant: "default" },
      { label: "إلغاء الحجز", variant: "ghost" },
    ],
  },
  {
    id: "2",
    refNumber: "MSR-10461",
    service: "تأجير سيارة",
    icon: "car",
    status: "upcoming",
    from: { label: "استلام", value: "فرع مسار — الشيخ زايد" },
    to: { label: "تسليم", value: "فرع مسار — التجمع الخامس" },
    meta: [
      { label: "3 – 6 أكتوبر", value: "3 أيام إيجار" },
      { label: "هيونداي توسان 2025", value: "ناقل أوتوماتيك" },
      { label: "تأمين شامل", value: "مضاف للحجز" },
    ],
    price: 2970,
    actions: [
      { label: "تفاصيل", variant: "default" },
      { label: "إلغاء الحجز", variant: "ghost" },
    ],
  },
  {
    id: "3",
    refNumber: "MSR-09877",
    service: "فاست تراك — وصول",
    icon: "plane",
    status: "done",
    from: { label: "من", value: "الطائرة — بوابة B14" },
    to: { label: "إلى", value: "صالة الوصول — الجوازات" },
    meta: [
      { label: "14 سبتمبر", value: "الساعة 11:20 مساءً" },
      { label: "مرافق واحد", value: "استقبال داخل الطائرة" },
      { label: "تقييمك", value: "★★★★★" },
    ],
    price: 1200,
    actions: [
      { label: "الفاتورة", variant: "default" },
      { label: "احجز تاني", variant: "default" },
    ],
  },
  {
    id: "4",
    refNumber: "MSR-09512",
    service: "إقامة فندقية",
    icon: "hotel",
    status: "cancelled",
    from: { label: "فندق", value: "ستيجن الجيزة بيراميدز" },
    to: { label: "غرفة", value: "ديلوكس — إطلالة أهرامات" },
    meta: [
      { label: "ليلتان", value: "2 – 4 سبتمبر" },
      { label: "تم الإلغاء", value: "قبل الموعد بـ5 أيام" },
      { label: "استرداد المبلغ", value: "تم بالكامل" },
    ],
    price: 1650,
    actions: [
      { label: "تفاصيل", variant: "default" },
      { label: "احجز تاني", variant: "default" },
    ],
  },
];

const TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "tabAll" },
  { key: "upcoming", label: "tabUpcoming" },
  { key: "done", label: "tabDone" },
  { key: "cancelled", label: "tabCancelled" },
];

export default function BookingsPage({
  bookings = SAMPLE_BOOKINGS,
  userName = "إبراهيم هاني",
}: {
  bookings?: Booking[];
  userName?: string;
}) {
  const [tab, setTab] = useState<"all" | Status>("all");
  const t = useTranslations("Bookings");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const filtered =
    tab === "all" ? bookings : bookings.filter((b) => b.status === tab);

  const countFor = (key: "all" | Status) =>
    key === "all"
      ? bookings.length
      : bookings.filter((b) => b.status === key).length;

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
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span>{userName}</span>
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-accent text-sm font-semibold text-accent-foreground">
              {userName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
          </div>
        </div>

        {/* Page head */}
        <div className="mb-6">
          <h1
            className="mb-1.5 text-[32px] font-medium leading-tight"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            {t("title")}
          </h1>
          <p className="text-[15px] text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-0 border-b border-border">
          {TABS.map((tabOption) => (
            <button
              key={tabOption.key}
              onClick={() => setTab(tabOption.key)}
              className={`ml-5 border-b-2 py-2.5 text-[14.5px] transition-colors ${
                tab === tabOption.key
                  ? "border-primary font-semibold text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {t(tabOption.label)}
              <span className="ms-1.5 text-xs text-muted-foreground">
                {countFor(tabOption.key)}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded border border-dashed border-border px-5 py-16 text-center text-muted-foreground">
            <h3 className="mb-1.5 font-semibold text-foreground">
              {t("emptyTitle")}
            </h3>
            <p className="text-sm">{t("emptyDescription")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((b) => {
              const Icon = ICONS[b.icon];
              const isCancelled = b.status === "cancelled";
              return (
                <div
                  key={b.id}
                  className="rounded border border-border bg-card px-5 py-5"
                >
                  {/* top */}
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Icon size={17} strokeWidth={1.8} />
                      </span>
                      <div>
                        <div className="text-[15.5px] font-semibold">
                          {b.service}
                        </div>
                        <div className="mt-0.5 text-[13px] text-muted-foreground">
                          {t("bookingNumber", { ref: b.refNumber })}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[12.5px] font-semibold ${STATUS_CLASSES[b.status]}`}
                    >
                      {t(STATUS_LABEL[b.status])}
                    </span>
                  </div>

                  {/* route */}
                  <div
                    className={`mb-4 grid grid-cols-1 items-center gap-2.5 rounded-[3px] border border-dashed border-border bg-muted px-4 py-3.5 text-center sm:grid-cols-[1fr_auto_1fr] sm:text-start ${
                      isCancelled ? "opacity-60" : ""
                    }`}
                  >
                    <div className="text-sm sm:text-right">
                      <span className="mb-0.5 block text-[11px] text-muted-foreground">
                        {b.from.label}
                      </span>
                      {b.from.value}
                    </div>
                    <div className="mx-auto flex min-w-17.5 items-center justify-center gap-1 text-primary">
                      <span className="min-w-8.5 flex-1 border-t-2 border-dotted border-border" />
                      <ArrowLeft size={15} className="flex-none rotate-180" />
                    </div>
                    <div className="text-sm sm:text-left">
                      <span className="mb-0.5 block text-[11px] text-muted-foreground">
                        {b.to.label}
                      </span>
                      {b.to.value}
                    </div>
                  </div>

                  {/* meta */}
                  <div
                    className={`mb-4 flex flex-wrap gap-5 border-b border-border pb-4 text-[13.5px] text-muted-foreground ${
                      isCancelled ? "opacity-60" : ""
                    }`}
                  >
                    {b.meta.map((m, i) => (
                      <div key={i}>
                        <b className="mb-0.5 block text-[14px] font-semibold text-foreground">
                          {m.label}
                        </b>
                        {m.value}
                      </div>
                    ))}
                  </div>

                  {/* bottom */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[17px] font-semibold">
                      {b.price.toLocaleString("ar-EG")}{" "}
                      <small className="text-[12.5px] font-normal text-muted-foreground">
                        ج.م
                      </small>
                    </div>
                    <div className="flex gap-2">
                      {b.actions.map((a, i) => (
                        <button
                          key={i}
                          className={`rounded-[3px] border px-4 py-2 text-[13.5px] font-medium transition-colors ${
                            a.variant === "ghost"
                              ? "border-transparent text-destructive hover:border-destructive"
                              : "border-border bg-card text-foreground hover:border-primary"
                          }`}
                        >
                          {t(
                            `action${a.label === "تفاصيل" ? "Details" : a.label === "إلغاء الحجز" ? "Cancel" : a.label === "الفاتورة" ? "Invoice" : "BookAgain"}`,
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
