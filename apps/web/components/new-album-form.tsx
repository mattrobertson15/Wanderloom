"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createAlbum, useWanderloomClient } from "@wanderloom/api";
import { createAlbumSchema } from "@wanderloom/validation";

export function NewAlbumForm({ tripId, tripSlug }: { tripId: string; tripSlug: string }) {
  const router = useRouter();
  const client = useWanderloomClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = createAlbumSchema.safeParse({
      trip_id: tripId,
      title,
      description: description || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid album details");
      return;
    }

    setLoading(true);
    try {
      await createAlbum(client, parsed.data);
      router.push(`/t/${tripSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create album");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
          placeholder="Tokyo"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
          placeholder="What's this album about?"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-pill bg-accent-primary px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create album"}
      </button>
    </form>
  );
}
