import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { VisibilityBadge } from "@/components/visibility-badge";
import { MOCK_POSTS, MOCK_TRIPS } from "@/lib/mock/trips";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tripSlug: string }>;
}): Promise<Metadata> {
  const { tripSlug } = await params;
  const trip = MOCK_TRIPS.find((t) => t.slug === tripSlug);
  return {
    title: trip ? `${trip.title} · Wanderloom` : "Trip · Wanderloom",
    openGraph: trip ? { images: [trip.coverImageUrl] } : undefined,
  };
}

// Public trip page — SSR/ISR, no auth required. Visibility enforcement for
// anonymous/friend/owner viewers is implemented server-side in Session 10
// using packages/domain's canViewTrip/canViewPost against a real session.
export default async function PublicTripPage({ params }: { params: Promise<{ tripSlug: string }> }) {
  const { tripSlug } = await params;
  const trip = MOCK_TRIPS.find((t) => t.slug === tripSlug) ?? MOCK_TRIPS[0]!;

  return (
    <main className="min-h-screen bg-background-base">
      <div
        className="aspect-[16/6] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
      />
      <div className="mx-auto max-w-4xl px-6 py-8 md:px-12">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl text-text-primary">{trip.title}</h1>
          <VisibilityBadge visibility={trip.visibility} />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {MOCK_POSTS.map((post, i) => (
            <PostCard key={i} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
