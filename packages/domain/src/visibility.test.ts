import { describe, expect, it } from "vitest";
import {
  ANONYMOUS_VIEWER,
  canEditTrip,
  canViewPost,
  canViewTrip,
  effectivePostVisibility,
  type TripLike,
  type ViewerContext,
} from "./visibility";

const OWNER = "owner-1";
const FRIEND = "friend-1";
const STRANGER = "stranger-1";

function viewerOf(id: string | null, opts: Partial<ViewerContext> = {}): ViewerContext {
  return { viewerId: id, friendIds: new Set(), collaboratorRoles: new Map(), ...opts };
}

const friendOfOwner = viewerOf(FRIEND, { friendIds: new Set([OWNER]) });
const stranger = viewerOf(STRANGER);
const anonymous = ANONYMOUS_VIEWER;

function trip(visibility: TripLike["visibility"], id = "trip-1"): TripLike {
  return { id, owner_id: OWNER, visibility };
}

describe("effectivePostVisibility", () => {
  it("takes the more restrictive of post and trip visibility", () => {
    expect(effectivePostVisibility("public", "private")).toBe("private");
    expect(effectivePostVisibility("private", "public")).toBe("private");
    expect(effectivePostVisibility("friends", "public")).toBe("friends");
    expect(effectivePostVisibility("public", "friends")).toBe("friends");
    expect(effectivePostVisibility("public", "public")).toBe("public");
  });
});

describe("canViewTrip", () => {
  const owner = viewerOf(OWNER);

  it.each([
    ["private", owner, true],
    ["private", friendOfOwner, false],
    ["private", stranger, false],
    ["private", anonymous, false],
    ["friends", owner, true],
    ["friends", friendOfOwner, true],
    ["friends", stranger, false],
    ["friends", anonymous, false],
    ["public", owner, true],
    ["public", friendOfOwner, true],
    ["public", stranger, true],
    ["public", anonymous, true],
  ] as const)("trip visibility=%s viewer=%s -> %s", (visibility, viewer, expected) => {
    expect(canViewTrip(trip(visibility), viewer)).toBe(expected);
  });

  it("grants access to trip collaborators regardless of visibility", () => {
    const collaborator = viewerOf("collab-1", {
      collaboratorRoles: new Map([["trip-1", "viewer"]]),
    });
    expect(canViewTrip(trip("private"), collaborator)).toBe(true);
  });
});

describe("canEditTrip", () => {
  it("allows the owner and editor collaborators, not viewers or strangers", () => {
    const editor = viewerOf("editor-1", { collaboratorRoles: new Map([["trip-1", "editor"]]) });
    const readOnly = viewerOf("viewer-1", { collaboratorRoles: new Map([["trip-1", "viewer"]]) });

    expect(canEditTrip(trip("private"), viewerOf(OWNER))).toBe(true);
    expect(canEditTrip(trip("private"), editor)).toBe(true);
    expect(canEditTrip(trip("private"), readOnly)).toBe(false);
    expect(canEditTrip(trip("private"), stranger)).toBe(false);
  });
});

describe("canViewPost", () => {
  it("resolves effective visibility before applying the access rule", () => {
    const t = trip("friends");
    expect(canViewPost({ trip_id: t.id, visibility: "public" }, t, friendOfOwner)).toBe(true);
    expect(canViewPost({ trip_id: t.id, visibility: "public" }, t, stranger)).toBe(false);
    expect(canViewPost({ trip_id: t.id, visibility: "private" }, t, friendOfOwner)).toBe(false);
    expect(canViewPost({ trip_id: t.id, visibility: "private" }, t, viewerOf(OWNER))).toBe(true);
  });
});
