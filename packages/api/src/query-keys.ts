/** Centralized TanStack Query key factory so cache keys stay consistent across apps. */
export const queryKeys = {
  trip: (idOrSlug: string) => ["trip", idOrSlug] as const,
  tripsByOwner: (ownerId: string) => ["trips", "owner", ownerId] as const,
  discoverTrips: (viewerId: string) => ["trips", "discover", viewerId] as const,
  albumsForTrip: (tripId: string) => ["albums", "trip", tripId] as const,
  postsForTrip: (tripId: string) => ["posts", "trip", tripId] as const,
  postsForAlbum: (albumId: string) => ["posts", "album", albumId] as const,
  postsForPlace: (placeId: string) => ["posts", "place", placeId] as const,
  post: (postId: string) => ["post", postId] as const,
  placeSearch: (query: string) => ["places", "search", query] as const,
  pins: () => ["pins"] as const,
  friendships: (profileId: string) => ["friendships", profileId] as const,
  follows: (profileId: string) => ["follows", profileId] as const,
};
