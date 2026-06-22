import { Link } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import type { Visibility } from "@wanderloom/config";
import { colors } from "@wanderloom/config";
import { formatDateRange } from "@wanderloom/ui";
import { VisibilityBadge } from "./visibility-badge";

export interface TripCardData {
  slug: string;
  title: string;
  coverImageUrl: string;
  startDate: string | null;
  endDate: string | null;
  visibility: Visibility;
  ownerLabel?: string;
}

export function TripCard({ trip }: { trip: TripCardData }) {
  return (
    <Link href={`/trip/${trip.slug}`} asChild>
      <Pressable style={styles.card}>
        <ImageBackground source={{ uri: trip.coverImageUrl }} style={styles.image} imageStyle={styles.imageInner}>
          <View style={styles.badgeRow}>
            <VisibilityBadge visibility={trip.visibility} />
          </View>
          <View style={styles.overlay}>
            {trip.ownerLabel && <Text style={styles.ownerLabel}>{trip.ownerLabel}</Text>}
            <Text style={styles.title}>{trip.title}</Text>
            <Text style={styles.dateRange}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, overflow: "hidden", marginBottom: 16 },
  image: { aspectRatio: 4 / 3, justifyContent: "space-between" },
  imageInner: { borderRadius: 16 },
  badgeRow: { padding: 12, alignItems: "flex-end" },
  overlay: { padding: 12, backgroundColor: "rgba(0,0,0,0.35)" },
  ownerLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginBottom: 2 },
  title: { color: "white", fontSize: 18, fontWeight: "600" },
  dateRange: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 },
});

// re-export for screens that just need the color token without re-importing config
export const cardBackground = colors.background.elevated;
