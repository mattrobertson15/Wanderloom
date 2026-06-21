import { TripCard } from "@/components/trip-card";
import { MOCK_TRIPS } from "@/lib/mock/trips";

export default function ProfilePage() {
  return (
    <div className="px-6 py-6 md:px-12">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-accent-secondary/20" />
        <div>
          <h1 className="font-display text-2xl text-text-primary">Your profile</h1>
          <p className="text-sm text-text-secondary">@you · Edit your bio and avatar here.</p>
        </div>
      </div>
      <h2 className="mt-8 font-display text-xl text-text-primary">Your trips</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {MOCK_TRIPS.map((trip) => (
          <TripCard key={trip.slug} trip={trip} />
        ))}
      </div>
    </div>
  );
}
