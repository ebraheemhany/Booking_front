"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { LocationValue } from "@/component_items/search/LocationPicker";

interface FitBoundsOnRouteProps {
  pointA: LocationValue;
  pointB: LocationValue;
  routePath?: [number, number][] | null;
}

export function FitBoundsOnRoute({
  pointA,
  pointB,
  routePath,
}: FitBoundsOnRouteProps) {
  const map = useMap();

  useEffect(() => {
    const fitRoute = () => {
      const container = map.getContainer();
      if (container.clientWidth === 0 || container.clientHeight === 0) return;

      map.invalidateSize({ pan: false }); // تأكيد إضافي على الحجم الصح
      const validRoutePath = routePath?.filter(
        ([lat, lng]) =>
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          Math.abs(lat) <= 90 &&
          Math.abs(lng) <= 180,
      );
      const bounds = validRoutePath?.length
        ? L.latLngBounds(validRoutePath)
        : L.latLngBounds([pointA.lat, pointA.lng], [pointB.lat, pointB.lng]);

      if (!bounds.isValid()) return;

      map.fitBounds(bounds, {
        padding: [32, 32],
        maxZoom: 10,
      });
    };

    const timer = setTimeout(fitRoute, 150);
    const resizeObserver = new ResizeObserver(fitRoute);
    resizeObserver.observe(map.getContainer());

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [map, pointA, pointB, routePath]);

  return null;
}
