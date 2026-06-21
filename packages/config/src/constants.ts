export const VISIBILITY_LEVELS = ["private", "friends", "public"] as const;
export type Visibility = (typeof VISIBILITY_LEVELS)[number];

/** Lower index = more restrictive. Used to resolve "effective visibility". */
export const VISIBILITY_RANK: Record<Visibility, number> = {
  private: 0,
  friends: 1,
  public: 2,
};

export const PLACE_CATEGORIES = [
  "landmark",
  "restaurant",
  "lodging",
  "activity",
  "nature",
  "city",
  "other",
] as const;
export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export const FRIEND_STATUSES = ["pending", "accepted", "blocked"] as const;
export type FriendStatus = (typeof FRIEND_STATUSES)[number];

export const COLLABORATOR_ROLES = ["viewer", "editor"] as const;
export type CollaboratorRole = (typeof COLLABORATOR_ROLES)[number];

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  tripCovers: "trip-covers",
  postPhotos: "post-photos",
} as const;

/**
 * Mobile map projection capability flag. Flip to false for platforms/SDK
 * versions where Mapbox globe projection is unstable; map components fall
 * back to standard Mercator projection. See docs/ARCHITECTURE.md.
 */
export const MOBILE_GLOBE_PROJECTION_ENABLED = true;
