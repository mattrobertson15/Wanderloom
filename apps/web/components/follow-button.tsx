"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { followProfile, unfollowProfile, useWanderloomClient } from "@wanderloom/api";

export function FollowButton({ profileId, initialFollowing }: { profileId: string; initialFollowing: boolean }) {
  const router = useRouter();
  const client = useWanderloomClient();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      setLoading(false);
      router.push("/sign-in");
      return;
    }

    try {
      if (following) {
        await unfollowProfile(client, user.id, profileId);
        setFollowing(false);
      } else {
        await followProfile(client, user.id, profileId);
        setFollowing(true);
      }
    } catch {
      // leave state unchanged on failure
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded-pill border border-text-secondary/30 px-4 py-2 text-sm text-text-primary disabled:opacity-60"
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
