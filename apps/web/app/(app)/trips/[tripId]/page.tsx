import { PostCard } from "@/components/post-card";
import { MOCK_POSTS } from "@/lib/mock/trips";

export default async function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  return (
    <div className="px-6 py-6 md:px-12">
      <p className="text-xs uppercase tracking-wide text-text-secondary">Trip</p>
      <h1 className="font-display text-3xl text-text-primary">{tripId.replace(/-/g, " ")}</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {MOCK_POSTS.map((post, i) => (
          <PostCard key={i} post={post} />
        ))}
      </div>
    </div>
  );
}
