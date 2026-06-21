import type { Visibility } from "@wanderloom/config";

export interface MockTrip {
  slug: string;
  title: string;
  visibility: Visibility;
  dateRange: string;
  coverImageUrl: string;
}

export const MOCK_TRIPS: MockTrip[] = [
  {
    slug: "america-2026",
    title: "America 2026",
    visibility: "public",
    dateRange: "Mar 10 – Mar 20, 2026",
    coverImageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
  },
  {
    slug: "family-trip-to-japan",
    title: "Family Trip to Japan",
    visibility: "friends",
    dateRange: "Apr 1 – Apr 10, 2026",
    coverImageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
  },
  {
    slug: "spain-and-iceland",
    title: "Spain & Iceland",
    visibility: "public",
    dateRange: "May 1 – May 14, 2026",
    coverImageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
  },
];
