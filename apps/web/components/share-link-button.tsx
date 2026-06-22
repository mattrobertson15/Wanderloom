"use client";

import { useState } from "react";
import { createShareLink, useWanderloomClient } from "@wanderloom/api";

export function ShareLinkButton({ tripId }: { tripId: string }) {
  const client = useWanderloomClient();
  const [status, setStatus] = useState<"idle" | "loading" | "copied" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      setStatus("error");
      return;
    }

    try {
      const link = await createShareLink(client, user.id, { trip_id: tripId });
      const url = `${window.location.origin}/share/${link.token}`;
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "loading"}
      className="rounded-pill border border-text-secondary/30 px-4 py-2 text-sm text-text-primary disabled:opacity-60"
    >
      {status === "copied" ? "Link copied!" : status === "error" ? "Couldn't create link" : "Share"}
    </button>
  );
}
