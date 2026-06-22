"use client";

import { TripCard } from "@/components/trip-card";
import { useMutation } from "@tanstack/react-query";
import { updateProfile, useWanderloomClient } from "@wanderloom/api";
import { useState } from "react";
import type { ProfileRow, TripRow } from "@wanderloom/db";

const FALLBACK_COVER_IMAGE_URL = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

interface Props {
  profile: ProfileRow;
  trips: TripRow[];
}

export default function ProfilePageClient({ profile, trips }: Props) {
  const client = useWanderloomClient();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");

  const updateProfileMutation = useMutation({
    mutationFn: (updates: { display_name?: string; bio?: string }) =>
      updateProfile(client, profile.id, updates),
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const handleEditClick = () => {
    setDisplayName(profile?.display_name || "");
    setBio(profile?.bio || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateProfileMutation.mutateAsync({
      display_name: displayName || null,
      bio: bio || null,
    });
  };

  return (
    <div className="px-6 py-6 md:px-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-accent-secondary/20" />
          <div>
            <h1 className="font-display text-2xl text-text-primary">{profile?.display_name || "Your profile"}</h1>
            <p className="text-sm text-text-secondary">{profile?.username}</p>
            {profile?.bio && <p className="mt-1 text-sm text-text-secondary">{profile.bio}</p>}
          </div>
        </div>
        <button
          onClick={handleEditClick}
          className="rounded-lg border border-accent-primary bg-accent-primary/10 px-3 py-2 text-sm font-semibold text-accent-primary hover:bg-accent-primary/20"
        >
          Edit
        </button>
      </div>

      <h2 className="mt-8 font-display text-xl text-text-primary">Your trips</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {trips.map((trip) => (
          <TripCard
            key={trip.slug}
            trip={{
              slug: trip.slug,
              title: trip.title,
              coverImageUrl: FALLBACK_COVER_IMAGE_URL,
              startDate: trip.start_date,
              endDate: trip.end_date,
              visibility: trip.visibility,
            }}
          />
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-background-base p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl text-text-primary">Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text-primary">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-lg border border-text-secondary/20 bg-background-secondary px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-text-secondary/20 bg-background-secondary px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-lg border border-text-secondary/20 px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white hover:bg-accent-primary/90 disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
