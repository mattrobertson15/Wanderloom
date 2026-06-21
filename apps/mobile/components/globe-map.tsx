import Mapbox, { Camera, MapView, ShapeSource, CircleLayer } from "@rnmapbox/maps";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, MOBILE_GLOBE_PROJECTION_ENABLED } from "@wanderloom/config";
import { pinsToFeatureCollection, type PinForMap } from "@wanderloom/domain";

const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export function GlobeMap({ pins }: { pins: PinForMap[] }) {
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
      <Camera defaultSettings={{ centerCoordinate: [10, 20], zoomLevel: 1.2 }} />
      <ShapeSource id="wanderloom-pins" shape={featureCollection}>
        <CircleLayer
          id="pins-circle"
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
