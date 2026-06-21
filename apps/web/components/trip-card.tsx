import Link from "next/link";
import { formatDateRange } from "@wanderloom/ui";
import type { Visibility } from "@wanderloom/config";
import { VisibilityBadge } from "./visibility-badge";

export interface TripCardData {
  slug: string;
  title: string;
  coverImageUrl: string;
  startDate: string | null;
  endDate: string | null;
  visibility: Visibility;
  placeCount: number;
}

export function TripCard({ trip }: { trip: TripCardData }) {
  return (
    <Link
      href={`/t/${trip.slug}`}
      className="group relative block overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className="aspect-[4/3] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-display text-xl leading-tight">{trip.title}</h3>
        <p className="mt-1 text-sm text-white/80">{formatDateRange(trip.startDate, trip.endDate)}</p>
      </div>
      <div className="absolute right-3 top-3">
        <VisibilityBadge visibility={trip.visibility} />
      </div>
    </Link>
  );
}
