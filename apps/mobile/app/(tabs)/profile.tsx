import { useQuery } from "@tanstack/react-query";
import { listTripsForOwner, queryKeys, useWanderloomClient } from "@wanderloom/api";
import { colors } from "@wanderloom/config";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { TripCard, type TripCardData } from "@/components/trip-card";
import { useAuth } from "@/lib/auth-context";
import { getMobileSupabaseClient } from "@/lib/supabase/client";

const FALLBACK_COVER_IMAGE_URL = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

export default function ProfileScreen() {
  const { session } = useAuth();
  const client = useWanderloomClient();
  const userId = session?.user.id;

  const { data: trips } = useQuery({
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
        <View style={styles.avatar} />
        <View>
          <Text style={styles.title}>Your profile</Text>
          <Text style={styles.email}>{session?.user.email ?? "@you"}</Text>
        </View>
      </View>
      <FlatList
        data={tripCards}
        keyExtractor={(trip) => trip.slug}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Your trips</Text>}
        renderItem={({ item }) => <TripCard trip={item} />}
      />
      <Pressable style={styles.signOut} onPress={() => getMobileSupabaseClient().auth.signOut()}>
        <Text style={styles.signOutLabel}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.base },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent.secondary + "33" },
  title: { fontSize: 20, fontWeight: "600", color: colors.text.primary },
  email: { fontSize: 13, color: colors.text.secondary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text.primary, marginBottom: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  signOut: { margin: 16, alignItems: "center", paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.text.secondary + "33" },
  signOutLabel: { color: colors.text.secondary, fontSize: 14 },
});
