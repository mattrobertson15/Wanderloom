import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripBySlug, listPostsForTrip } from "@wanderloom/api";
import type { WanderloomClient } from "@wanderloom/db";
import { PostCard, type PostCardData } from "@/components/post-card";
import { VisibilityBadge } from "@/components/visibility-badge";
import { getServerSupabaseClient } from "@/lib/supabase/server";

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
  const { data: trip } = await supabase.from("trips").select("title").eq("slug", tripSlug).single();
  return {
    title: trip ? `${trip.title} · Wanderloom` : "Trip · Wanderloom",
    openGraph: trip ? { images: [FALLBACK_COVER_IMAGE_URL] } : undefined,
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === trip.owner_id;

  const postCards: PostCardData[] = posts.map((post) => ({
    title: post.title,
    body: post.body,
    photoUrl: null,
    placeName: (post.places as { name: string } | null)?.name ?? null,
    postDate: post.post_date,
  }));

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
          <p className="mt-6 text-sm text-text-secondary">No posts yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {postCards.map((post, i) => (
              <PostCard key={i} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
