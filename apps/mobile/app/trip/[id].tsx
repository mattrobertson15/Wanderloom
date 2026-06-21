import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "@wanderloom/config";
import { PostCard } from "@/components/post-card";
import { MOCK_POSTS } from "@/lib/mock/posts";
import { MOCK_TRIPS } from "@/lib/mock/trips";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = MOCK_TRIPS.find((t) => t.slug === id);
  const posts = MOCK_POSTS.filter((p) => p.tripSlug === id);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Trip</Text>
            <Text style={styles.title}>{trip?.title ?? id}</Text>
            {trip && <Text style={styles.dateRange}>{trip.dateRange}</Text>}
          </View>
        }
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.base },
  list: { padding: 16 },
  header: { marginBottom: 16 },
  eyebrow: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, color: colors.text.secondary },
  title: { fontSize: 26, fontWeight: "600", color: colors.text.primary, marginTop: 4 },
  dateRange: { fontSize: 13, color: colors.text.secondary, marginTop: 4 },
});
