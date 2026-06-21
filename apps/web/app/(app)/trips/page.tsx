import Link from "next/link";
import { redirect } from "next/navigation";
import { listTripsForOwner } from "@wanderloom/api";
import type { TripRow } from "@wanderloom/db";
import { TripCard, type TripCardData } from "@/components/trip-card";
import { getServerSupabaseClient } from "@/lib/supabase/server";

const FALLBACK_COVER_IMAGE_URL = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

type TripWithPins = TripRow & { pins: { place_id: string }[] };

function toTripCardData(trip: TripWithPins): TripCardData {
  return {
    slug: trip.slug,
    title: trip.title,
    coverImageUrl: FALLBACK_COVER_IMAGE_URL,
    startDate: trip.start_date,
    endDate: trip.end_date,
    visibility: trip.visibility,
    placeCount: new Set(trip.pins.map((pin) => pin.place_id)).size,
  };
}

export default async function TripsPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const trips = (await listTripsForOwner(supabase, user.id)) as TripWithPins[];

  return (
    <div className="px-6 py-6 md:px-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-text-primary">Your trips</h1>
        <Link href="/trips/new" className="rounded-pill bg-accent-primary px-4 py-2 text-sm text-white">
          New trip
        </Link>
      </div>
      {trips.length === 0 ? (
        <p className="text-sm text-text-secondary">No trips yet. Start one to put your first pin on the map.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={toTripCardData(trip)} />
          ))}
        </div>
      )}
    </div>
  );
}
