import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSignedPhotoUrl, getTripBySlug, listAlbumsForTrip, listPostsForTrip } from "@wanderloom/api";
import type { WanderloomClient } from "@wanderloom/db";
import { PostCard, type PostCardData } from "@/components/post-card";
import { ShareLinkButton } from "@/components/share-link-button";
import { VisibilityBadge } from "@/components/visibility-badge";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

const FALLBACK_COVER_IMAGE_URL = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

async function loadTripOrNotFound(supabase: WanderloomClient, slug: string) {
  try {
    return await getTripBySlug(supabase, slug);
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tripSlug: string }>;
}): Promise<Metadata> {
  const { tripSlug } = await params;
  const supabase = await getServerSupabaseClient();
  const { data: trip } = await supabase.from("trips").select("title, description").eq("slug", tripSlug).single();
  if (!trip) {
    return { title: "Trip · Wanderloom" };
  }
  const title = `${trip.title} · Wanderloom`;
  const description = trip.description ?? `Follow along on ${trip.title} on Wanderloom.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [FALLBACK_COVER_IMAGE_URL] },
    twitter: { card: "summary_large_image", title, description, images: [FALLBACK_COVER_IMAGE_URL] },
  };
}

// Public trip page — SSR, no auth required for public trips. RLS on the
// `trips`/`posts` tables enforces owner/friend/public visibility against
// whatever session (or anonymous) client renders this page.
export default async function PublicTripPage({ params }: { params: Promise<{ tripSlug: string }> }) {
  const { tripSlug } = await params;
  const supabase = await getServerSupabaseClient();
  const trip = await loadTripOrNotFound(supabase, tripSlug);
  const posts = await listPostsForTrip(supabase, trip.id);
  const albums = await listAlbumsForTrip(supabase, trip.id);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === trip.owner_id;

  // RLS on `photos` already filtered each post's photos to ones the viewer
  // can see; the bucket itself has no select policy, so signing requires
  // the service-role client (see createSignedPhotoUrl).
  const serviceRoleClient = getServiceRoleSupabaseClient();
  const postCards: PostCardData[] = await Promise.all(
    posts.map(async (post) => {
      const photos = (post.photos as { storage_path: string; sort_order: number }[] | null) ?? [];
      const coverPhoto = [...photos].sort((a, b) => a.sort_order - b.sort_order)[0] ?? null;
      const photoUrl = coverPhoto
        ? await createSignedPhotoUrl(serviceRoleClient, coverPhoto.storage_path).catch(() => null)
        : null;
      return {
        title: post.title,
        body: post.body,
        photoUrl,
        placeName: (post.places as { name: string } | null)?.name ?? null,
        postDate: post.post_date,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-background-base">
      <div
        className="aspect-[16/6] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${FALLBACK_COVER_IMAGE_URL})` }}
      />
      <div className="mx-auto max-w-4xl px-6 py-8 md:px-12">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-text-primary">{trip.title}</h1>
            <VisibilityBadge visibility={trip.visibility} />
          </div>
          {isOwner && <ShareLinkButton tripId={trip.id} />}
        </div>
        <div className="mt-8 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-text-primary">Albums</h2>
          {isOwner && (
            <Link
              href={`/t/${trip.slug}/albums/new`}
              className="rounded-pill border border-accent-primary px-4 py-2 text-sm text-accent-primary"
            >
              New album
            </Link>
          )}
        </div>
        {albums.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">No albums yet.</p>
        ) : (
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {albums.map((album) => (
              <div key={album.id} className="rounded-lg bg-background-elevated p-4 shadow-sm">
                <h3 className="font-display text-lg text-text-primary">{album.title}</h3>
                {album.description && (
                  <p className="mt-1 text-sm text-text-secondary">{album.description}</p>
                )}
                {isOwner && (
                  <Link
                    href={`/t/${trip.slug}/albums/${album.id}/edit`}
                    className="mt-2 inline-block text-sm text-accent-primary"
                  >
                    Edit
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-text-primary">Posts</h2>
          {isOwner && (
            <Link
              href={`/t/${trip.slug}/posts/new`}
              className="rounded-pill bg-accent-primary px-4 py-2 text-sm text-white"
            >
              Add post
            </Link>
          )}
        </div>
        {postCards.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">No posts yet.</p>
        ) : (
          <div className="mt-3 grid gap-6 md:grid-cols-3">
            {postCards.map((post, i) => (
              <PostCard key={i} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
