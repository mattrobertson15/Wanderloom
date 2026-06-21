# Roadmap

## Phase 1 — Foundation / Docs / Scaffold
- All `/docs` files (this set).
- Monorepo scaffold (pnpm + Turborepo).
- App shells: `apps/web`, `apps/mobile`.
- Shared package placeholders: `api`, `config`, `db`, `domain`, `ui`, `validation`.
- Lint/typecheck/test wiring across workspaces.

## Phase 2 — Core Trip/Post/Place Model
- Supabase project schema: trips, albums, posts, places, photos.
- `packages/validation` Zod schemas for all entities.
- `packages/domain` models and visibility resolution logic.
- `packages/api` CRUD functions for trips/albums/posts/places/photos.
- Photo upload pipeline to Supabase Storage.

## Phase 3 — Map/Globe Experience
- Pins derivation (table + trigger or view).
- Mapbox GL JS globe view on web.
- `@rnmapbox/maps` globe/map view on mobile with fallback projection.
- Map data transform helpers in shared packages (domain → GeoJSON).
- Client-side clustering for dense pin areas.

## Phase 4 — Social / Friends / Follows
- Friendship request/accept/decline/remove flows.
- Follow/unfollow flows.
- Trip collaborators (invite, roles, access).
- Visibility enforcement end-to-end (RLS + domain logic + UI gating).

## Phase 5 — Public Sharing / Discovery
- Public profile pages (`/u/[username]`).
- Public trip pages (`/t/[tripSlug]`).
- Shareable trip links (`/share/[token]`).
- Friends/public map layer filters on the globe.
- Basic discovery browse surfaces (e.g. "public trips" index).

## Phase 6 — AI Enhancements
- Caption/tag suggestions.
- Trip summary generation.
- Public guide generation from a trip.
- (Future) EXIF extraction, photo clustering by location/date, auto timeline, itinerary generation, friend-based recommendations, chat with memories.

## Phase 7 — Monetization / Ads / Analytics
- Internal usage analytics surfaced to admin/internal dashboards.
- Ad impression event infrastructure and eventual ad placements (non-intrusive, globe/discovery surfaces first).
- Revisit storage-based monetization only if ad model underperforms (explicitly deprioritized per locked decisions).
- Creator-facing analytics (profile/trip views, follower growth) as a potential premium surface.
