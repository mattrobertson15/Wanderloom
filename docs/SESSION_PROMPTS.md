# Session Prompts

Each session is scoped to be completable independently by an agent with the listed context. Read the referenced docs before starting each session. Sessions are intentionally sequential — later sessions assume earlier ones are complete.

---

## Session 01: Documentation and Repo Scaffold

**Goal:** Establish `/docs` and the monorepo skeleton so all later sessions have a place to build into.

**Context to read first:** This entire `/docs` folder.

**Files likely touched:** `/docs/*`, root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `apps/web` shell, `apps/mobile` shell, `packages/*` placeholders, `.gitignore`, `.env.example`.

**Tasks:**
- Create all docs listed in README's documentation index.
- Scaffold pnpm workspace + Turborepo config.
- Create `apps/web` (Next.js + TS) and `apps/mobile` (Expo + TS) minimal runnable shells.
- Create `packages/{api,config,db,domain,ui,validation}` with `package.json` + `tsconfig.json` + an index entry point each.
- Add root `.gitignore`, `.env.example`, root `tsconfig` base.

**Acceptance criteria:**
- `pnpm install` succeeds at the root.
- `pnpm --filter web dev` boots a Next.js dev server with a placeholder page.
- `pnpm --filter mobile start` boots Expo.
- All docs exist and are internally consistent with the locked decisions.

**Suggested agent prompt:**
> Scaffold the Wanderloom monorepo per `/docs/ARCHITECTURE.md` and `/docs/README.md`. Create pnpm workspaces, Turborepo config, and minimal runnable shells for `apps/web` and `apps/mobile`, plus placeholder packages for `api/config/db/domain/ui/validation`. Don't implement product features yet — this session is scaffolding only.

---

## Session 02: Supabase Schema and Auth Foundation

**Goal:** Stand up the real Postgres schema, RLS, and Supabase Auth wiring.

**Context to read first:** `DATABASE_SCHEMA.md`, `ARCHITECTURE.md` (Supabase/Auth sections).

**Files likely touched:** `packages/db/migrations/*.sql`, `packages/db/seed/*`, `packages/config` (env schema), `apps/web` Supabase client setup, `apps/mobile` Supabase client setup.

**Tasks:**
- Write SQL migrations for all tables/enums in `DATABASE_SCHEMA.md`.
- Enable `postgis` extension; add geography columns + GiST indexes.
- Write RLS policies implementing the visibility model.
- Add `profiles` creation trigger on `auth.users` insert.
- Configure Supabase Auth (email/password) and Supabase client helpers for web (`@supabase/ssr`) and mobile (`expo-secure-store` session persistence).
- Add disabled Google/Apple button stubs in both apps' auth screens with `TODO(auth-oauth)`.

**Acceptance criteria:**
- Migrations apply cleanly to a fresh Supabase instance.
- A test query as an authenticated user can only read rows it should be able to per the visibility model (manually verified via a few representative RLS test queries).
- Email/password sign-up creates a `profiles` row automatically.

**Suggested agent prompt:**
> Implement the Supabase database schema from `/docs/DATABASE_SCHEMA.md` as SQL migrations in `packages/db/migrations`, including PostGIS columns, enums, and RLS policies matching the visibility model. Wire up Supabase email/password auth in both `apps/web` and `apps/mobile` with disabled Google/Apple button stubs. Do not build trip/post UI yet.

---

## Session 03: Shared Packages and Domain Models

**Goal:** Build out `packages/validation`, `packages/domain`, and `packages/api` with real logic.

**Context to read first:** `DATABASE_SCHEMA.md`, `ARCHITECTURE.md` (shared packages section), `PRD.md` (functional requirements).

**Files likely touched:** `packages/validation/src/*`, `packages/domain/src/*`, `packages/api/src/*`, `packages/db/src/types.ts` (generated types).

**Tasks:**
- Generate/define TypeScript types for all tables (via `supabase gen types typescript` or hand-authored matching the schema).
- Zod schemas for Trip, Album, Post, Place, Profile, FriendRequest, Follow, TripCollaborator create/update payloads.
- Domain functions: effective visibility resolution, access-check functions (`canView`, `canEdit`), friend/follow state helpers.
- API layer: typed CRUD functions per entity using the Supabase client, plus TanStack Query hook factories consumed by both apps.

**Acceptance criteria:**
- All schemas/domain functions have unit tests covering the visibility matrix (owner/collaborator/friend/public/anonymous × private/friends/public).
- `packages/api` functions are usable from both `apps/web` and `apps/mobile` without modification.

**Suggested agent prompt:**
> Build out `packages/validation`, `packages/domain`, and `packages/api` per `/docs/DATABASE_SCHEMA.md` and `/docs/ARCHITECTURE.md`. Include Zod schemas, visibility/permission domain logic with unit tests, and typed Supabase CRUD functions exposed as TanStack Query hook factories for trips, albums, posts, places, photos, friendships, and follows.

---

## Session 04: Web App Shell and Design System

**Goal:** Build the Next.js app shell, navigation, and base design system per `DESIGN_DIRECTION.md`.

**Context to read first:** `DESIGN_DIRECTION.md`, `ARCHITECTURE.md` (app structure).

**Files likely touched:** `apps/web/app/*`, `apps/web/components/*`, `packages/config` (tokens), Tailwind config.

**Tasks:**
- Set up Tailwind (or chosen styling approach) consuming shared design tokens from `packages/config`.
- Build route groups: `(marketing)`, `(auth)`, `(app)`.
- Build base layout chrome: nav, auth-aware header, globe-first authenticated home placeholder.
- Implement Trip/Post card components (visual only, can use mock data).

**Acceptance criteria:**
- Landing page, sign-in/up screens, and an authenticated shell render with on-brand styling.
- Trip/Post cards match the editorial direction in `DESIGN_DIRECTION.md` (warm, photo-forward, soft elevation).

**Suggested agent prompt:**
> Build the Next.js app shell for `apps/web` per `/docs/DESIGN_DIRECTION.md` and `/docs/ARCHITECTURE.md`: route groups for marketing/auth/app, a design-token-driven styling setup, and Trip/Post card components using mock data. No live Supabase data wiring required yet beyond auth.

---

## Session 05: Mobile App Shell and Navigation

**Goal:** Build the Expo app shell, tab navigation, and base screens.

**Context to read first:** `DESIGN_DIRECTION.md` (mobile guidance), `ARCHITECTURE.md` (mobile app structure).

**Files likely touched:** `apps/mobile/app/*`, `apps/mobile/components/*`.

**Tasks:**
- Set up Expo Router navigation: `(auth)` stack, `(tabs)` (Globe, Trips, Create, Discover, Profile).
- Build base screens with mock data matching the web equivalents conceptually (not pixel-identical).
- Wire Supabase auth session into navigation guarding (redirect unauthenticated users to `(auth)`).

**Acceptance criteria:**
- App boots in Expo Go/dev client, navigates between tabs, and gates authenticated routes.
- Visual language is recognizably the same brand as web without being a literal copy of web components.

**Suggested agent prompt:**
> Build the Expo Router app shell for `apps/mobile` with `(auth)` and `(tabs)` navigation (Globe, Trips, Create, Discover, Profile) per `/docs/DESIGN_DIRECTION.md` and `/docs/ARCHITECTURE.md`. Use mock data; wire only auth-state-based route guarding for now.

---

## Session 06: Trip and Album CRUD

**Goal:** Real create/edit/delete flows for Trips and Albums on both platforms.

**Context to read first:** `PRD.md` (J1), `DATABASE_SCHEMA.md`, `packages/api`/`packages/validation` from Session 03.

**Files likely touched:** `apps/web/app/(app)/trips/*`, `apps/mobile/app/trip/*`, shared `packages/api` trip/album functions (extend if needed).

**Tasks:**
- Web: trip list, trip detail, create/edit trip form, album create/edit nested in trip detail.
- Mobile: trip list, trip detail, create/edit trip flow, album create/edit.
- Visibility selector UI (private/friends/public) on both platforms.

**Acceptance criteria:**
- A user can create a trip, edit it, add albums, and delete a trip, on both web and mobile, with changes persisted via Supabase and respecting RLS.

**Suggested agent prompt:**
> Implement real Trip and Album CRUD on `apps/web` and `apps/mobile` using `packages/api`/`packages/validation` from Session 03, including a visibility selector per `/docs/DATABASE_SCHEMA.md`'s visibility model. Reference `/docs/PRD.md` journey J1.

---

## Session 07: Posts, Photos, and Places

**Goal:** Real post authoring with photo upload and place attach/search/create.

**Context to read first:** `PRD.md` (J1), `DATABASE_SCHEMA.md` (places/photos), `ARCHITECTURE.md` (media upload architecture).

**Files likely touched:** `apps/web/app/(app)/.../posts/*`, `apps/mobile/app/trip/.../post/*`, `packages/api` (photo upload, place search/create), Supabase Storage bucket policies.

**Tasks:**
- Place search UI (typeahead over existing `places`) with "create new place" fallback (name + map-pick coordinates or geocoding input).
- Post create/edit form: title, body, date, place attach, photo upload (multi-photo).
- Photo upload to `post-photos` bucket on both platforms with basic retry on failure.

**Acceptance criteria:**
- A user can create a post with at least one photo and an attached place (existing or newly created), on both platforms, and it persists correctly with photos visible afterward.

**Suggested agent prompt:**
> Implement Post authoring (title/body/date/photos/place) on `apps/web` and `apps/mobile`, including place search-or-create and photo upload to Supabase Storage, per `/docs/DATABASE_SCHEMA.md` and `/docs/ARCHITECTURE.md`'s media upload architecture.

---

## Session 08: Mapbox Globe/Pin Rendering

**Goal:** Render real Pins on the globe on both platforms, derived from visible trips/posts/places.

**Context to read first:** `ARCHITECTURE.md` (map provider architecture), `DATABASE_SCHEMA.md` (pins).

**Files likely touched:** `packages/domain`/`packages/ui` (GeoJSON transform helpers), `apps/web` map component (Mapbox GL JS), `apps/mobile` map component (`@rnmapbox/maps`).

**Tasks:**
- Implement `pins` derivation (table+trigger or view) if not done in Session 02.
- Build a shared (logic-only) transform from pin rows → GeoJSON features.
- Web: Mapbox GL JS globe view consuming the transform, with mine/friends/public filter pills.
- Mobile: `@rnmapbox/maps` view with the same filters, globe projection with Mercator fallback.
- Pin tap → lightweight preview → navigate to place/post/trip.

**Acceptance criteria:**
- Globe renders seed-data pins correctly scoped to the current viewer's visibility on both platforms.
- Filter pills (mine/friends/public) work and update the rendered pin set.

**Suggested agent prompt:**
> Implement globe/map pin rendering per `/docs/ARCHITECTURE.md`'s map provider architecture: Mapbox GL JS globe view on `apps/web`, `@rnmapbox/maps` on `apps/mobile`, both driven by a shared GeoJSON transform in `packages/domain`/`packages/ui`. Include mine/friends/public filter pills and pin-tap preview navigation.

---

## Session 09: Privacy, Friends, and Follows

**Goal:** Full friend request and follow flows, plus trip collaborator management.

**Context to read first:** `PRD.md` (J3), `DATABASE_SCHEMA.md` (friend/follow/collaborator model).

**Files likely touched:** `apps/web` friends/discovery screens, `apps/mobile` friends/discovery screens, `packages/api` friend/follow/collaborator functions.

**Tasks:**
- Friend request send/accept/decline/remove UI on both platforms.
- Follow/unfollow UI on both platforms.
- Trip collaborator invite/manage UI (owner-only) on at least web (mobile can follow if time allows).
- Confirm RLS + domain visibility checks behave correctly end-to-end with real friend/follow state.

**Acceptance criteria:**
- Two seeded test accounts can become friends, see each other's friends-only content, and a third account can follow a public profile and see only public content.

**Suggested agent prompt:**
> Implement friend request and follow flows on `apps/web` and `apps/mobile`, plus trip collaborator management, per `/docs/PRD.md` journey J3 and `/docs/DATABASE_SCHEMA.md`'s friend/follow/collaborator model. Verify visibility enforcement end-to-end with seeded test accounts.

---

## Session 10: Public Profiles and Trip Pages

**Goal:** Logged-out-accessible public profile and trip pages, plus shareable links.

**Context to read first:** `PRD.md` (J5), `ARCHITECTURE.md` (deployment/SSR assumptions).

**Files likely touched:** `apps/web/app/u/[username]/*`, `apps/web/app/t/[tripSlug]/*`, `apps/web/app/share/[token]/*`.

**Tasks:**
- Public profile page (SSR/ISR), showing public trips and basic profile info.
- Public trip page (SSR/ISR), showing albums/posts/photos/map respecting visibility (only public content, unless viewer is owner/friend/collaborator, in which case server-side auth check elevates what's shown).
- Shareable link generation UI (owner-only) and `/share/[token]` resolver redirecting to the appropriate trip view.
- Basic Open Graph meta tags using the trip/profile cover photo.

**Acceptance criteria:**
- A logged-out browser can open a public trip/profile URL and see correctly scoped content with reasonable SEO meta tags.
- A generated share link works for the intended visibility level (e.g. a friends-only trip's share link still requires the visitor to be an authenticated friend).

**Suggested agent prompt:**
> Implement public profile pages, public trip pages, and shareable trip links on `apps/web` per `/docs/PRD.md` journey J5, with SSR/ISR and Open Graph meta tags. Ensure visibility rules are enforced server-side for anonymous visitors.

---

## Session 11: Seed Data, QA, and Polish

**Goal:** Make the app demoable end-to-end with realistic seed data and fix integration gaps.

**Context to read first:** `DATABASE_SCHEMA.md` (seed data plan), `MVP_SCOPE.md` (acceptance criteria), `PRD.md` (MVP acceptance criteria).

**Files likely touched:** `packages/db/seed/*`, assorted bugfixes across `apps/web`/`apps/mobile`.

**Tasks:**
- Finalize and run the seed script (profiles, places, trips, albums, posts, photos, friendships, follows).
- Walk every MVP acceptance criterion from `PRD.md` end-to-end on both platforms and fix gaps.
- Visual QA pass against `DESIGN_DIRECTION.md`.
- Confirm internal event tracking fires for the listed event types.

**Acceptance criteria:**
- All MVP acceptance criteria in `PRD.md` pass manually on both web and mobile using seed data.
- No RLS gaps found when manually probing private/friends content as an unauthorized viewer.

**Suggested agent prompt:**
> Finalize seed data per `/docs/DATABASE_SCHEMA.md` and do an end-to-end QA pass against every MVP acceptance criterion in `/docs/PRD.md` on both `apps/web` and `apps/mobile`, fixing any integration gaps found. Include a manual RLS probe to confirm private/friends content isn't exposed to unauthorized viewers.
