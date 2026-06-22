export interface SeedPlace {
  name: string;
  category: "landmark" | "restaurant" | "lodging" | "activity" | "nature" | "city" | "other";
  lat: number;
  lng: number;
  countryCode: string;
}

/** Well-known global places used to populate seed trips/posts/pins. */
export const SEED_PLACES: SeedPlace[] = [
  // North America - USA
  { name: "Statue of Liberty", category: "landmark", lat: 40.6892, lng: -74.0445, countryCode: "US" },
  { name: "Central Park", category: "nature", lat: 40.7851, lng: -73.9683, countryCode: "US" },
  { name: "Empire State Building", category: "landmark", lat: 40.7484, lng: -73.9857, countryCode: "US" },
  { name: "Brooklyn Bridge", category: "landmark", lat: 40.7061, lng: -73.9969, countryCode: "US" },
  { name: "Griffith Observatory", category: "landmark", lat: 34.1184, lng: -118.3004, countryCode: "US" },
  { name: "Venice Beach", category: "nature", lat: 33.9850, lng: -118.4695, countryCode: "US" },
  { name: "Hollywood Sign", category: "landmark", lat: 34.1348, lng: -118.3219, countryCode: "US" },
  { name: "Golden Gate Bridge", category: "landmark", lat: 37.8199, lng: -122.4783, countryCode: "US" },

  // Europe - France
  { name: "Eiffel Tower", category: "landmark", lat: 48.8584, lng: 2.2945, countryCode: "FR" },
  { name: "Louvre Museum", category: "landmark", lat: 48.8606, lng: 2.3376, countryCode: "FR" },
  { name: "Notre-Dame Cathedral", category: "landmark", lat: 48.8530, lng: 2.3499, countryCode: "FR" },
  { name: "Arc de Triomphe", category: "landmark", lat: 48.8738, lng: 2.2950, countryCode: "FR" },

  // Europe - Spain
  { name: "Sagrada Familia", category: "landmark", lat: 41.4036, lng: 2.1744, countryCode: "ES" },
  { name: "Park Güell", category: "landmark", lat: 41.4145, lng: 2.1525, countryCode: "ES" },
  { name: "Alhambra", category: "landmark", lat: 37.1760, lng: -3.5881, countryCode: "ES" },

  // Europe - Italy
  { name: "Colosseum", category: "landmark", lat: 41.8902, lng: 12.4924, countryCode: "IT" },
  { name: "Trevi Fountain", category: "landmark", lat: 41.9009, lng: 12.4833, countryCode: "IT" },
  { name: "Leaning Tower of Pisa", category: "landmark", lat: 43.3629, lng: 10.3957, countryCode: "IT" },

  // Asia - Japan
  { name: "Shibuya Crossing", category: "city", lat: 35.6595, lng: 139.7004, countryCode: "JP" },
  { name: "Fushimi Inari Shrine", category: "landmark", lat: 34.9671, lng: 135.7727, countryCode: "JP" },
  { name: "Senso-ji Temple", category: "landmark", lat: 35.7148, lng: 139.7967, countryCode: "JP" },
  { name: "Mount Fuji", category: "nature", lat: 35.3616, lng: 138.7277, countryCode: "JP" },

  // Asia - Thailand
  { name: "Grand Palace", category: "landmark", lat: 13.6511, lng: 100.4927, countryCode: "TH" },
  { name: "Wat Pho", category: "landmark", lat: 13.6474, lng: 100.4920, countryCode: "TH" },

  // Europe - Iceland
  { name: "Blue Lagoon", category: "nature", lat: 63.8804, lng: -22.4495, countryCode: "IS" },
  { name: "Keflavík Airport", category: "city", lat: 63.9850, lng: -22.6056, countryCode: "IS" },

  // Additional restaurants and lodging
  { name: "L'Astrance", category: "restaurant", lat: 48.8608, lng: 2.2931, countryCode: "FR" },
  { name: "Noma", category: "restaurant", lat: 55.6847, lng: 12.5903, countryCode: "DK" },
  { name: "The Peninsula Hong Kong", category: "lodging", lat: 22.2963, lng: 114.1743, countryCode: "HK" },
  { name: "Four Seasons Tokyo", category: "lodging", lat: 35.6762, lng: 139.7394, countryCode: "JP" },
];
