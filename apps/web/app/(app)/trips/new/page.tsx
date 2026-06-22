"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createTrip, useWanderloomClient } from "@wanderloom/api";
import type { Visibility } from "@wanderloom/config";
import { createTripSchema } from "@wanderloom/validation";
import { VisibilitySelector } from "@/components/visibility-selector";

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "trip"}-${suffix}`;
}

export default function NewTripPage() {
  const router = useRouter();
  const client = useWanderloomClient();
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = createTripSchema.safeParse({ title, slug: slugify(title), visibility });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid trip details");
      return;
    }

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
      const trip = await createTrip(client, user.id, parsed.data);
      router.push(`/t/${trip.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create trip");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="font-display text-2xl text-text-primary">Start a new trip</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
            placeholder="America 2026"
          />
        </label>
        <VisibilitySelector value={visibility} onChange={setVisibility} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-pill bg-accent-primary px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create trip"}
        </button>
      </form>
    </div>
  );
}
