import type { PinFeatureProperties } from "@wanderloom/domain";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";
import { GlobeMap } from "@/components/globe-map";
import { MOCK_PINS } from "@/lib/mock/pins";

const FILTER_PILLS = ["mine", "friends", "public"] as const;

export default function GlobeScreen() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_PILLS)[number]>("mine");
  const [selectedPin, setSelectedPin] = useState<PinFeatureProperties | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.pillRow}>
        {FILTER_PILLS.map((pill) => (
          <Pressable
            key={pill}
            onPress={() => setActiveFilter(pill)}
            style={[styles.pill, activeFilter === pill && styles.pillActive]}
          >
            <Text style={[styles.pillText, activeFilter === pill && styles.pillTextActive]}>{pill}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.mapWrapper}>
        <GlobeMap pins={MOCK_PINS} onPinSelect={setSelectedPin} />
        {selectedPin && (
          <View style={styles.preview}>
            <View>
              <Text style={styles.previewTitle}>{selectedPin.placeName}</Text>
              <Link href={`/trip/${selectedPin.tripSlug}`} style={styles.previewLink}>
                View trip →
              </Link>
            </View>
            <Pressable onPress={() => setSelectedPin(null)}>
              <Text style={styles.previewClose}>×</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.base },
  pillRow: { flexDirection: "row", gap: 8, padding: 16 },
  pill: {
    borderWidth: 1,
    borderColor: colors.text.secondary + "33",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillActive: { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary },
  pillText: { fontSize: 13, color: colors.text.secondary, textTransform: "capitalize" },
  pillTextActive: { color: "white" },
  mapWrapper: { flex: 1 },
  preview: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  previewTitle: { fontSize: 15, fontWeight: "600", color: colors.text.primary },
  previewLink: { fontSize: 13, fontWeight: "600", color: colors.accent.primary, marginTop: 2 },
  previewClose: { fontSize: 20, color: colors.text.secondary, paddingHorizontal: 4 },
});
