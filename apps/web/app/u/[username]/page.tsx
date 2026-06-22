import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFollowBetween, getFriendshipBetween, getProfileByUsername } from "@wanderloom/api";
import { Avatar } from "@/components/avatar";
import { FollowButton } from "@/components/follow-button";
import { FriendshipButton, type FriendshipState } from "@/components/friendship-button";
import { TripCard } from "@/components/trip-card";
import { MOCK_TRIPS } from "@/lib/mock/trips";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const supabase = await getServerSupabaseClient();
  let profile;
  try {
    profile = await getProfileByUsername(supabase, username);
  } catch {
    return { title: `@${username} · Wanderloom` };
  }
  const title = `${profile.display_name ?? `@${profile.username}`} · Wanderloom`;
  const description = profile.bio ?? `See @${profile.username}'s public trips on Wanderloom.`;
  const images = profile.avatar_url ? [profile.avatar_url] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "profile", images },
    twitter: { card: "summary", title, description, images },
  };
}

// Public profile page — SSR, no auth required. Profile identity (name,
// avatar) and friend/follow state are real; the trip grid below still
// renders mock public trips (real trip wiring is a separate TODO item).
export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await getServerSupabaseClient();

  let profile;
  try {
    profile = await getProfileByUsername(supabase, username);
  } catch {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isSelf = user?.id === profile.id;

  let friendshipState: FriendshipState = { status: "none" };
  let isFollowing = false;
  if (user && !isSelf) {
    const [friendship, follow] = await Promise.all([
      getFriendshipBetween(supabase, user.id, profile.id),
      getFollowBetween(supabase, user.id, profile.id),
    ]);
    if (friendship?.status === "accepted") {
      friendshipState = { status: "accepted", friendshipId: friendship.id };
    } else if (friendship?.status === "pending") {
      friendshipState =
        friendship.requester_id === user.id
          ? { status: "pending_outgoing", friendshipId: friendship.id }
          : { status: "pending_incoming", friendshipId: friendship.id };
    }
    isFollowing = Boolean(follow);
  }

  const publicTrips = MOCK_TRIPS.filter((t) => t.visibility === "public");

  return (
    <main className="min-h-screen bg-background-base px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar url={profile.avatar_url} label={profile.display_name ?? profile.username} />
            <div>
              <h1 className="font-display text-2xl text-text-primary">{profile.display_name ?? `@${profile.username}`}</h1>
              <p className="text-sm text-text-secondary">@{profile.username}</p>
            </div>
          </div>
          {user && !isSelf && (
            <div className="flex items-center gap-2">
              <FollowButton profileId={profile.id} initialFollowing={isFollowing} />
              <FriendshipButton profileId={profile.id} initialState={friendshipState} />
            </div>
          )}
        </div>
        {profile.bio && <p className="mt-4 text-sm text-text-secondary">{profile.bio}</p>}
        <h2 className="mt-10 font-display text-xl text-text-primary">Public trips</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {publicTrips.map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
        </div>
      </div>
    </main>
  );
}
