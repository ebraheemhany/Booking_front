"use client";

import { useTranslations } from "next-intl";

export type BookingStep = 1 | 2 | 3 | 4;

const steps: { step: BookingStep; labelKey: string }[] = [
  { step: 4, labelKey: "stepReview" },
  { step: 3, labelKey: "stepCarDetails" },
  { step: 2, labelKey: "stepChooseCar" },
  { step: 1, labelKey: "stepTrip" },
];

interface BookingStepperProps {
  currentStep: BookingStep;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const t = useTranslations("Booking");

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {steps.map(({ step, labelKey }, i) => {
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                isActive
                  ? "bg-amber-500/10 font-bold text-amber-400"
                  : isDone
                    ? "text-white/50"
                    : "text-white/30"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-amber-500 text-black"
                    : "border border-white/20 text-white/40"
                }`}
              >
                {step}
              </span>
              {t(labelKey)}
            </div>
            {i < steps.length - 1 && <span className="h-px w-6 bg-white/10" />}
          </div>
        );
      })}
    </div>
  );
}
