"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Users, Route } from "lucide-react";
import type { LocationValue } from "@/component_items/search/LocationPicker";
import type { TripType } from "./TripDetailsStep";
import "@/lib/leaflet-icon-fix";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const FitBoundsOnRoute = dynamic(
  () => import("./FitBoundsOnRoute").then((m) => m.FitBoundsOnRoute),
  { ssr: false },
);
const MapResizeHandler = dynamic(
  () => import("./MapResizeHandler").then((m) => m.MapResizeHandler),
  { ssr: false },
);

const tripTypeLabelKey: Record<TripType, string> = {
  arrival: "tripArrival",
  departure: "tripDeparture",
  private: "tripPrivate",
  dailyRental: "tripDailyRental",
};

const DEFAULT_CENTER: [number, number] = [26.8206, 30.8025];
const DEFAULT_ZOOM = 6;
const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const CARTO_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

interface TripMapPanelProps {
  tripType: TripType | null;
  pointA: LocationValue | null;
  pointB: LocationValue | null;
  passengers: number;
  whatsappNumber: string;
  onNext: () => void;
  onBack?: () => void;
  onDistanceCalculated?: (km: number | null) => void;
}

export function TripMapPanel({
  tripType,
  pointA,
  pointB,
  passengers,
  whatsappNumber,
  onNext,
  onBack,
  onDistanceCalculated,
}: TripMapPanelProps) {
  const t = useTranslations("Booking");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [tileUrl, setTileUrl] = useState(OSM_TILE_URL);
  const [showSelectCarMessage, setShowSelectCarMessage] = useState(false);

  useEffect(() => {
    if (!pointA || !pointB) {
      setDistanceKm(null);
      setRoutePath(null);
      onDistanceCalculated?.(null);
      return;
    }

    const fetchRoute = async () => {
      setIsLoadingRoute(true);
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pointA.lng},${pointA.lat};${pointB.lng},${pointB.lat}?overview=full&geometries=geojson`,
        );
        const data = await res.json();

        if (data.routes?.[0]) {
          const route = data.routes[0];
          const km = Math.round(route.distance / 1000);
          setDistanceKm(km);
          onDistanceCalculated?.(km);
          const coords: [number, number][] = route.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng],
          );
          setRoutePath(coords);
        }
      } catch {
        const R = 6371;
        const dLat = ((pointB.lat - pointA.lat) * Math.PI) / 180;
        const dLng = ((pointB.lng - pointA.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((pointA.lat * Math.PI) / 180) *
            Math.cos((pointB.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const km = Math.round(R * c);
        setDistanceKm(km);
        onDistanceCalculated?.(km);
        setRoutePath([
          [pointA.lat, pointA.lng],
          [pointB.lat, pointB.lng],
        ]);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [pointA, pointB, onDistanceCalculated]);

  const hasRoute = Boolean(pointA && pointB);
  const center: [number, number] = pointA
    ? [pointA.lat, pointA.lng]
    : DEFAULT_CENTER;

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728 relative z-0 lg:h-full">
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute start-4 top-4 z-[1000] flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white lg:hidden"
          >
            ←
          </button>
        )}
        <p className="shrink-0 text-xs text-white/40">{t("routePreview")}</p>
        <p className="truncate text-sm font-bold text-white">
          {tripType ? t(tripTypeLabelKey[tripType]) : t("routePlaceholder")}
        </p>
      </div>

      <div className="relative mt-3 h-80 min-h-0 flex-none lg:h-auto lg:flex-1">
        <MapContainer
          center={center}
          zoom={hasRoute ? 11 : DEFAULT_ZOOM}
          scrollWheelZoom
          className="bg-[#dbe4ea]"
          style={{ height: "100%", width: "100%" }}
        >
          <MapResizeHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
            eventHandlers={{
              tileerror: () => {
                if (tileUrl !== CARTO_TILE_URL) setTileUrl(CARTO_TILE_URL);
              },
            }}
          />

          {pointA && <Marker position={[pointA.lat, pointA.lng]} />}
          {pointB && <Marker position={[pointB.lat, pointB.lng]} />}

          {routePath && (
            <Polyline
              positions={routePath}
              pathOptions={{ color: "#f59e0b", weight: 4 }}
            />
          )}

          {hasRoute && pointA && pointB && (
            <FitBoundsOnRoute
              pointA={pointA}
              pointB={pointB}
              routePath={routePath}
            />
          )}
        </MapContainer>

        {!hasRoute && (
          <div className="absolute inset-x-0 bottom-3 z-[1000] flex justify-center">
            <span className="rounded-full bg-black/70 px-4 py-2 text-xs text-white/70 backdrop-blur-sm">
              {t("completeTripToSeeRoute")}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs text-white/50">
          <Route className="h-3.5 w-3.5 text-amber-400" />
          {t("estimatedDistance")}
        </span>
        <span className="text-sm font-bold text-white">
          {isLoadingRoute
            ? "..."
            : distanceKm !== null
              ? t("distanceKm", { km: distanceKm })
              : "—"}
        </span>
      </div>

      <div className="flex items-center gap-3 border-t border-white/5 px-4 py-3">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.15-.174.199-.297.298-.496.099-.198.05-.371-.05-.52-.099-.149-.888-2.14-1.216-2.906-.28-.657-.567-.567-.777-.577-.198-.01-.42-.01-.644-.01-.223 0-.586.083-.892.42-.297.32-1.147 1.122-1.147 2.734 0 1.613 1.171 3.169 1.334 3.388.164.223 2.28 3.478 5.522 4.741.774.294 1.377.47 1.848.6.777.222 1.485.19 2.043.115.622-.093 1.907-.78 2.176-1.535.27-.755.27-1.4.189-1.536-.08-.135-.297-.199-.594-.35z" />
            <path d="M12.05 2C6.53 2 2 6.53 2 12.05c0 1.98.58 3.83 1.58 5.4L2 22l4.65-1.53a10 10 0 0 0 5.4 1.58c5.52 0 10.05-4.53 10.05-10.05S17.57 2 12.05 2zm0 18.35c-1.67 0-3.24-.46-4.6-1.28l-.33-.2-3.43 1.13 1.13-3.34-.22-.34a8.3 8.3 0 0 1-1.3-4.57c0-4.6 3.75-8.35 8.35-8.35 4.6 0 8.35 3.75 8.35 8.35 0 4.6-3.75 8.35-8.35 8.35z" />
          </svg>
        </a>

        <button
          onClick={() => {
            setShowSelectCarMessage(true);
            onNext();
          }}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-white hover:bg-white/5"
        >
          {t("next")}
        </button>

        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Users className="h-3.5 w-3.5 text-white/30" />
          {t("passengersCount", { count: passengers })}
        </div>
      </div>

      {showSelectCarMessage && (
        <div className="border-t border-white/5 px-4 py-3">
          <p className="text-center text-sm font-bold text-amber-400">
            {t("selectSuitableCar")}
          </p>
        </div>
      )}
    </div>
  );
}
