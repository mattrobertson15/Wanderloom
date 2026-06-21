# MVP Scope

## In Scope

- Email/password auth (Supabase Auth), with Google/Apple buttons visible but disabled.
- Trip CRUD with title, description, dates, cover photo, visibility.
- Album/Collection CRUD nested under a Trip.
- Post CRUD with title, text, date, photos, and an attached Place — at trip level or album level.
- Global Place search/create with name + coordinates + category.
- Photo upload (web + mobile) to Supabase Storage, attached to posts.
- Globe/map view rendering Pins from visible Trips/Posts/Places.
- Visibility model: private, friends-only, public, enforced via RLS and mirrored in domain logic.
- Friend relationships (request/accept/decline/remove).
- Follow relationships (follow/unfollow, no approval).
- Trip collaborators (viewer/editor roles).
- Public profile pages (`/u/[username]`).
- Public trip pages (`/t/[tripSlug]`).
- Shareable trip links (`/share/[token]`).
- Browse friends'/public map layers (filter globe by friends vs. public vs. mine).
- Basic internal event tracking (uploads, storage usage, page views, share events, follow/friend events) — not user-facing.
- Light/optional AI helpers: caption suggestions, tag suggestions, trip summary, public guide generation (none block core flows).
- Seed data for visual QA from day one.

## Out of Scope (MVP)

- Video upload/playback.
- EXIF metadata extraction from photos.
- Offline mode / local-first sync.
- Advanced AI (auto place extraction from photos, photo clustering, auto itinerary, cross-friend recommendations, chat-with-memories).
- Ads / ad serving / monetization UI.
- Storage limits or quota UI.
- In-app messaging/DMs.
- Trip booking, pricing, payments, itinerary execution.
- Comments/likes on posts (explicitly deferred social engagement primitives — see Roadmap).
- Real OAuth wiring for Google/Apple (buttons are stubbed only).
- Server-side map clustering (`ST_ClusterDBSCAN`) — MVP clusters client-side.

## Web MVP

- Landing page.
- Auth screens (sign in, sign up).
- User profile (own + public view).
- Create/edit Trip.
- Create/edit Album inside a Trip.
- Add Post with title, text, photos, date, place.
- Map/globe view with pins, filterable by mine/friends/public.
- Trip/Post visibility controls.
- Public profile page.
- Public trip page.
- Friend/follow relationship basics (request, accept, follow, unfollow; friends/following lists).
- Shareable trip links.

## Mobile MVP

- Login/signup.
- View map/globe.
- View trips.
- Create post.
- Upload photo.
- Attach/search place.
- Attach post to trip (and optionally album).
- Set visibility.
- Browse friends'/public trips.

## Backend MVP

- Supabase Auth (email/password).
- Postgres schema per [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).
- PostGIS enabled, used for `places.location`/`photos.location`.
- Storage buckets: `avatars`, `trip-covers`, `post-photos`.
- RLS enabled and tested for trips/albums/posts/photos/places/pins.
- Friend/follower tables and policies.
- Trip collaborator table and policies.
- Trip/post/place visibility rules enforced server-side.
- Basic event/analytics table, insert-only from clients.
- Seed data script.

## Design MVP

- Warm editorial visual language applied consistently to landing, trip cards, post cards, and profile pages.
- Globe-first hero treatment on the main authenticated landing surface (web) and a primary tab (mobile).
- A working (not necessarily pixel-final) design system: color tokens, type scale, spacing, card components for Trip/Post/Place.

## AI MVP

- Caption suggestion for a post (optional button, not required to publish).
- Tag suggestions for a post.
- Trip summary generation (short blurb from a trip's posts).
- Public guide generation from a trip (turns a trip into a shareable "guide" formatted page) — MVP can ship this as a simple template-driven summary if a full LLM integration isn't ready; see AI_FEATURES.md.

## Deferred / Roadmap Items

- Video support.
- EXIF extraction and auto place-tagging.
- Photo clustering by location/date.
- Auto-generated trip timeline.
- Itinerary generation from saved places.
- Cross-friend recommendation engine.
- Chat with travel memories.
- Ads and ad impression serving.
- Storage quota enforcement/UI.
- Comments/likes/reactions.
- Offline-first mobile sync.
- Server-side geo clustering at scale.
