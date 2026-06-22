"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import type { PinFeatureCollection, PinFeatureProperties } from "@wanderloom/domain";
import { colors } from "@wanderloom/config";

const PINS_SOURCE_ID = "wanderloom-pins";
const CLUSTERS_LAYER_ID = "pins-clusters";
const CLUSTER_COUNT_LAYER_ID = "pins-cluster-count";
const UNCLUSTERED_LAYER_ID = "pins-unclustered";

export function GlobeMap({
  pins,
  onPinSelect,
}: {
  pins: PinFeatureCollection;
  onPinSelect?: (properties: PinFeatureProperties) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onPinSelectRef = useRef(onPinSelect);
  onPinSelectRef.current = onPinSelect;
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
      map.addSource(PINS_SOURCE_ID, { type: "geojson", data: pins, cluster: true, clusterMaxZoom: 14, clusterRadius: 50 });

      map.addLayer({
        id: CLUSTERS_LAYER_ID,
        type: "circle",
        source: PINS_SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": colors.map.pin,
          "circle-opacity": 0.85,
          "circle-radius": ["step", ["get", "point_count"], 16, 10, 22, 50, 28],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
      map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: "symbol",
        source: PINS_SOURCE_ID,
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
        paint: { "text-color": "#fff" },
      });
      map.addLayer({
        id: UNCLUSTERED_LAYER_ID,
        type: "circle",
        source: PINS_SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 6,
          "circle-color": colors.map.pin,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.on("click", CLUSTERS_LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const clusterId = feature.properties?.cluster_id;
        const source = map.getSource(PINS_SOURCE_ID) as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null || feature.geometry.type !== "Point") return;
          map.easeTo({ center: feature.geometry.coordinates as [number, number], zoom });
        });
      });

      map.on("click", UNCLUSTERED_LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        onPinSelectRef.current?.(feature.properties as PinFeatureProperties);
      });

      for (const layerId of [CLUSTERS_LAYER_ID, UNCLUSTERED_LAYER_ID]) {
        map.on("mouseenter", layerId, () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", layerId, () => (map.getCanvas().style.cursor = ""));
      }
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
