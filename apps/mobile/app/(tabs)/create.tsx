import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, listTripsForOwner, queryKeys, useWanderloomClient } from "@wanderloom/api";
import { VISIBILITY_LEVELS, colors, type Visibility } from "@wanderloom/config";
import { createPostSchema } from "@wanderloom/validation";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "@/lib/auth-context";

export default function CreateScreen() {
  const { session } = useAuth();
  const client = useWanderloomClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = session?.user.id;

  const { data: trips, isLoading: isTripsLoading } = useQuery({
    queryKey: userId ? queryKeys.tripsByOwner(userId) : ["trips", "owner", "anonymous"],
    queryFn: () => listTripsForOwner(client, userId!),
    enabled: Boolean(userId),
  });

  const [tripId, setTripId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postDate, setPostDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tripId && trips && trips.length > 0) {
      setTripId(trips[0].id);
      setVisibility(trips[0].visibility);
    }
  }, [trips, tripId]);

  const selectedTrip = trips?.find((trip) => trip.id === tripId) ?? null;

  function selectTrip(id: string, tripVisibility: Visibility) {
    setTripId(id);
    setVisibility(tripVisibility);
  }

  async function handleSubmit() {
    if (!userId || !tripId) return;
    setError(null);

    const parsed = createPostSchema.safeParse({
      trip_id: tripId,
      title: title || undefined,
      body: body || undefined,
      post_date: postDate || undefined,
      visibility,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid post details");
      return;
    }

    setSubmitting(true);
    try {
      await createPost(client, userId, parsed.data);
      await queryClient.invalidateQueries({ queryKey: queryKeys.postsForTrip(tripId) });
      setTitle("");
      setBody("");
      setPostDate("");
      if (selectedTrip) router.push(`/trip/${selectedTrip.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create post");
    } finally {
      setSubmitting(false);
    }
  }

  if (isTripsLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.accent.primary} />
      </View>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create</Text>
        <Text style={styles.body}>You need a trip before you can add a post. Create one on the web app for now.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New post</Text>

      <Text style={styles.label}>Trip</Text>
      <View style={styles.pillRow}>
        {trips.map((trip) => (
          <Pressable
            key={trip.id}
            style={[styles.pill, trip.id === tripId && styles.pillActive]}
            onPress={() => selectTrip(trip.id, trip.visibility)}
          >
            <Text style={[styles.pillLabel, trip.id === tripId && styles.pillLabelActive]}>{trip.title}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="First morning in Manhattan"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Body</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="What happened?"
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={postDate} onChangeText={setPostDate} />

      <Text style={styles.label}>Visibility</Text>
      <View style={styles.pillRow}>
        {VISIBILITY_LEVELS.map((level) => (
          <Pressable
            key={level}
            style={[styles.pill, visibility === level && styles.pillActive]}
            onPress={() => setVisibility(level)}
          >
            <Text style={[styles.pillLabel, visibility === level && styles.pillLabelActive]}>{level}</Text>
          </Pressable>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonLabel}>{submitting ? "Posting…" : "Add post"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background.base,
  },
  scroll: { flex: 1, backgroundColor: colors.background.base },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: "600", color: colors.text.primary, marginBottom: 16 },
  body: { fontSize: 14, color: colors.text.secondary, textAlign: "center" },
  label: { fontSize: 13, color: colors.text.secondary, marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text.primary,
  },
  multiline: { minHeight: 96, textAlignVertical: "top" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillActive: { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary },
  pillLabel: { fontSize: 13, color: colors.text.secondary, textTransform: "capitalize" },
  pillLabelActive: { color: "white" },
  error: { color: "#DC2626", marginTop: 12 },
  button: {
    marginTop: 24,
    backgroundColor: colors.accent.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonLabel: { color: "white", fontSize: 14, fontWeight: "600" },
});
