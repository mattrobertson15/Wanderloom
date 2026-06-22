import { VISIBILITY_LEVELS, colors, type Visibility } from "@wanderloom/config";
import { VISIBILITY_EMOJI, visibilityDescription, visibilityLabel } from "@wanderloom/ui";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function VisibilitySelector({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (visibility: Visibility) => void;
}) {
  return (
    <View style={styles.list}>
      {VISIBILITY_LEVELS.map((level) => (
        <Pressable
          key={level}
          style={[styles.option, value === level && styles.optionActive]}
          onPress={() => onChange(level)}
        >
          <Text style={styles.optionLabel}>
            {VISIBILITY_EMOJI[level]} {visibilityLabel(level)}
          </Text>
          <Text style={styles.optionDescription}>{visibilityDescription(level)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  option: {
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionActive: { borderColor: colors.accent.primary, backgroundColor: colors.accent.primary + "1A" },
  optionLabel: { fontSize: 14, fontWeight: "600", color: colors.text.primary },
  optionDescription: { fontSize: 12, color: colors.text.secondary, marginTop: 2 },
});
