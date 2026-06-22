"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { attachPhotoToPost, createPost, uploadPostPhoto, useWanderloomClient } from "@wanderloom/api";
import type { Visibility } from "@wanderloom/config";
import { createPostSchema } from "@wanderloom/validation";
import { VisibilitySelector } from "./visibility-selector";

export function NewPostForm({
  tripId,
  tripSlug,
  defaultVisibility,
}: {
  tripId: string;
  tripSlug: string;
  defaultVisibility: Visibility;
}) {
  const router = useRouter();
  const client = useWanderloomClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postDate, setPostDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(defaultVisibility);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    setPhotos(Array.from(event.target.files ?? []));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = createPostSchema.safeParse({
      trip_id: tripId,
      title: title || undefined,
      body: body || undefined,
      post_date: postDate || undefined,
      visibility,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid post details");
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
      const post = await createPost(client, user.id, parsed.data);
      for (const [index, file] of photos.entries()) {
        const path = await uploadPostPhoto(client, user.id, post.id, file, file.name, file.type);
        await attachPhotoToPost(client, user.id, { post_id: post.id, storage_path: path, sort_order: index });
      }
      router.push(`/t/${tripSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create post");
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
          className="rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
          placeholder="First morning in Manhattan"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Body
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
          placeholder="What happened?"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Date
        <input
          type="date"
          value={postDate}
          onChange={(e) => setPostDate(e.target.value)}
          className="rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        Photos
        <input type="file" accept="image/*" multiple onChange={handlePhotosChange} className="text-text-primary" />
        {photos.length > 0 && (
          <span className="text-xs text-text-secondary">{photos.length} photo(s) selected</span>
        )}
      </label>
      <VisibilitySelector value={visibility} onChange={setVisibility} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-pill bg-accent-primary px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {loading ? "Posting…" : "Add post"}
      </button>
    </form>
  );
}
