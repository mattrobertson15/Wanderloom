import type { Metadata } from "next";
import { TripCard } from "@/components/trip-card";
import { MOCK_TRIPS } from "@/lib/mock/trips";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} · Wanderloom` };
}

// Public profile page — SSR/ISR, no auth required. Real data wiring lands
// in Session 10; this renders mock content scoped as if `is_public_profile`
// were true and only public trips were returned.
export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const publicTrips = MOCK_TRIPS.filter((t) => t.visibility === "public");

  return (
    <main className="min-h-screen bg-background-base px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-accent-secondary/20" />
          <div>
            <h1 className="font-display text-2xl text-text-primary">@{username}</h1>
            <p className="text-sm text-text-secondary">Public Wanderloom profile</p>
          </div>
        </div>
        <h2 className="mt-10 font-display text-xl text-text-primary">Public trips</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {publicTrips.map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
        </div>
      </div>
    </main>
  );
}
