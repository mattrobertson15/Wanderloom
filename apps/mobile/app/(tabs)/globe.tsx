import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";
import { GlobeMap } from "@/components/globe-map";
import { MOCK_PINS } from "@/lib/mock/pins";

const FILTER_PILLS = ["mine", "friends", "public"] as const;

export default function GlobeScreen() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_PILLS)[number]>("mine");

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
      <GlobeMap pins={MOCK_PINS} />
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
});
