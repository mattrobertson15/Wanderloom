import { useQuery } from "@tanstack/react-query";
import { listTripsForOwner, queryKeys, useWanderloomClient } from "@wanderloom/api";
import { colors } from "@wanderloom/config";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { TripCard, type TripCardData } from "@/components/trip-card";
import { useAuth } from "@/lib/auth-context";

const FALLBACK_COVER_IMAGE_URL = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

export default function TripsScreen() {
  const { session } = useAuth();
  const client = useWanderloomClient();
  const userId = session?.user.id;

  const { data: trips, isLoading } = useQuery({
    queryKey: userId ? queryKeys.tripsByOwner(userId) : ["trips", "owner", "anonymous"],
    queryFn: () => listTripsForOwner(client, userId!),
    enabled: Boolean(userId),
  });

  const tripCards: TripCardData[] = (trips ?? []).map((trip) => ({
    slug: trip.slug,
    title: trip.title,
    coverImageUrl: FALLBACK_COVER_IMAGE_URL,
    startDate: trip.start_date,
    endDate: trip.end_date,
    visibility: trip.visibility,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your trips</Text>
        <Link href="/create" style={styles.newLink}>
          New trip
        </Link>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loading} color={colors.accent.primary} />
      ) : (
        <FlatList
          data={tripCards}
          keyExtractor={(trip) => trip.slug}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <TripCard trip={item} />}
          ListEmptyComponent={<Text style={styles.empty}>No trips yet. Start one to put your first pin on the map.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.base },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  title: { fontSize: 22, fontWeight: "600", color: colors.text.primary },
  newLink: { color: colors.accent.primary, fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  loading: { marginTop: 24 },
  empty: { color: colors.text.secondary, fontSize: 14, paddingHorizontal: 16 },
});
