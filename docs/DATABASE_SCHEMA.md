# Database Schema

Postgres + PostGIS via Supabase. This document sketches the MVP schema. Authoritative SQL lives in `packages/db/migrations`.

## Enums

```sql
create type visibility as enum ('private', 'friends', 'public');
create type friend_status as enum ('pending', 'accepted', 'blocked');
create type collaborator_role as enum ('viewer', 'editor');
create type place_category as enum (
  'landmark', 'restaurant', 'lodging', 'activity', 'nature', 'city', 'other'
);
create type event_type as enum (
  'media_upload', 'storage_usage', 'ai_usage', 'ad_impression',
  'public_page_view', 'share_link_created', 'share_link_visited',
  'follow_created', 'friend_request_sent', 'friend_request_accepted'
);
```

## Initial Table List

### `profiles`
1:1 with `auth.users`. Public-facing identity.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | = `auth.users.id` |
| username | text unique | URL-safe handle, used in `/u/[username]` |
| display_name | text | |
| bio | text | nullable |
| avatar_url | text | nullable, points to `avatars` bucket |
| home_location | geography(Point,4326) | nullable, optional "based in" pin |
| default_visibility | visibility | default `'private'` |
| is_public_profile | boolean | gates whether `/u/[username]` resolves publicly |
| created_at | timestamptz | |

Created via trigger on `auth.users` insert.

### `trips`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| owner_id | uuid FK → profiles | |
| title | text | |
| description | text | nullable |
| cover_photo_id | uuid FK → photos | nullable |
| start_date | date | nullable |
| end_date | date | nullable |
| visibility | visibility | |
| slug | text unique | for `/t/[tripSlug]` and shareable links |
| created_at / updated_at | timestamptz | |

### `albums`
("Albums/Collections" — same table, optionally generalized later)

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK → trips | |
| title | text | e.g. "New York" |
| description | text | nullable |
| cover_photo_id | uuid FK → photos | nullable |
| sort_order | int | |
| created_at / updated_at | timestamptz | |

### `posts`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK → trips | required — every post belongs to a trip |
| album_id | uuid FK → albums | nullable — a post can be trip-level or album-level |
| place_id | uuid FK → places | nullable at the DB level, required by product flow in practice |
| author_id | uuid FK → profiles | usually = trip owner, but supports collaborators |
| title | text | nullable |
| body | text | nullable |
| post_date | date | when the moment happened (distinct from `created_at`) |
| visibility | visibility | own override; effective visibility = min(post.visibility, trip.visibility) |
| created_at / updated_at | timestamptz | |

### `places` (global, reusable)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | e.g. "Statue of Liberty" |
| category | place_category | |
| location | geography(Point,4326) | PostGIS point, indexed via GiST |
| address | text | nullable |
| country_code | text | nullable, ISO-3166 alpha-2 |
| created_by | uuid FK → profiles | nullable, attribution for user-created places |
| created_at | timestamptz | |

Places are never owned by a single user/trip. Deduplication strategy at MVP: simple name+proximity search when authoring a post; merge tooling is a roadmap concern.

### `photos`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| post_id | uuid FK → posts | nullable (cover photos may not belong to a post) |
| uploader_id | uuid FK → profiles | |
| storage_path | text | path within `post-photos`/`trip-covers`/`avatars` bucket |
| width / height | int | nullable |
| taken_at | timestamptz | nullable, user-supplied at MVP (no EXIF extraction) |
| location | geography(Point,4326) | nullable, user-supplied at MVP |
| sort_order | int | |
| created_at | timestamptz | |

### `pins`
Map-renderable join representing "this Place is visible on the map because of this Trip/Post." Modeled as a derived/materialized concept rather than hand-authored content.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| place_id | uuid FK → places | |
| trip_id | uuid FK → trips | |
| post_id | uuid FK → posts | nullable — a pin can represent a trip-level place with no specific post yet |
| owner_id | uuid FK → profiles | denormalized for fast map queries scoped by viewer |
| visibility | visibility | denormalized effective visibility, kept in sync via trigger |
| created_at | timestamptz | |

MVP can implement `pins` as a real table maintained by triggers (on post/trip insert/update) for query simplicity, or as a SQL view; the doc assumes a **table + trigger** approach for indexing/performance, with a view as a simpler fallback if triggers add too much complexity early on.

### `friendships`
Symmetric, approval-gated.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| requester_id | uuid FK → profiles | |
| addressee_id | uuid FK → profiles | |
| status | friend_status | |
| created_at / updated_at | timestamptz | |

Unique constraint on `(least(requester_id,addressee_id), greatest(requester_id,addressee_id))` to prevent duplicate pairs.

### `follows`
Asymmetric, no approval.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| follower_id | uuid FK → profiles | |
| followee_id | uuid FK → profiles | |
| created_at | timestamptz | |

Unique on `(follower_id, followee_id)`.

### `trip_collaborators`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK → trips | |
| profile_id | uuid FK → profiles | |
| role | collaborator_role | |
| invited_by | uuid FK → profiles | |
| created_at | timestamptz | |

### `share_links`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| token | text unique | random, used in `/share/[token]` |
| trip_id | uuid FK → trips | nullable (could extend to posts later) |
| created_by | uuid FK → profiles | |
| created_at | timestamptz | |
| expires_at | timestamptz | nullable |

### `events`
Internal analytics/usage tracking (not user-facing at MVP).

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| profile_id | uuid FK → profiles | nullable (anonymous public views) |
| type | event_type | |
| metadata | jsonb | event-specific payload |
| created_at | timestamptz | |

## Relationships Summary

```txt
profiles 1—* trips
trips 1—* albums
trips 1—* posts (direct, trip-level)
albums 1—* posts
posts *—1 places
posts 1—* photos
places 1—* photos (via post's photos, indirectly)
trips *—* profiles (via trip_collaborators)
profiles *—* profiles (via friendships, symmetric)
profiles *—* profiles (via follows, asymmetric)
trips 1—* share_links
trips/posts -> pins (derived, scoped by place+visibility)
```

## Visibility Model

- `visibility` enum lives on both `trips` and `posts`.
- **Effective visibility of a post** = the more restrictive of its own `visibility` and its parent `trip.visibility` (private < friends < public ordering).
- Viewer access rule, in order:
  1. Owner always has access.
  2. `editor`/`viewer` trip collaborators always have access.
  3. If effective visibility is `public`, anyone (including anonymous) has access.
  4. If `friends`, viewer must have an `accepted` friendship row with the owner.
  5. If `private`, only owner/collaborators.
- This rule is implemented twice intentionally: once as Postgres RLS policies (source of truth), once as a pure function in `packages/domain` (for UI decisions) — kept in sync by shared tests against fixture data.

## Friend/Follow Model

- **Friendship**: symmetric, requires acceptance. Grants access to `friends`-visibility content in both directions once `status = 'accepted'`.
- **Follow**: asymmetric, no acceptance. Grants access only to `public`-visibility content (i.e., it doesn't actually unlock anything beyond what's already public — it's a discovery/notification relationship, not an access-control relationship). This keeps the access model simple: only `friendships` ever gate `friends`-visibility content.

## Collaborator Model

- `trip_collaborators` grants `viewer` or `editor` access to a specific trip regardless of the trip's general visibility setting, for co-travelers who want to add posts to a shared trip (`editor`) or simply view it (`viewer`) without it being public or requiring friendship.

## RLS Assumptions

- RLS is **enabled on every table** containing user content.
- Read policies implement the visibility model above per-table (trips/posts/photos/places-via-posts/pins).
- Write policies: a row can be inserted/updated/deleted only by its owner or a trip collaborator with `editor` role (for trip-scoped content).
- `places` are readable by everyone (global reference data); insert is allowed by any authenticated user (to support "create a new place" during post authoring), with no update/delete by non-admins at MVP (merge/cleanup is an admin/roadmap concern).
- `events` are insert-only from the client (via RPC or service role from server actions); select is service-role/admin only.
- Service-role key bypasses RLS and is used only in trusted server contexts (seed scripts, admin tooling, aggregate analytics jobs) — never shipped to a client bundle.

## PostGIS / Place Modeling

- `postgis` extension enabled in the Supabase project.
- `places.location` and `photos.location` are `geography(Point, 4326)` (lat/lng, WGS84) — `geography` chosen over `geometry` for simpler distance/radius queries without manual SRID math.
- GiST index on `places.location` and `photos.location` for proximity queries (`ST_DWithin`) used in "is this place already nearby" dedup checks and future radius search.
- Pin clustering/aggregation logic for the map (grouping nearby pins at low zoom) happens client-side in `packages/domain`/`packages/ui` map-transform helpers at MVP scale — server-side clustering (`ST_ClusterDBSCAN`) is a roadmap optimization for scale.

## Storage Bucket Assumptions

| Bucket | Access | Contents |
|---|---|---|
| `avatars` | public-read | profile avatar images |
| `trip-covers` | public-read at bucket level; app enforces visibility for which covers are *linked* in public UI | trip/album cover photos |
| `post-photos` | private, access via RLS-backed signed URLs matching post visibility | post photo uploads |

## Seed Data Plan

`packages/db/seed` provides a script that creates:
- 3–5 seed profiles (mix of public and friends-only defaults).
- A handful of well-known global `places` (Statue of Liberty, Central Park, Griffith Observatory, Venice Beach, Eiffel Tower, etc.) with real coordinates.
- 2–3 seed trips per seed user spanning private/friends/public visibility, each with 1–2 albums and several posts/photos attached to the seeded places, so the globe, trip pages, and profiles are populated for visual QA without manual setup.
- A few seed friendships (accepted) and follows between seed profiles to populate social surfaces.
