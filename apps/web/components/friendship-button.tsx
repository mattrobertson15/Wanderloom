"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeFriendship, respondToFriendRequest, sendFriendRequest, useWanderloomClient } from "@wanderloom/api";

export type FriendshipState =
  | { status: "none" }
  | { status: "pending_outgoing"; friendshipId: string }
  | { status: "pending_incoming"; friendshipId: string }
  | { status: "accepted"; friendshipId: string };

export function FriendshipButton({ profileId, initialState }: { profileId: string; initialState: FriendshipState }) {
  const router = useRouter();
  const client = useWanderloomClient();
  const [state, setState] = useState<FriendshipState>(initialState);
  const [loading, setLoading] = useState(false);

  async function withLoading(fn: () => Promise<void>) {
    setLoading(true);
    try {
      await fn();
    } catch {
      // RLS/unique-constraint failures just leave the button in its current state.
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    await withLoading(async () => {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      const friendship = await sendFriendRequest(client, user.id, { addressee_id: profileId });
      setState({ status: "pending_outgoing", friendshipId: friendship.id });
    });
  }

  async function handleAccept() {
    if (state.status !== "pending_incoming") return;
    const { friendshipId } = state;
    await withLoading(async () => {
      const friendship = await respondToFriendRequest(client, { friendship_id: friendshipId, status: "accepted" });
      setState({ status: "accepted", friendshipId: friendship.id });
    });
  }

  async function handleRemove() {
    if (state.status === "none") return;
    const { friendshipId } = state;
    await withLoading(async () => {
      await removeFriendship(client, friendshipId);
      setState({ status: "none" });
    });
  }

  const buttonClass = "rounded-pill border border-text-secondary/30 px-4 py-2 text-sm text-text-primary disabled:opacity-60";

  if (state.status === "none") {
    return (
      <button type="button" onClick={handleSend} disabled={loading} className={buttonClass}>
        Add friend
      </button>
    );
  }

  if (state.status === "pending_outgoing") {
    return (
      <button type="button" onClick={handleRemove} disabled={loading} className={buttonClass}>
        Cancel request
      </button>
    );
  }

  if (state.status === "pending_incoming") {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleAccept}
          disabled={loading}
          className="rounded-pill bg-accent-primary px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          Accept
        </button>
        <button type="button" onClick={handleRemove} disabled={loading} className={buttonClass}>
          Decline
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={handleRemove} disabled={loading} className={buttonClass}>
      Friends ✓
    </button>
  );
}
