import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  listTripsForOwner,
  queryKeys,
  updateProfile,
  useWanderloomClient,
} from "@wanderloom/api";
import { colors } from "@wanderloom/config";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { TripCard, type TripCardData } from "@/components/trip-card";
import { useAuth } from "@/lib/auth-context";
import { getMobileSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

const FALLBACK_COVER_IMAGE_URL = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

export default function ProfileScreen() {
  const { session } = useAuth();
  const client = useWanderloomClient();
  const queryClient = useQueryClient();
  const userId = session?.user.id;
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const { data: profile } = useQuery({
    queryKey: userId ? queryKeys.profile(userId) : ["profile", "anonymous"],
    queryFn: () => getProfile(client, userId!),
    enabled: Boolean(userId),
  });

  const { data: trips } = useQuery({
    queryKey: userId ? queryKeys.tripsByOwner(userId) : ["trips", "owner", "anonymous"],
    queryFn: () => listTripsForOwner(client, userId!),
    enabled: Boolean(userId),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: { display_name?: string; bio?: string }) =>
      updateProfile(client, userId!, updates),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) });
      }
      setIsEditingProfile(false);
    },
  });

  const tripCards: TripCardData[] = (trips ?? []).map((trip) => ({
    slug: trip.slug,
    title: trip.title,
    coverImageUrl: FALLBACK_COVER_IMAGE_URL,
    startDate: trip.start_date,
    endDate: trip.end_date,
    visibility: trip.visibility,
  }));

  const handleEditPress = () => {
    setDisplayName(profile?.display_name || "");
    setBio(profile?.bio || "");
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    await updateProfileMutation.mutateAsync({
      display_name: displayName || null,
      bio: bio || null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{profile?.display_name || "Your profile"}</Text>
          <Text style={styles.email}>{session?.user.email ?? "@you"}</Text>
        </View>
        <Pressable style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonLabel}>Edit</Text>
        </Pressable>
      </View>
      {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
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

      <Modal visible={isEditingProfile} animationType="slide" onRequestClose={() => setIsEditingProfile(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setIsEditingProfile(false)}>
              <Text style={styles.modalCloseButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Pressable
              onPress={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              style={({ pressed }) => [styles.modalSaveButton, pressed && { opacity: 0.7 }]}
            >
              <Text
                style={[
                  styles.modalSaveButtonLabel,
                  updateProfileMutation.isPending && { opacity: 0.5 },
                ]}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.modalForm}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.base },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, paddingBottom: 8 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent.secondary + "33" },
  headerContent: { flex: 1 },
  title: { fontSize: 20, fontWeight: "600", color: colors.text.primary },
  email: { fontSize: 13, color: colors.text.secondary, marginTop: 2 },
  bio: { paddingHorizontal: 16, fontSize: 14, color: colors.text.secondary, marginBottom: 16 },
  editButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: colors.accent.primary + "1A", borderWidth: 1, borderColor: colors.accent.primary },
  editButtonLabel: { fontSize: 12, fontWeight: "600", color: colors.accent.primary },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text.primary, marginBottom: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  signOut: { margin: 16, alignItems: "center", paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.text.secondary + "33" },
  signOutLabel: { color: colors.text.secondary, fontSize: 14 },
  modalContainer: { flex: 1, backgroundColor: colors.background.base },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.text.secondary + "1A" },
  modalCloseButton: { fontSize: 14, color: colors.text.secondary },
  modalTitle: { fontSize: 16, fontWeight: "600", color: colors.text.primary },
  modalSaveButton: { paddingHorizontal: 12, paddingVertical: 6 },
  modalSaveButtonLabel: { fontSize: 14, fontWeight: "600", color: colors.accent.primary },
  modalForm: { padding: 16, gap: 20 },
  formGroup: { gap: 8 },
  formLabel: { fontSize: 14, fontWeight: "600", color: colors.text.primary },
  textInput: { borderWidth: 1, borderColor: colors.text.secondary + "33", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.text.primary, backgroundColor: colors.background.secondary },
  bioInput: { textAlignVertical: "top" },
});
