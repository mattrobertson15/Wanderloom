import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getProfilesByIds, listFollows, listFriendships } from "@wanderloom/api";
import type { FriendshipRow, FollowRow, ProfileRow } from "@wanderloom/db";
import { Avatar } from "@/components/avatar";
import { FollowButton } from "@/components/follow-button";
import { FriendshipButton, type FriendshipState } from "@/components/friendship-button";
import { UserSearch } from "@/components/user-search";
import { getServerSupabaseClient } from "@/lib/supabase/server";

function PersonRow({ profile, action }: { profile: ProfileRow; action: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-background-elevated p-3">
      <Link href={`/u/${profile.username}`} className="flex items-center gap-3">
        <Avatar url={profile.avatar_url} label={profile.display_name ?? profile.username} />
        <div>
          <p className="text-sm text-text-primary">{profile.display_name ?? profile.username}</p>
          <p className="text-xs text-text-secondary">@{profile.username}</p>
        </div>
      </Link>
      {action}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-xl text-text-primary">{title}</h2>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default async function FriendsPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [friendships, follows] = await Promise.all([
    listFriendships(supabase, user.id),
    listFollows(supabase, user.id),
  ]);

  const incoming = friendships.filter((f) => f.addressee_id === user.id && f.status === "pending");
  const outgoing = friendships.filter((f) => f.requester_id === user.id && f.status === "pending");
  const accepted = friendships.filter((f) => f.status === "accepted");
  const following = follows.filter((f) => f.follower_id === user.id);
  const followers = follows.filter((f) => f.followee_id === user.id);

  const otherProfileId = (f: FriendshipRow) => (f.requester_id === user.id ? f.addressee_id : f.requester_id);
  const otherFollowId = (f: FollowRow, side: "follower_id" | "followee_id") => f[side];

  const profileIds = Array.from(
    new Set([
      ...friendships.map(otherProfileId),
      ...following.map((f) => f.followee_id),
      ...followers.map((f) => f.follower_id),
    ]),
  );
  const profiles = await getProfilesByIds(supabase, profileIds);
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-2xl text-text-primary">Friends</h1>

      <div className="mt-6">
        <UserSearch viewerId={user.id} />
      </div>

      <Section title="Friend requests">
        {incoming.length === 0 ? (
          <p className="text-sm text-text-secondary">No pending requests.</p>
        ) : (
          incoming.map((f) => {
            const profile = profileById.get(otherProfileId(f));
            if (!profile) return null;
            const state: FriendshipState = { status: "pending_incoming", friendshipId: f.id };
            return (
              <PersonRow
                key={f.id}
                profile={profile}
                action={<FriendshipButton profileId={profile.id} initialState={state} />}
              />
            );
          })
        )}
      </Section>

      <Section title="Sent requests">
        {outgoing.length === 0 ? (
          <p className="text-sm text-text-secondary">No outgoing requests.</p>
        ) : (
          outgoing.map((f) => {
            const profile = profileById.get(otherProfileId(f));
            if (!profile) return null;
            const state: FriendshipState = { status: "pending_outgoing", friendshipId: f.id };
            return (
              <PersonRow
                key={f.id}
                profile={profile}
                action={<FriendshipButton profileId={profile.id} initialState={state} />}
              />
            );
          })
        )}
      </Section>

      <Section title="Friends">
        {accepted.length === 0 ? (
          <p className="text-sm text-text-secondary">No friends yet.</p>
        ) : (
          accepted.map((f) => {
            const profile = profileById.get(otherProfileId(f));
            if (!profile) return null;
            const state: FriendshipState = { status: "accepted", friendshipId: f.id };
            return (
              <PersonRow
                key={f.id}
                profile={profile}
                action={<FriendshipButton profileId={profile.id} initialState={state} />}
              />
            );
          })
        )}
      </Section>

      <Section title="Following">
        {following.length === 0 ? (
          <p className="text-sm text-text-secondary">You&rsquo;re not following anyone yet.</p>
        ) : (
          following.map((f) => {
            const profile = profileById.get(otherFollowId(f, "followee_id"));
            if (!profile) return null;
            return (
              <PersonRow
                key={f.id}
                profile={profile}
                action={<FollowButton profileId={profile.id} initialFollowing />}
              />
            );
          })
        )}
      </Section>

      <Section title="Followers">
        {followers.length === 0 ? (
          <p className="text-sm text-text-secondary">No followers yet.</p>
        ) : (
          followers.map((f) => {
            const profile = profileById.get(otherFollowId(f, "follower_id"));
            if (!profile) return null;
            return (
              <PersonRow
                key={f.id}
                profile={profile}
                action={<FollowButton profileId={profile.id} initialFollowing={false} />}
              />
            );
          })
        )}
      </Section>
    </div>
  );
}
