"use client";

import { useTranslations } from "next-intl";
import { BedDouble, Sparkles, Images } from "lucide-react";

type TabKey = "rooms" | "facilities" | "photos";

interface HotelDetailsTabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function HotelDetailsTabs({ active, onChange }: HotelDetailsTabsProps) {
  const t = useTranslations("Hotels");

  const tabs: { key: TabKey; icon: React.ElementType; labelKey: string }[] = [
    { key: "rooms", icon: BedDouble, labelKey: "tabRooms" },
    { key: "facilities", icon: Sparkles, labelKey: "tabFacilities" },
    { key: "photos", icon: Images, labelKey: "tabPhotos" },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-white/10">
      {tabs.map(({ key, icon: Icon, labelKey }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm transition-colors ${
              isActive
                ? "border-amber-500 font-bold text-amber-400"
                : "border-transparent text-white/60 hover:text-white/80"
            }`}
          >
            <Icon className="h-4 w-4" />
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
