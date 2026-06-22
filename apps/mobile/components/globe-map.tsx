import Mapbox, { Camera, MapView, ShapeSource, CircleLayer, SymbolLayer } from "@rnmapbox/maps";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, MOBILE_GLOBE_PROJECTION_ENABLED } from "@wanderloom/config";
import { pinsToFeatureCollection, type PinFeatureProperties, type PinForMap } from "@wanderloom/domain";

const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
const PINS_SOURCE_ID = "wanderloom-pins";

export function GlobeMap({
  pins,
  onPinSelect,
}: {
  pins: PinForMap[];
  onPinSelect?: (properties: PinFeatureProperties) => void;
}) {
  const cameraRef = useRef<Camera>(null);
  const shapeSourceRef = useRef<ShapeSource>(null);

  useEffect(() => {
    if (token) Mapbox.setAccessToken(token);
  }, []);

  if (!token) {
    return (
      <View style={[styles.fallback, { backgroundColor: colors.map.base }]}>
        <Text style={{ color: colors.text.secondary }}>Set EXPO_PUBLIC_MAPBOX_TOKEN to render the live map.</Text>
      </View>
    );
  }

  const featureCollection = pinsToFeatureCollection(pins);

  return (
    <MapView
      style={styles.map}
      styleURL="mapbox://styles/mapbox/light-v11"
      projection={MOBILE_GLOBE_PROJECTION_ENABLED ? "globe" : "mercator"}
    >
      <Camera ref={cameraRef} defaultSettings={{ centerCoordinate: [10, 20], zoomLevel: 1.2 }} />
      <ShapeSource
        ref={shapeSourceRef}
        id={PINS_SOURCE_ID}
        shape={featureCollection}
        cluster
        clusterRadius={50}
        clusterMaxZoomLevel={14}
        onPress={async (event) => {
          const feature = event.features[0];
          if (!feature) return;

          if (feature.properties?.point_count != null) {
            if (feature.geometry.type !== "Point") return;
            const zoom = await shapeSourceRef.current?.getClusterExpansionZoom(feature);
            if (zoom == null) return;
            cameraRef.current?.setCamera({
              centerCoordinate: feature.geometry.coordinates as [number, number],
              zoomLevel: zoom,
              animationDuration: 300,
            });
            return;
          }

          onPinSelect?.(feature.properties as PinFeatureProperties);
        }}
      >
        <CircleLayer
          id="pins-clusters"
          filter={["has", "point_count"]}
          style={{
            circleColor: colors.map.pin,
            circleOpacity: 0.85,
            circleRadius: ["step", ["get", "point_count"], 16, 10, 22, 50, 28],
            circleStrokeWidth: 2,
            circleStrokeColor: "#fff",
          }}
        />
        <SymbolLayer
          id="pins-cluster-count"
          filter={["has", "point_count"]}
          style={{ textField: ["get", "point_count_abbreviated"], textSize: 12, textColor: "#fff" }}
        />
        <CircleLayer
          id="pins-unclustered"
          filter={["!", ["has", "point_count"]]}
          style={{ circleRadius: 6, circleColor: colors.map.pin, circleStrokeWidth: 2, circleStrokeColor: "#fff" }}
        />
      </ShapeSource>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  fallback: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
});
