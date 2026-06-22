import { useQuery, useQueryClient } from "@tanstack/react-query";
import { attachPhotoToPost, createPost, listTripsForOwner, queryKeys, uploadPostPhoto, useWanderloomClient } from "@wanderloom/api";
import { colors, type Visibility } from "@wanderloom/config";
import { createPostSchema } from "@wanderloom/validation";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { base64ToArrayBuffer } from "@/lib/base64";
import { useAuth } from "@/lib/auth-context";
import { VisibilitySelector } from "@/components/visibility-selector";

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
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
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

  async function handlePickPhotos() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library access is required to attach photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos((current) => [...current, ...result.assets]);
    }
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
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
      const post = await createPost(client, userId, parsed.data);
      for (const [index, asset] of photos.entries()) {
        if (!asset.base64) continue;
        const buffer = base64ToArrayBuffer(asset.base64);
        const fileName = asset.fileName ?? `photo-${index}.jpg`;
        const path = await uploadPostPhoto(client, userId, post.id, buffer, fileName, asset.mimeType);
        await attachPhotoToPost(client, userId, {
          post_id: post.id,
          storage_path: path,
          sort_order: index,
          width: asset.width,
          height: asset.height,
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.postsForTrip(tripId) });
      setTitle("");
      setBody("");
      setPostDate("");
      setPhotos([]);
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

      <Text style={styles.label}>Photos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
        {photos.map((asset, index) => (
          <View key={asset.assetId ?? `${asset.uri}-${index}`} style={styles.photoThumbWrapper}>
            <Image source={{ uri: asset.uri }} style={styles.photoThumb} />
            <Pressable style={styles.photoRemoveButton} onPress={() => removePhoto(index)}>
              <Text style={styles.photoRemoveLabel}>×</Text>
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.addPhotosButton} onPress={handlePickPhotos}>
          <Text style={styles.addPhotosLabel}>+ Add</Text>
        </Pressable>
      </ScrollView>

      <Text style={styles.label}>Visibility</Text>
      <VisibilitySelector value={visibility} onChange={setVisibility} />

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
  photoRow: { flexDirection: "row" },
  photoThumbWrapper: { marginRight: 8, position: "relative" },
  photoThumb: { width: 72, height: 72, borderRadius: 8 },
  photoRemoveButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  photoRemoveLabel: { color: "white", fontSize: 12, lineHeight: 12 },
  addPhotosButton: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotosLabel: { fontSize: 12, color: colors.text.secondary },
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
