import { VISIBILITY_RANK, type Visibility } from "@wanderloom/config";

/**
 * Mirrors the Postgres RLS logic in packages/db/migrations/0006-0008.
 * This is the UI-decision copy (e.g. "show an edit button") — it never
 * substitutes for RLS, which remains the enforcement source of truth.
 */

export interface ViewerContext {
  /** null for an anonymous/logged-out visitor. */
  viewerId: string | null;
  /** Profile ids the viewer has an accepted friendship with. */
  friendIds: ReadonlySet<string>;
  /** Trip ids where the viewer is a collaborator, mapped to their role. */
  collaboratorRoles: ReadonlyMap<string, "viewer" | "editor">;
}

export interface TripLike {
  id: string;
  owner_id: string;
  visibility: Visibility;
}

export interface PostLike {
  trip_id: string;
  visibility: Visibility;
}

export const ANONYMOUS_VIEWER: ViewerContext = {
  viewerId: null,
  friendIds: new Set(),
  collaboratorRoles: new Map(),
};

export function effectivePostVisibility(postVisibility: Visibility, tripVisibility: Visibility): Visibility {
  return VISIBILITY_RANK[postVisibility] <= VISIBILITY_RANK[tripVisibility] ? postVisibility : tripVisibility;
}

function isFriendOf(viewer: ViewerContext, profileId: string): boolean {
  return viewer.friendIds.has(profileId);
}

function collaboratorRole(viewer: ViewerContext, tripId: string): "viewer" | "editor" | null {
  return viewer.collaboratorRoles.get(tripId) ?? null;
}

export function canViewTrip(trip: TripLike, viewer: ViewerContext): boolean {
  if (viewer.viewerId === trip.owner_id) return true;
  if (collaboratorRole(viewer, trip.id) !== null) return true;
  if (trip.visibility === "public") return true;
  if (trip.visibility === "friends") return isFriendOf(viewer, trip.owner_id);
  return false;
}

export function canEditTrip(trip: TripLike, viewer: ViewerContext): boolean {
  if (viewer.viewerId === trip.owner_id) return true;
  return collaboratorRole(viewer, trip.id) === "editor";
}

export function canViewPost(post: PostLike, trip: TripLike, viewer: ViewerContext): boolean {
  if (viewer.viewerId === trip.owner_id) return true;
  if (collaboratorRole(viewer, trip.id) !== null) return true;
  const effective = effectivePostVisibility(post.visibility, trip.visibility);
  if (effective === "public") return true;
  if (effective === "friends") return isFriendOf(viewer, trip.owner_id);
  return false;
}

export function canEditPost(trip: TripLike, viewer: ViewerContext): boolean {
  return canEditTrip(trip, viewer);
}
