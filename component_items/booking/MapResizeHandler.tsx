"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let frameId: number | null = null;

    const invalidateMapSize = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        map.invalidateSize({ pan: false });
        frameId = null;
      });
    };

    const resizeObserver = new ResizeObserver(invalidateMapSize);

    resizeObserver.observe(container);
    window.addEventListener("resize", invalidateMapSize);
    window.addEventListener("orientationchange", invalidateMapSize);
    invalidateMapSize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", invalidateMapSize);
      window.removeEventListener("orientationchange", invalidateMapSize);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [map]);

  return null;
}
