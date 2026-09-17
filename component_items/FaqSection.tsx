"use client";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questionKeys = [
  "howToBook",
  "aiTripPlanner",
  "airportPickup",
  "carClasses",
  "hireDriver",
  "englishDrivers",
  "flightTickets",
  "northCoastTrips",
  "trustScore",
  "arabicSupport",
] as const;

export function FaqSection() {
  const t = useTranslations("FaqSection");

  // نقسم الأسئلة على عمودين بالتساوي
  const half = Math.ceil(questionKeys.length / 2);
  const columns = [questionKeys.slice(0, half), questionKeys.slice(half)];

  return (
    <section className="w-full bg-[#0a1120] px-4 py-14 md:px-6">
      <h2 className="mb-8 text-2xl font-extrabold text-white md:text-3xl">
        {t("title")}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {columns.map((column, colIndex) => (
          <Accordion
            key={colIndex}
            className="space-y-3"
          >
            {column.map((key) => (
              <AccordionItem
                key={key}
                value={key}
                className="overflow-hidden rounded-xl border-none bg-[#101d33]"
              >
                <AccordionTrigger className="group px-4 py-4 text-start text-sm font-bold text-white hover:no-underline md:text-base [&>svg]:hidden">
                  <span className="flex-1">{t(`questions.${key}.q`)}</span>
                  <Plus className="h-4 w-4 shrink-0 text-amber-400 transition-transform duration-200 group-data-[state=open]:rotate-45" />
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-white/60">
                  {t(`questions.${key}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ))}
      </div>
    </section>
  );
}
