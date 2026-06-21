import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";

// TODO(auth-oauth): wire up real Google/Apple OAuth once client IDs exist.
// Buttons are intentionally disabled per docs/DECISION_LOG.md.
export function OAuthButtons() {
  return (
    <View style={styles.container}>
      <Pressable disabled style={styles.button}>
        <Text style={styles.label}>Continue with Google</Text>
      </Pressable>
      <Pressable disabled style={styles.button}>
        <Text style={styles.label}>Continue with Apple</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, gap: 8 },
  button: {
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    opacity: 0.6,
  },
  label: { color: colors.text.secondary, fontSize: 14 },
});
