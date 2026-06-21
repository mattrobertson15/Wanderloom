import { StyleSheet, Text, View } from "react-native";
import { visibilityLabel } from "@wanderloom/ui";
import type { Visibility } from "@wanderloom/config";
import { colors } from "@wanderloom/config";

const ICON: Record<Visibility, string> = { private: "🔒", friends: "👥", public: "🌐" };

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {ICON[visibility]} {visibilityLabel(visibility)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.background.elevated,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: { fontSize: 11, color: colors.text.secondary },
});
