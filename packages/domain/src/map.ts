import type { GeoPoint, Visibility } from "@wanderloom/db";

/**
 * Shared data shaping for map rendering. Mapbox (web GL JS, mobile
 * @rnmapbox/maps) is purely a rendering target — both apps feed it the
 * same GeoJSON shape produced here, derived from `pins` rows.
 */

export interface PinForMap {
  id: string;
  place_id: string;
  trip_id: string;
  post_id: string | null;
  owner_id: string;
  visibility: Visibility;
  place_name: string;
  location: GeoPoint;
}

export type MapFilterScope = "mine" | "friends" | "public";

export interface PinFeatureProperties {
  pinId: string;
  placeId: string;
  tripId: string;
  postId: string | null;
  ownerId: string;
  placeName: string;
}

export interface PinFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: PinFeatureProperties;
}

export interface PinFeatureCollection {
  type: "FeatureCollection";
  features: PinFeature[];
}

export function pinToFeature(pin: PinForMap): PinFeature {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [pin.location.lng, pin.location.lat] },
    properties: {
      pinId: pin.id,
      placeId: pin.place_id,
      tripId: pin.trip_id,
      postId: pin.post_id,
      ownerId: pin.owner_id,
      placeName: pin.place_name,
    },
  };
}

export function pinsToFeatureCollection(pins: readonly PinForMap[]): PinFeatureCollection {
  return { type: "FeatureCollection", features: pins.map(pinToFeature) };
}

/**
 * Filters pins by map scope relative to the current viewer. RLS already
 * restricts which pin rows the client receives; this further narrows the
 * "mine / friends / public" toggle shown on the globe filter pills.
 */
export function filterPinsByScope(
  pins: readonly PinForMap[],
  scope: MapFilterScope,
  viewerId: string | null,
  friendIds: ReadonlySet<string>,
): PinForMap[] {
  switch (scope) {
    case "mine":
      return pins.filter((p) => p.owner_id === viewerId);
    case "friends":
      return pins.filter((p) => p.owner_id !== viewerId && friendIds.has(p.owner_id));
    case "public":
      return pins.filter((p) => p.visibility === "public");
  }
}
