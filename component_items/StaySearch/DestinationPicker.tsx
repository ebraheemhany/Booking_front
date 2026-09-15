"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Globe, Mountain, Building2, Waves, Sun } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { popularDestinations } from "./destinationsData";

const iconMap = {
  mountain: Mountain,
  building: Building2,
  wave: Waves,
  sun: Sun,
};

export interface DestinationValue {
  key: string;
  label: string;
}

interface DestinationPickerProps {
  value: DestinationValue | null;
  onChange: (value: DestinationValue) => void;
}

export function DestinationPicker({ value, onChange }: DestinationPickerProps) {
  const t = useTranslations("StaySearch");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = popularDestinations.filter((d) =>
    t(`destinations.${d.key}.name`).toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelectAnywhere = () => {
    onChange({ key: "anywhere", label: t("anywhere") });
    setOpen(false);
  };

  const handleSelectDestination = (key: string) => {
    onChange({ key, label: t(`destinations.${key}.name`) });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex flex-1 items-center gap-3 px-4 py-3 text-start transition-colors ${
          open ? "ring-2 ring-inset ring-amber-500" : ""
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-white/30" />
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-[11px] text-white/40">
            {t("whereTo")}
          </p>
          <p className="truncate text-sm font-bold text-white">
            {value?.label ?? t("anywhere")}
          </p>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-96 border-white/10 bg-[#0d1728] p-0 text-white"
      >
        <div className="border-b border-white/10 p-4">
          <p className="mb-3 text-sm font-bold">{t("whereTo")}</p>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-auto border-none bg-transparent p-0 text-sm text-white shadow-none placeholder:text-white/30 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={handleSelectAnywhere}
            className="mb-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <Globe className="h-4 w-4 shrink-0 text-amber-400" />
            {t("anywhere")}
          </button>

          <p className="mb-2 text-xs text-white/40">
            {t("popularDestinations")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((dest) => {
              const Icon = iconMap[dest.icon];
              return (
                <button
                  key={dest.key}
                  onClick={() => handleSelectDestination(dest.key)}
                  className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 text-start transition-colors hover:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-bold text-white">
                      {t(`destinations.${dest.key}.name`)}
                    </p>
                    <p className="text-xs text-white/40">
                      {t(`destinations.${dest.key}.subtitle`)}
                    </p>
                  </div>
                  <Icon className="h-4 w-4 shrink-0 text-white/30" />
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
