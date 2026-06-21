import type { TripCardData } from "@/components/trip-card";
import type { PostCardData } from "@/components/post-card";

/** Static mock data for visual scaffolding before live Supabase data is wired up (Session 04). */
export const MOCK_TRIPS: TripCardData[] = [
  {
    slug: "america-2026",
    title: "America 2026",
    coverImageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    startDate: "2026-03-10",
    endDate: "2026-03-20",
    visibility: "public",
    placeCount: 4,
  },
  {
    slug: "family-trip-to-japan",
    title: "Family Trip to Japan",
    coverImageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
    startDate: "2026-04-01",
    endDate: "2026-04-10",
    visibility: "friends",
    placeCount: 2,
  },
  {
    slug: "spain-and-iceland",
    title: "Spain & Iceland",
    coverImageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
    startDate: "2026-05-01",
    endDate: "2026-05-14",
    visibility: "public",
    placeCount: 3,
  },
];

export const MOCK_POSTS: PostCardData[] = [
  {
    title: "First morning in Manhattan",
    body: "Woke up early to catch the ferry out to Liberty Island.",
    photoUrl: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800",
    placeName: "Statue of Liberty",
    postDate: "2026-03-11",
  },
  {
    title: "Sunset at Griffith",
    body: "Best view of the city right before sunset.",
    photoUrl: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
    placeName: "Griffith Observatory",
    postDate: "2026-03-16",
  },
  {
    title: "Gaudi's masterpiece",
    body: "Still being built, still breathtaking.",
    photoUrl: "https://images.unsplash.com/photo-1583779457094-ab6798c2b711?w=800",
    placeName: "Sagrada Familia",
    postDate: "2026-05-03",
  },
];
