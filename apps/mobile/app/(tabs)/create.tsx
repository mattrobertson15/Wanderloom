import { StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";

// TODO(session-07): wire up real post/trip creation flow (place search, photo upload, visibility picker).
export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create</Text>
      <Text style={styles.body}>Post and trip creation lands in Session 07. This tab is a placeholder for now.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.background.base },
  title: { fontSize: 22, fontWeight: "600", color: colors.text.primary, marginBottom: 8 },
  body: { fontSize: 14, color: colors.text.secondary, textAlign: "center" },
});
