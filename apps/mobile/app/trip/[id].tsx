import { useQuery } from "@tanstack/react-query";
import { getTripBySlug, listPostsForTrip, queryKeys, useWanderloomClient } from "@wanderloom/api";
import { colors } from "@wanderloom/config";
import { formatDateRange } from "@wanderloom/ui";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { PostCard, type PostCardData } from "@/components/post-card";

export default function TripDetailScreen() {
  const { id: slug } = useLocalSearchParams<{ id: string }>();
  const client = useWanderloomClient();

  const {
    data: trip,
    isLoading: isTripLoading,
    isError: isTripError,
  } = useQuery({
    queryKey: queryKeys.trip(slug),
    queryFn: () => getTripBySlug(client, slug),
    retry: false,
  });

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: queryKeys.postsForTrip(trip?.id ?? slug),
    queryFn: () => listPostsForTrip(client, trip!.id),
    enabled: Boolean(trip?.id),
  });

  const postCards: PostCardData[] = (posts ?? []).map((post) => ({
    title: post.title,
    body: post.body,
    photoUrl: null,
    placeName: (post.places as { name: string } | null)?.name ?? null,
    postDate: post.post_date,
  }));

  if (isTripLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} color={colors.accent.primary} />
      </View>
    );
  }

  if (isTripError) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Trip not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={postCards}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Trip</Text>
            <Text style={styles.title}>{trip?.title ?? slug}</Text>
            {trip && <Text style={styles.dateRange}>{formatDateRange(trip.start_date, trip.end_date)}</Text>}
          </View>
        }
        renderItem={({ item }) => <PostCard post={item} />}
        ListEmptyComponent={
          isPostsLoading ? null : <Text style={styles.empty}>No posts yet.</Text>
        }
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
  loading: { marginTop: 24 },
  empty: { color: colors.text.secondary, fontSize: 14 },
});
