import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";
import { TripCard } from "@/components/trip-card";
import { MOCK_TRIPS } from "@/lib/mock/trips";

export default function TripsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your trips</Text>
        <Link href="/create" style={styles.newLink}>
          New trip
        </Link>
      </View>
      <FlatList
        data={MOCK_TRIPS}
        keyExtractor={(trip) => trip.slug}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <TripCard trip={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.base },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  title: { fontSize: 22, fontWeight: "600", color: colors.text.primary },
  newLink: { color: colors.accent.primary, fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
});
