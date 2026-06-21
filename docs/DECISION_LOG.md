# Decision Log

All major decisions are recorded here as they're made. Entries are append-only; superseding a decision adds a new entry rather than editing history, unless the original entry was never implemented.

---

# Decision: Product name is Wanderloom
Status: Accepted
Context: Needed a name that evokes weaving travel memories together (trips/threads of experience).
Decision: Use "Wanderloom" as the product name throughout code, docs, and UI.
Consequences: Naming used in package scopes, repo, and branding placeholders.

---

# Decision: Globe/map-first primary experience
Status: Accepted
Context: Differentiate from feed-first social apps and utilitarian map tools.
Decision: The globe/map is the primary authenticated home surface on both web and mobile, not a secondary tab.
Consequences: Requires investment in Mapbox globe projection early; navigation and IA built around the map, not a feed.

---

# Decision: Trip is the primary user-facing object
Status: Accepted
Context: Users think in trips, not isolated posts or places.
Decision: Trip is the top-level content container; Albums, Posts, Places, Pins are secondary/supporting objects.
Consequences: All CRUD UI and navigation is anchored to "which trip am I in," even for trip-level (non-album) posts.

---

# Decision: Places are global and reusable, not user-owned
Status: Accepted
Context: Many users visit the same landmarks; recommendation/discovery value comes from shared place data.
Decision: `places` is a single global table; any authenticated user can attach posts/trips to an existing place or create a new one.
Consequences: Need lightweight dedup/search at authoring time; place merge/cleanup tooling deferred to roadmap; no per-user place ownership semantics.

---

# Decision: Social model is friends + follows from the start
Status: Accepted
Context: Need both symmetric private sharing (friends) and asymmetric public discovery (follows) from MVP.
Decision: Implement both `friendships` (symmetric, approval-required) and `follows` (asymmetric, no approval) at MVP, not deferred.
Consequences: Two relationship tables and two distinct UI flows required before MVP ships; visibility model only gates on friendship, not follow, to keep access rules simple.

---

# Decision: Three-tier visibility model (private/friends/public)
Status: Accepted
Context: Need granular control without overengineering a permissions matrix.
Decision: `visibility` enum (`private | friends | public`) applied at both Trip and Post level; effective visibility is the more restrictive of the two.
Consequences: RLS policies and domain logic both implement this resolution rule; must be kept in sync via shared tests.

---

# Decision: Monorepo with pnpm + Turborepo
Status: Accepted
Context: Need to share logic between web and mobile without duplicating types/validation/API code.
Decision: Single monorepo, `apps/{web,mobile}` + `packages/{api,config,db,domain,ui,validation}`.
Consequences: Slightly higher initial setup cost; pays off via shared types/validation/domain logic and consistent tooling.

---

# Decision: Next.js (web) + Expo React Native (mobile), both TypeScript
Status: Accepted
Context: Mature, well-supported stacks with strong Supabase/Mapbox ecosystem support.
Decision: Web on Next.js App Router; mobile on Expo with Expo Router; TypeScript everywhere.
Consequences: Standard hosting on Vercel (web) and EAS (mobile); no custom native build pipeline needed at MVP.

---

# Decision: Supabase (Postgres + PostGIS + Auth + Storage) as backend
Status: Accepted
Context: Need auth, relational data, geospatial queries, and file storage with minimal custom backend code.
Decision: Single Supabase project per environment; PostGIS enabled for geo data; RLS as the authorization source of truth.
Consequences: Tightly coupled to Supabase's RLS model for security; service-role key usage must be carefully restricted to trusted server contexts.

---

# Decision: Mapbox as the map provider (GL JS on web, `@rnmapbox/maps` on mobile)
Status: Accepted
Context: Need globe projection support and mature SDKs on both platforms.
Decision: Mapbox renders map/globe/pins/clusters only; Wanderloom's own data model is never expressed in terms of Mapbox concepts.
Consequences: Mobile globe projection may need a Mercator fallback depending on platform/OS support; abstraction layer (`packages/domain`/`packages/ui` GeoJSON transforms) required to keep Mapbox swappable in principle.

---

# Decision: Email/password auth at MVP; Google/Apple buttons shown but disabled
Status: Accepted
Context: Avoid OAuth provider setup overhead before core product is validated, while preserving the intended final UI.
Decision: Supabase email/password auth only is wired; Google/Apple sign-in buttons render in disabled state with `TODO(auth-oauth)` markers.
Consequences: No real OAuth credentials/config needed yet; UI work for OAuth buttons isn't wasted when wiring is added later.

---

# Decision: Photos only at MVP; video, EXIF extraction deferred
Status: Accepted
Context: Keep media pipeline scope small; video adds significant transcoding/storage/playback complexity, EXIF extraction adds parsing complexity not required to validate the core loop.
Decision: MVP supports photo upload only; `photos.taken_at`/`location` are user-supplied, not auto-extracted.
Consequences: Simpler storage/upload pipeline; roadmap work required later to add video and EXIF-based auto-tagging without breaking the existing photo data shape.

---

# Decision: AI features are optional and non-blocking at MVP
Status: Accepted
Context: Avoid coupling core content-creation flows to AI provider availability/cost/latency.
Decision: Caption/tag suggestions, trip summaries, and public guide generation are all user-initiated, optional, and never required to complete a save/publish action.
Consequences: AI integration can be added/iterated independently of core CRUD flows; guide generation may ship as a deterministic template before a full LLM integration exists.

---

# Decision: Monetization direction is ads, not storage limits
Status: Accepted
Context: Storage limits create friction in a photo-centric product and contradict the "premium scrapbook" feel; ads better fit a discovery/browsing-heavy usage pattern.
Decision: No storage limits or quota UI at MVP; internal usage tracking (`events` table) captures media uploads, storage usage, AI usage, ad impressions, public page views, share events, and follow/friend events for future monetization decisions.
Consequences: Need disciplined internal event tracking from day one even though no user-facing monetization UI exists yet; ad infrastructure is a later roadmap phase, not MVP.

---

# Decision: Do not over-share UI between web and mobile
Status: Accepted
Context: Literal component sharing between React DOM and React Native tends to produce compromised UX on both platforms.
Decision: Share types, validation, domain logic, API clients, permission helpers, and design tokens via packages; build platform-specific UI components in each app.
Consequences: Some duplication of UI code across web/mobile is accepted as a deliberate tradeoff for better platform-native UX.
