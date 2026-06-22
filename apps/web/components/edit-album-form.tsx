"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { deleteAlbum, updateAlbum, useWanderloomClient } from "@wanderloom/api";
import { updateAlbumSchema } from "@wanderloom/validation";

export function EditAlbumForm({
  albumId,
  tripSlug,
  initialTitle,
  initialDescription,
}: {
  albumId: string;
  tripSlug: string;
  initialTitle: string;
  initialDescription: string;
}) {
  const router = useRouter();
  const client = useWanderloomClient();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = updateAlbumSchema.safeParse({
      title,
      description: description || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid album details");
      return;
    }

    setLoading(true);
    try {
      await updateAlbum(client, albumId, parsed.data);
      router.push(`/t/${tripSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update album");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this album? Posts in it will remain but lose their album link.")) return;
    setLoading(true);
    try {
      await deleteAlbum(client, albumId);
      router.push(`/t/${tripSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete album");
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
      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-pill bg-accent-primary px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-pill px-4 py-2 text-sm text-red-600 disabled:opacity-60"
        >
          Delete album
        </button>
      </div>
    </form>
  );
}
