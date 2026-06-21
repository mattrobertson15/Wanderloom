import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";

// TODO(session-08): show place detail (map preview, posts at this place across trips/users).
export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Place</Text>
      <Text style={styles.title}>{id}</Text>
      <Text style={styles.body}>Place detail (map preview, posts here) lands in Session 08.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background.base },
  eyebrow: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, color: colors.text.secondary },
  title: { fontSize: 26, fontWeight: "600", color: colors.text.primary, marginTop: 4 },
  body: { fontSize: 14, color: colors.text.secondary, marginTop: 12 },
});
