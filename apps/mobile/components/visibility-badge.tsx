import { StyleSheet, Text, View } from "react-native";
import { VISIBILITY_EMOJI, visibilityLabel } from "@wanderloom/ui";
import type { Visibility } from "@wanderloom/config";
import { colors } from "@wanderloom/config";

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {VISIBILITY_EMOJI[visibility]} {visibilityLabel(visibility)}
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
