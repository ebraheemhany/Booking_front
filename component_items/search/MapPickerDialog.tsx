"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { LocationValue } from "./LocationPicker";
import "@/lib/leaflet-icon-fix";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

interface MapPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLocation: LocationValue | null;
  onConfirm: (loc: LocationValue) => void;
}

const DEFAULT_CENTER: [number, number] = [30.0444, 31.2357]; // القاهرة

// كومبوننت داخلي بيتتبع تحرك مركز الخريطة (بديل onCenterChanged بتاع Google)
function MapCenterTracker({
  onMoveEnd,
}: {
  onMoveEnd: (lat: number, lng: number) => void;
}) {
  const [MapEvents, setMapEvents] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapEvents(() => mod.useMapEvents);
    });
  }, []);

  if (!MapEvents) return null;

  return <MapEventsListener useMapEvents={MapEvents} onMoveEnd={onMoveEnd} />;
}

function MapEventsListener({
  useMapEvents,
  onMoveEnd,
}: {
  useMapEvents: any;
  onMoveEnd: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    moveend: (e: any) => {
      const center = e.target.getCenter();
      onMoveEnd(center.lat, center.lng);
    },
  });
  return null;
}

export function MapPickerDialog({
  open,
  onOpenChange,
  initialLocation,
  onConfirm,
}: MapPickerDialogProps) {
  const t = useTranslations("SearchBar");
  const [center, setCenter] = useState<[number, number]>(
    initialLocation
      ? [initialLocation.lat, initialLocation.lng]
      : DEFAULT_CENTER,
  );
  const [address, setAddress] = useState(initialLocation?.address ?? "");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`,
        { headers: { "User-Agent": "Masar-App/1.0" } },
      );
      const data = await res.json();
      setAddress(data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const handleCenterChanged = (lat: number, lng: number) => {
    setCenter([lat, lng]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => reverseGeocode(lat, lng), 400);
  };

  const handleConfirm = () => {
    onConfirm({ address, lat: center[0], lng: center[1] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[600px] max-w-2xl flex-col gap-0 overflow-hidden border-white/10 bg-[#0d1728] p-0 text-white">
        <div className="relative flex-1">
          <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenterTracker onMoveEnd={handleCenterChanged} />
          </MapContainer>

          {/* الدبوس ثابت في نص الشاشة — الخريطة هي اللي بتتحرك تحته */}
          <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
            <MapPin className="-mt-8 h-9 w-9 fill-amber-500 text-amber-500 drop-shadow-lg" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#0d1728] px-4 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
              <MapPin className="h-4 w-4 text-amber-400" />
            </div>
            <p className="truncate text-sm text-white/80">
              {loadingAddress
                ? t("locating")
                : address || t("destinationPlaceholder")}
            </p>
          </div>
          <Button
            onClick={handleConfirm}
            disabled={loadingAddress || !address}
            className="shrink-0 bg-amber-500 font-bold text-black hover:bg-amber-400"
          >
            {t("confirmLocation")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
