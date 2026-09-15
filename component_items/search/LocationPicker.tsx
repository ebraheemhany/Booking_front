"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Compass, Map as MapIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { MapPickerDialog } from "./MapPickerDialog";

export interface LocationValue {
  address: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: LocationValue | null;
  onChange: (value: LocationValue) => void;
  placeholder?: string;
  label?: string;
}

export function LocationPicker({
  value,
  onChange,
  placeholder,
  label,
}: LocationPickerProps) {
  const t = useTranslations("SearchBar");
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`,
        {
          headers: {
            "User-Agent": "Masar-App/1.0",
          },
        },
      );
      const data = await res.json();
      return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t("locationNotSupported"));
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const address = await reverseGeocode(latitude, longitude);
        onChange({ address, lat: latitude, lng: longitude });
        setLocating(false);
        setOpen(false);
      },
      () => {
        setLocationError(t("locationDenied"));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleMapConfirm = (loc: LocationValue) => {
    onChange(loc);
    setMapOpen(false);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={`flex flex-1 items-center gap-3 px-4 py-3 text-start transition-colors ${
            open ? "ring-2 ring-inset ring-amber-500" : ""
          }`}
        >
          <MapPin className="h-4 w-4 shrink-0 text-white/30" />
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 truncate text-[11px] text-white/40">
              {label || t("destination")}
            </p>
            <p className="line-clamp-2 text-xs font-bold leading-snug text-white">
              {value?.address || placeholder || t("destinationPlaceholder")}
            </p>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-80 border-white/10 bg-[#0d1728] p-0 text-white"
        >
          <div className="border-b border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <MapPin className="h-4 w-4 shrink-0 text-white/40" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("destinationPlaceholder")}
                className="h-auto border-none bg-transparent p-0 text-sm text-white shadow-none placeholder:text-white/30 focus-visible:ring-0"
              />
            </div>
            {locationError && (
              <p className="mt-2 text-xs text-red-400">{locationError}</p>
            )}
          </div>

          <div className="flex flex-col divide-y divide-white/5">
            <button
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              <Compass className="h-4 w-4 shrink-0 text-amber-400" />
              {locating ? t("locating") : t("useCurrentLocation")}
            </button>
            <button
              onClick={() => {
                setMapOpen(true);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5"
            >
              <MapIcon className="h-4 w-4 shrink-0 text-amber-400" />
              {t("chooseFromMap")}
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <MapPickerDialog
        open={mapOpen}
        onOpenChange={setMapOpen}
        initialLocation={value}
        onConfirm={handleMapConfirm}
      />
    </>
  );
}
