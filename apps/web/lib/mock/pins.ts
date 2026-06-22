import { pinsToFeatureCollection, type PinForMap } from "@wanderloom/domain";

const MOCK_PINS: PinForMap[] = [
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
  {
    id: "pin-3",
    place_id: "place-3",
    trip_id: "trip-2",
    trip_slug: "barcelona-weekend",
    post_id: "post-3",
    owner_id: "user-2",
    visibility: "public",
    place_name: "Sagrada Familia",
    location: { lat: 41.4036, lng: 2.1744 },
  },
];

export const MOCK_PIN_FEATURE_COLLECTION = pinsToFeatureCollection(MOCK_PINS);
