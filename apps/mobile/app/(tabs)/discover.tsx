import { useQuery } from "@tanstack/react-query";
import { listDiscoverableTrips, queryKeys, useWanderloomClient } from "@wanderloom/api";
import { colors } from "@wanderloom/config";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { TripCard, type TripCardData } from "@/components/trip-card";
import { useAuth } from "@/lib/auth-context";

const FALLBACK_COVER_IMAGE_URL = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

type DiscoverTrip = Awaited<ReturnType<typeof listDiscoverableTrips>>[number] & {
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

export default function DiscoverScreen() {
  const { session } = useAuth();
  const client = useWanderloomClient();
  const userId = session?.user.id;

  const { data: trips, isLoading } = useQuery({
    queryKey: userId ? queryKeys.discoverTrips(userId) : ["trips", "discover", "anonymous"],
    queryFn: () => listDiscoverableTrips(client, userId!),
    enabled: Boolean(userId),
  });

  const tripCards: TripCardData[] = ((trips ?? []) as DiscoverTrip[]).map((trip) => ({
    slug: trip.slug,
    title: trip.title,
    coverImageUrl: FALLBACK_COVER_IMAGE_URL,
    startDate: trip.start_date,
    endDate: trip.end_date,
    visibility: trip.visibility,
    ownerLabel: trip.profiles ? `@${trip.profiles.username}` : undefined,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loading} color={colors.accent.primary} />
      ) : (
        <FlatList
          data={tripCards}
          keyExtractor={(trip) => trip.slug}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <TripCard trip={item} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No trips to discover yet. Add friends to see their trips here.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.base },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "600", color: colors.text.primary },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  loading: { marginTop: 24 },
  empty: { color: colors.text.secondary, fontSize: 14, paddingHorizontal: 16 },
});
