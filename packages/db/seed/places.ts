export interface SeedPlace {
  name: string;
  category: "landmark" | "restaurant" | "lodging" | "activity" | "nature" | "city" | "other";
  lat: number;
  lng: number;
  countryCode: string;
}

/** Well-known global places used to populate seed trips/posts/pins. */
export const SEED_PLACES: SeedPlace[] = [
  { name: "Statue of Liberty", category: "landmark", lat: 40.6892, lng: -74.0445, countryCode: "US" },
  { name: "Central Park", category: "nature", lat: 40.7851, lng: -73.9683, countryCode: "US" },
  { name: "Griffith Observatory", category: "landmark", lat: 34.1184, lng: -118.3004, countryCode: "US" },
  { name: "Venice Beach", category: "nature", lat: 33.9850, lng: -118.4695, countryCode: "US" },
  { name: "Eiffel Tower", category: "landmark", lat: 48.8584, lng: 2.2945, countryCode: "FR" },
  { name: "Louvre Museum", category: "landmark", lat: 48.8606, lng: 2.3376, countryCode: "FR" },
  { name: "Shibuya Crossing", category: "city", lat: 35.6595, lng: 139.7004, countryCode: "JP" },
  { name: "Fushimi Inari Shrine", category: "landmark", lat: 34.9671, lng: 135.7727, countryCode: "JP" },
  { name: "Sagrada Familia", category: "landmark", lat: 41.4036, lng: 2.1744, countryCode: "ES" },
  { name: "Blue Lagoon", category: "nature", lat: 63.8804, lng: -22.4495, countryCode: "IS" },
];
