import Link from "next/link";
import { TripCard } from "@/components/trip-card";
import { MOCK_TRIPS } from "@/lib/mock/trips";

export default function TripsPage() {
  return (
    <div className="px-6 py-6 md:px-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-text-primary">Your trips</h1>
        <Link href="/trips/new" className="rounded-pill bg-accent-primary px-4 py-2 text-sm text-white">
          New trip
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {MOCK_TRIPS.map((trip) => (
          <TripCard key={trip.slug} trip={trip} />
        ))}
      </div>
    </div>
  );
}
