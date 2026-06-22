import MapView, { Marker } from "react-native-maps";
import { useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Supercluster, { type ClusterFeature } from "supercluster";
import { colors } from "@wanderloom/config";
import { type PinFeatureProperties, type PinForMap } from "@wanderloom/domain";

export function GlobeMap({
  pins,
  onPinSelect,
}: {
  pins: PinForMap[];
  onPinSelect?: (properties: PinFeatureProperties) => void;
}) {
  const mapRef = useRef<MapView>(null);
  const [zoom, setZoom] = useState(1.2);

  const cluster = useMemo(() => {
    const supercluster = new Supercluster({
      radius: 50,
      maxZoom: 14,
      minZoom: 0,
    });

    const points = pins.map((pin) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [pin.location.lng, pin.location.lat],
      },
      properties: pin,
    }));

    supercluster.load(points);
    return supercluster;
  }, [pins]);

  const clustered = useMemo(() => {
    return cluster.getClusters([-180, -85, 180, 85], Math.floor(zoom));
  }, [cluster, zoom]);

  const handleMarkerPress = (item: ClusterFeature<any>) => {
    if (item.properties.point_count != null && typeof item.id === 'number') {
      // For clusters, just zoom to the cluster center coordinates
      // Supercluster's getClusterExpansionZoom returns a zoom level, not bbox
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
            latitudeDelta: 10,
            longitudeDelta: 10,
          },
          300
        );
      }
      return;
    }

    onPinSelect?.(item.properties as PinFeatureProperties);
  };

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: 20,
        longitude: 10,
        latitudeDelta: 80,
        longitudeDelta: 360,
      }}
      onRegionChangeComplete={(region) => {
        const newZoom = Math.log2(360 / region.longitudeDelta);
        setZoom(Math.max(0, Math.min(14, newZoom)));
      }}
    >
      {clustered.map((item: ClusterFeature<any>) => {
        const isCluster = item.properties.point_count != null;
        const count = item.properties.point_count ?? 1;

        return (
          <Marker
            key={`${item.geometry.coordinates[0]}-${item.geometry.coordinates[1]}-${item.id}`}
            coordinate={{
              latitude: item.geometry.coordinates[1],
              longitude: item.geometry.coordinates[0],
            }}
            onPress={() => handleMarkerPress(item)}
          >
            <View
              style={[
                styles.marker,
                {
                  width: isCluster ? 28 + count.toString().length * 4 : 24,
                  height: isCluster ? 28 : 24,
                  borderRadius: isCluster ? 14 + count.toString().length * 2 : 12,
                  backgroundColor: colors.map.pin,
                },
              ]}
            >
              {isCluster && (
                <Text style={styles.clusterText}>{count > 99 ? "99+" : count}</Text>
              )}
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  marker: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  clusterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
