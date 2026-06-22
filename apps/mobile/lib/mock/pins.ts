import type { PinForMap } from "@wanderloom/domain";

export const MOCK_PINS: PinForMap[] = [
  {
    id: "pin-1",
    place_id: "place-1",
    trip_id: "trip-1",
    trip_slug: "nyc-and-la",
    post_id: "post-1",
    owner_id: "user-1",
    visibility: "public",
    place_name: "Statue of Liberty",
    location: { lat: 40.6892, lng: -74.0445 },
  },
  {
    id: "pin-2",
    place_id: "place-2",
    trip_id: "trip-1",
    trip_slug: "nyc-and-la",
    post_id: "post-2",
    owner_id: "user-1",
    visibility: "public",
    place_name: "Griffith Observatory",
    location: { lat: 34.1184, lng: -118.3004 },
  },
];
