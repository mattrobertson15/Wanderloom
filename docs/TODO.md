# TODO

Organized by area. Check items off as sessions complete. This list is a practical backlog, not a spec — see linked docs for detail.

## Foundation
- [x] Create `/docs` documentation set
- [x] Scaffold pnpm + Turborepo monorepo
- [x] Create `apps/web` and `apps/mobile` shells
- [x] Create `packages/{api,config,db,domain,ui,validation}` placeholders
- [ ] Set up shared ESLint/Prettier/TS config across workspaces
- [ ] Set up CI (lint, typecheck, test) on PRs

## Database
- [x] Write SQL migrations for all tables/enums (`packages/db/migrations`)
- [x] Enable `postgis` extension
- [x] Add GiST indexes on geography columns
- [x] Write RLS policies for trips/albums/posts/photos/places/pins
- [x] Implement `pins` derivation (trigger-maintained table or view)
- [ ] Generate TypeScript types from schema (currently hand-authored stub in `packages/db/src/types.ts`; switch to `supabase gen types` once a live project exists)
- [x] Write seed script (profiles, places, trips, albums, posts, photos, friendships, follows)

## Auth
- [x] Configure Supabase email/password auth
- [x] `profiles` creation trigger on `auth.users` insert
- [x] Web: Supabase session handling via `@supabase/ssr`
- [x] Mobile: Supabase session handling via `expo-secure-store`
- [x] Disabled Google/Apple button stubs (web + mobile) with `TODO(auth-oauth)`

## Web
- [x] Landing page
- [x] Auth screens (sign in, sign up)
- [x] Authenticated app shell + nav
- [x] Trip list/detail/create (real Supabase queries; no edit/delete UI yet)
- [x] Album create/edit nested in trip
- [x] Post create (title/body/date/visibility, owner-gated at `/t/[tripSlug]/posts/new`; photo attach now wired; no edit/delete UI, no place attach yet)
- [x] Globe/map view with pins + filters (mock pin data)
- [x] Visibility controls (private/friends/public) (wired on trip-create and post-create forms)
- [x] Public profile page (`/u/[username]`) (mock public trips)
- [x] Public trip page (`/t/[tripSlug]`)
- [x] Shareable link generation + `/share/[token]` resolver
- [x] Friends/follow basic UI (`/friends` page, user search, follow/friend-request buttons; wired into `/u/[username]` header)
- [x] Open Graph meta tags for public pages (trip page, public profile page, plus site-wide defaults in root layout)

## Mobile
- [x] Login/signup screens
- [x] Tab navigation (Globe, Trips, Create, Discover, Profile)
- [x] Globe/map view
- [ ] Trip list/detail view (list only, mock data; no detail route)
- [ ] Post creation flow
- [ ] Photo upload flow
- [ ] Place search/attach/create flow
- [ ] Visibility selector
- [ ] Browse friends'/public trips

## Maps
- [x] Shared GeoJSON transform helpers (`packages/domain`/`packages/ui`)
- [x] Web: Mapbox GL JS globe view
- [x] Mobile: `@rnmapbox/maps` globe view with Mercator fallback flag
- [ ] Client-side pin clustering
- [ ] Pin tap → preview → navigate

## Media
- [x] Storage buckets: `avatars`, `trip-covers`, `post-photos`
- [x] Storage bucket RLS/access policies
- [x] Web photo upload flow
- [ ] Mobile photo upload flow
- [ ] Basic upload retry handling

## Social
- [x] Friend request send/accept/decline/remove
- [x] Follow/unfollow
- [ ] Trip collaborator invite/manage (viewer/editor) (RLS policies exist; no API functions or UI)
- [x] Visibility enforcement tests (owner/collaborator/friend/public/anonymous matrix)

## Public Sharing
- [x] Public profile page rendering rules
- [x] Public trip page rendering rules
- [x] Shareable link generation + resolution
- [ ] Public trips discovery/browse index

## AI
- [ ] Caption suggestion helper
- [ ] Tag suggestion helper
- [ ] Trip summary generation
- [ ] Public guide generation (template-based MVP, upgradeable later)
- [ ] Server-side AI call boundary (route handler / edge function, never client-direct)
- [ ] `ai_usage` event tracking

## Testing
- [x] Unit tests for `packages/domain` visibility/permission logic
- [ ] Unit tests for `packages/validation` schemas
- [ ] RLS policy tests (direct DB probing, not just UI)
- [ ] End-to-end smoke test of core loop (signup → trip → post → pin) on web
- [ ] End-to-end smoke test of core loop on mobile

## Deployment
- [ ] Vercel deployment for `apps/web`
- [ ] EAS setup for `apps/mobile`
- [ ] Supabase environment separation (local/staging/production)
- [ ] CI migration deploy step
