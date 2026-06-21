/**
 * Hand-authored Supabase database types matching packages/db/migrations.
 * Once a live Supabase project exists, regenerate with:
 *   supabase gen types typescript --linked > packages/db/src/generated.ts
 * and re-export from here instead.
 */
import type { CollaboratorRole, FriendStatus, PlaceCategory, Visibility } from "@wanderloom/config";

export type { CollaboratorRole, FriendStatus, PlaceCategory, Visibility };

export type EventType =
  | "media_upload"
  | "storage_usage"
  | "ai_usage"
  | "ad_impression"
  | "public_page_view"
  | "share_link_created"
  | "share_link_visited"
  | "follow_created"
  | "friend_request_sent"
  | "friend_request_accepted";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ProfileRow {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  home_location: GeoPoint | null;
  default_visibility: Visibility;
  is_public_profile: boolean;
  created_at: string;
}

export interface PlaceRow {
  id: string;
  name: string;
  category: PlaceCategory;
  location: GeoPoint;
  address: string | null;
  country_code: string | null;
  created_by: string | null;
  created_at: string;
}

export interface TripRow {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  cover_photo_id: string | null;
  start_date: string | null;
  end_date: string | null;
  visibility: Visibility;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface AlbumRow {
  id: string;
  trip_id: string;
  title: string;
  description: string | null;
  cover_photo_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PostRow {
  id: string;
  trip_id: string;
  album_id: string | null;
  place_id: string | null;
  author_id: string;
  title: string | null;
  body: string | null;
  post_date: string | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
}

export interface PhotoRow {
  id: string;
  post_id: string | null;
  uploader_id: string;
  storage_path: string;
  width: number | null;
  height: number | null;
  taken_at: string | null;
  location: GeoPoint | null;
  sort_order: number;
  created_at: string;
}

export interface PinRow {
  id: string;
  place_id: string;
  trip_id: string;
  post_id: string | null;
  owner_id: string;
  visibility: Visibility;
  created_at: string;
}

export interface FriendshipRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendStatus;
  created_at: string;
  updated_at: string;
}

export interface FollowRow {
  id: string;
  follower_id: string;
  followee_id: string;
  created_at: string;
}

export interface TripCollaboratorRow {
  id: string;
  trip_id: string;
  profile_id: string;
  role: CollaboratorRole;
  invited_by: string | null;
  created_at: string;
}

export interface ShareLinkRow {
  id: string;
  token: string;
  trip_id: string | null;
  created_by: string;
  created_at: string;
  expires_at: string | null;
}

export interface EventRow {
  id: string;
  profile_id: string | null;
  type: EventType;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ProfileInsert {
  id: string;
  username: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  home_location?: GeoPoint | null;
  default_visibility?: Visibility;
  is_public_profile?: boolean;
}
export type ProfileUpdate = Partial<Omit<ProfileInsert, "id">>;

export interface PlaceInsert {
  name: string;
  category: PlaceCategory;
  /** WKT, e.g. `SRID=4326;POINT(lng lat)` — PostGIS parses this on insert. */
  location: string;
  address?: string | null;
  country_code?: string | null;
  created_by?: string | null;
}
export type PlaceUpdate = Partial<PlaceInsert>;

export interface TripInsert {
  owner_id: string;
  title: string;
  slug: string;
  description?: string | null;
  cover_photo_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  visibility?: Visibility;
}
export type TripUpdate = Partial<Omit<TripInsert, "owner_id">>;

export interface AlbumInsert {
  trip_id: string;
  title: string;
  description?: string | null;
  cover_photo_id?: string | null;
  sort_order?: number;
}
export type AlbumUpdate = Partial<Omit<AlbumInsert, "trip_id">>;

export interface PostInsert {
  trip_id: string;
  author_id: string;
  album_id?: string | null;
  place_id?: string | null;
  title?: string | null;
  body?: string | null;
  post_date?: string | null;
  visibility?: Visibility;
}
export type PostUpdate = Partial<Omit<PostInsert, "trip_id" | "author_id">>;

export interface PhotoInsert {
  uploader_id: string;
  storage_path: string;
  post_id?: string | null;
  width?: number | null;
  height?: number | null;
  taken_at?: string | null;
  /** WKT, e.g. `SRID=4326;POINT(lng lat)`. */
  location?: string | null;
  sort_order?: number;
}
export type PhotoUpdate = Partial<Omit<PhotoInsert, "uploader_id">>;

export interface PinInsert {
  place_id: string;
  trip_id: string;
  owner_id: string;
  visibility: Visibility;
  post_id?: string | null;
}
export type PinUpdate = Partial<PinInsert>;

export interface FriendshipInsert {
  requester_id: string;
  addressee_id: string;
  status?: FriendStatus;
}
export type FriendshipUpdate = Partial<Omit<FriendshipInsert, "requester_id" | "addressee_id">>;

export interface FollowInsert {
  follower_id: string;
  followee_id: string;
}
export type FollowUpdate = Partial<FollowInsert>;

export interface TripCollaboratorInsert {
  trip_id: string;
  profile_id: string;
  role: CollaboratorRole;
  invited_by?: string | null;
}
export type TripCollaboratorUpdate = Partial<Omit<TripCollaboratorInsert, "trip_id" | "profile_id">>;

export interface ShareLinkInsert {
  token: string;
  created_by: string;
  trip_id?: string | null;
  expires_at?: string | null;
}
export type ShareLinkUpdate = Partial<Omit<ShareLinkInsert, "created_by">>;

export interface EventInsert {
  type: EventType;
  profile_id?: string | null;
  metadata?: Record<string, unknown>;
}
export type EventUpdate = Partial<EventInsert>;

/**
 * Every table declares an empty `Relationships` array — embedded-resource
 * typing isn't used; relations are fetched via explicit `select("*, foo(*)")`
 * calls and typed loosely at the call site.
 *
 * Declared with `type` (not `interface`): supabase-js's generic helpers check
 * `Database[Schema]["Tables"] extends Record<string, GenericTable>`, and
 * interface-shaped object types don't satisfy index-signature constraints in
 * that position the way type-literal aliases do.
 */
export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: ProfileInsert; Update: ProfileUpdate; Relationships: [] };
      places: { Row: PlaceRow; Insert: PlaceInsert; Update: PlaceUpdate; Relationships: [] };
      trips: { Row: TripRow; Insert: TripInsert; Update: TripUpdate; Relationships: [] };
      albums: { Row: AlbumRow; Insert: AlbumInsert; Update: AlbumUpdate; Relationships: [] };
      posts: { Row: PostRow; Insert: PostInsert; Update: PostUpdate; Relationships: [] };
      photos: { Row: PhotoRow; Insert: PhotoInsert; Update: PhotoUpdate; Relationships: [] };
      pins: { Row: PinRow; Insert: PinInsert; Update: PinUpdate; Relationships: [] };
      friendships: { Row: FriendshipRow; Insert: FriendshipInsert; Update: FriendshipUpdate; Relationships: [] };
      follows: { Row: FollowRow; Insert: FollowInsert; Update: FollowUpdate; Relationships: [] };
      trip_collaborators: {
        Row: TripCollaboratorRow;
        Insert: TripCollaboratorInsert;
        Update: TripCollaboratorUpdate;
        Relationships: [];
      };
      share_links: { Row: ShareLinkRow; Insert: ShareLinkInsert; Update: ShareLinkUpdate; Relationships: [] };
      events: { Row: EventRow; Insert: EventInsert; Update: EventUpdate; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
