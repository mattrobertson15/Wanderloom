# Architecture

## System Overview

Wanderloom is a monorepo containing two client apps (web, mobile) backed by a single Supabase project (Postgres + PostGIS, Auth, Storage). Shared business logic, types, validation, and API access live in packages consumed by both apps. Mapbox renders map/globe UI on both platforms but never owns product data — it is purely a rendering layer driven by Wanderloom's own Trip/Album/Post/Place/Pin model.

```txt
┌─────────────┐     ┌─────────────┐
│  apps/web   │     │ apps/mobile │
│  (Next.js)  │     │   (Expo)    │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │  packages/api     │  Supabase queries/mutations, TanStack Query hooks
        │  packages/domain  │  Domain models, permission/visibility logic
        │  packages/validation │ Zod schemas
        │  packages/db      │  Generated DB types, migrations, seed
        │  packages/config  │  Env schema, constants, design tokens
        │  packages/ui      │  Cross-platform-safe primitives (tokens, icons, pure logic)
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │     Supabase       │
        │  Postgres+PostGIS  │
        │  Auth / Storage    │
        │  Row-Level Security│
        └────────────────────┘
```

## App Structure

### apps/web (Next.js, App Router)
- `app/(marketing)/` — landing page, public marketing routes
- `app/(auth)/` — sign in / sign up
- `app/(app)/` — authenticated app shell: globe, trips, profile, settings
- `app/u/[username]/` — public profile pages (SSR/ISR, no auth required)
- `app/t/[tripSlug]/` — public trip pages (SSR/ISR, no auth required)
- `app/share/[token]/` — shareable trip link resolver

### apps/mobile (Expo, React Navigation / Expo Router)
- `app/(auth)/` — login/signup
- `app/(tabs)/` — globe/map, trips, create, friends/discovery, profile
- `app/trip/[id]/` — trip detail, album detail, post detail
- `app/place/[id]/` — place detail (posts attached to a place)

Both apps consume `packages/api`, `packages/domain`, `packages/validation`, `packages/config`, and `packages/db` types. Each app owns its own UI components; `packages/ui` only holds things that are genuinely platform-agnostic (design tokens, icon name constants, pure formatting/map-transform functions) — not actual rendered components shared verbatim across React DOM and React Native.

## Shared Packages

| Package | Responsibility |
|---|---|
| `packages/db` | Supabase-generated TypeScript types, SQL migrations, seed scripts |
| `packages/domain` | Domain entities, visibility/permission resolution, trip/album/post business rules |
| `packages/validation` | Zod schemas for every mutable entity (Trip, Album, Post, Place, Profile, Friend/Follow requests) |
| `packages/api` | Supabase client factory, typed query/mutation functions, TanStack Query hook factories |
| `packages/config` | Env var schema/validation (Zod), shared constants, design tokens (color/type/spacing) |
| `packages/ui` | Token consumers and pure helpers usable by both DOM and RN (e.g. map data transforms, color utilities) — not heavy components |

## Supabase Architecture

- Single Supabase project per environment (local dev via Supabase CLI, staging, production).
- Postgres with the `postgis` extension enabled for `Place.location` (a `geography(Point, 4326)` column) and any future geo queries (radius search, clustering).
- Database access pattern: clients use the Supabase JS client with the anon key and rely on RLS for authorization. A service-role key is used only in trusted server contexts (Next.js route handlers / server actions) for operations RLS can't express cleanly (e.g. admin seed scripts, analytics aggregation).
- Migrations are plain SQL files in `packages/db/migrations`, applied via the Supabase CLI. `packages/db` also exports generated TypeScript types (`supabase gen types typescript`).

## Auth Architecture

- Supabase Auth, email/password only at MVP.
- Google and Apple OAuth buttons are rendered on both web and mobile sign-in/up screens but are `disabled` with a `TODO(auth-oauth)` comment — no provider wiring, no client IDs configured.
- Session handling: Supabase's standard JS/RN SDK session persistence (cookies via `@supabase/ssr` on web, secure storage on mobile via `expo-secure-store`).
- A `profiles` table (1:1 with `auth.users`) holds public-facing identity (username, display name, avatar, bio, visibility default) and is created via a Postgres trigger on `auth.users` insert.

## Map Provider Architecture

- **Web**: Mapbox GL JS, globe projection (`projection: 'globe'`) on the main discovery/globe view, standard Mercator for embedded/detail map views (e.g. a single trip's map). Wanderloom-owned React components wrap Mapbox and translate Pin/Place data into GeoJSON sources/layers.
- **Mobile**: `@rnmapbox/maps`, globe projection where supported by the underlying Mapbox Maps SDK version in use; falls back to standard projection if globe mode is unstable on a given platform/OS version. A single capability flag in `packages/config` controls this fallback so both platforms can be tuned independently.
- Mapbox is purely a rendering target. All clustering/filtering logic that determines *which* pins to show (visibility, friend/public scoping, trip/place association) happens in `packages/domain` and `packages/api`, producing plain GeoJSON-ready data structures that either app's map layer consumes identically in shape.

## Media Upload Architecture

- Supabase Storage buckets: `avatars` (public-read), `trip-covers` (public-read, scoped by visibility at the app layer), `post-photos` (access governed by signed URLs / RLS-backed bucket policies matching the owning Post's visibility).
- Upload flow: client requests a signed upload (or uses the Supabase Storage client directly with RLS-backed bucket policies) → uploads photo → inserts a `photos` row referencing the storage path → photo is associated with a Post.
- Photos only at MVP (no video). EXIF extraction is not performed at MVP — `photos.taken_at` and `photos.location` are user/post-supplied, not auto-extracted (roadmap item, see AI_FEATURES.md).
- Image variants (thumbnail/full) are deferred; MVP serves the original upload via Supabase's image transformation (resize-on-request) where convenient, otherwise raw URL.

## Permissions Architecture

- Visibility is modeled per-Trip and per-Post (`private | friends | public`) — a Post's effective visibility is the more restrictive of its own setting and its parent Trip's setting, resolved in `packages/domain`.
- RLS policies in Postgres are the source of truth for enforcement; `packages/domain` mirrors the same logic for UI-level decisions (e.g. should we show an edit button) but never substitutes for RLS.
- Trip collaborators have a role (`viewer | editor`) stored in `trip_collaborators`, granting access beyond the owner regardless of the trip's general visibility.
- Friend relationships are symmetric and approval-gated (`pending → accepted`); follow relationships are asymmetric and unapproved.

## Web/Mobile Separation

- No shared component library renders identical JSX across web and mobile. Each app has its own component layer.
- Shared logic boundary: anything that is pure data/logic (types, schemas, permission checks, API calls, map data shaping, formatting helpers) lives in packages. Anything that renders pixels is platform-specific.
- Design tokens (colors, spacing, type scale, radii) are shared as plain JS/TS objects in `packages/config` (or `packages/ui/tokens`) and consumed by Tailwind (web) and a RN styling approach (mobile) independently.

## Deployment Assumptions

- **Web**: deployed to Vercel (Next.js-native). Public profile/trip pages use ISR for SEO + freshness balance.
- **Mobile**: built/distributed via EAS (Expo Application Services); MVP can run via Expo Go or internal distribution before store submission.
- **Supabase**: hosted Supabase project per environment (local dev uses the Supabase CLI + Docker for parity).
- **CI**: Turborepo-aware CI running lint/typecheck/test on PRs; migrations applied via Supabase CLI in a deploy step, not ad hoc.
