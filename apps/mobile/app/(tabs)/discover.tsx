import { StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";

// TODO(session-09): browse friends' and public trips, friend/follow actions.
export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.body}>Friend and public trip discovery lands in Session 09. This tab is a placeholder for now.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.background.base },
  title: { fontSize: 22, fontWeight: "600", color: colors.text.primary, marginBottom: 8 },
  body: { fontSize: 14, color: colors.text.secondary, textAlign: "center" },
});
