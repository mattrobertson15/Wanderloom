"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import type { PinFeatureCollection } from "@wanderloom/domain";
import { colors } from "@wanderloom/config";

const PINS_SOURCE_ID = "wanderloom-pins";

export function GlobeMap({ pins }: { pins: PinFeatureCollection }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      projection: "globe",
      zoom: 1.5,
      center: [10, 20],
    });
    mapRef.current = map;

    map.on("load", () => {
      map.setFog({});
      map.addSource(PINS_SOURCE_ID, { type: "geojson", data: pins });
      map.addLayer({
        id: "pins-circle",
        type: "circle",
        source: PINS_SOURCE_ID,
        paint: {
          "circle-radius": 6,
          "circle-color": colors.map.pin,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    });

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const source = mapRef.current?.getSource(PINS_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    source?.setData(pins);
  }, [pins]);

  if (!token) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg bg-map-base text-text-secondary">
        Set NEXT_PUBLIC_MAPBOX_TOKEN to render the live globe.
      </div>
    );
  }

  return <div ref={containerRef} className="aspect-[16/9] w-full overflow-hidden rounded-lg" />;
}
