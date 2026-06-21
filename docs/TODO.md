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
- [ ] Write SQL migrations for all tables/enums (`packages/db/migrations`)
- [ ] Enable `postgis` extension
- [ ] Add GiST indexes on geography columns
- [ ] Write RLS policies for trips/albums/posts/photos/places/pins
- [ ] Implement `pins` derivation (trigger-maintained table or view)
- [ ] Generate TypeScript types from schema
- [ ] Write seed script (profiles, places, trips, albums, posts, photos, friendships, follows)

## Auth
- [ ] Configure Supabase email/password auth
- [ ] `profiles` creation trigger on `auth.users` insert
- [ ] Web: Supabase session handling via `@supabase/ssr`
- [ ] Mobile: Supabase session handling via `expo-secure-store`
- [ ] Disabled Google/Apple button stubs (web + mobile) with `TODO(auth-oauth)`

## Web
- [ ] Landing page
- [ ] Auth screens (sign in, sign up)
- [ ] Authenticated app shell + nav
- [ ] Trip list/detail/create/edit
- [ ] Album create/edit nested in trip
- [ ] Post create/edit (title/body/date/photos/place)
- [ ] Globe/map view with pins + filters
- [ ] Visibility controls (private/friends/public)
- [ ] Public profile page (`/u/[username]`)
- [ ] Public trip page (`/t/[tripSlug]`)
- [ ] Shareable link generation + `/share/[token]` resolver
- [ ] Friends/follow basic UI
- [ ] Open Graph meta tags for public pages

## Mobile
- [ ] Login/signup screens
- [ ] Tab navigation (Globe, Trips, Create, Discover, Profile)
- [ ] Globe/map view
- [ ] Trip list/detail view
- [ ] Post creation flow
- [ ] Photo upload flow
- [ ] Place search/attach/create flow
- [ ] Visibility selector
- [ ] Browse friends'/public trips

## Maps
- [ ] Shared GeoJSON transform helpers (`packages/domain`/`packages/ui`)
- [ ] Web: Mapbox GL JS globe view
- [ ] Mobile: `@rnmapbox/maps` globe view with Mercator fallback flag
- [ ] Client-side pin clustering
- [ ] Pin tap → preview → navigate

## Media
- [ ] Storage buckets: `avatars`, `trip-covers`, `post-photos`
- [ ] Storage bucket RLS/access policies
- [ ] Web photo upload flow
- [ ] Mobile photo upload flow
- [ ] Basic upload retry handling

## Social
- [ ] Friend request send/accept/decline/remove
- [ ] Follow/unfollow
- [ ] Trip collaborator invite/manage (viewer/editor)
- [ ] Visibility enforcement tests (owner/collaborator/friend/public/anonymous matrix)

## Public Sharing
- [ ] Public profile page rendering rules
- [ ] Public trip page rendering rules
- [ ] Shareable link generation + resolution
- [ ] Public trips discovery/browse index

## AI
- [ ] Caption suggestion helper
- [ ] Tag suggestion helper
- [ ] Trip summary generation
- [ ] Public guide generation (template-based MVP, upgradeable later)
- [ ] Server-side AI call boundary (route handler / edge function, never client-direct)
- [ ] `ai_usage` event tracking

## Testing
- [ ] Unit tests for `packages/domain` visibility/permission logic
- [ ] Unit tests for `packages/validation` schemas
- [ ] RLS policy tests (direct DB probing, not just UI)
- [ ] End-to-end smoke test of core loop (signup → trip → post → pin) on web
- [ ] End-to-end smoke test of core loop on mobile

## Deployment
- [ ] Vercel deployment for `apps/web`
- [ ] EAS setup for `apps/mobile`
- [ ] Supabase environment separation (local/staging/production)
- [ ] CI migration deploy step
