# PRD — Wanderloom

## Problem Statement

Travelers have no good home for trip memories that is simultaneously (a) beautiful and structured enough to want to maintain, and (b) socially and discoverably useful to others. Photo albums die in camera rolls. Travel content on generic social platforms is ephemeral and not structured by place or trip. Travel-planning tools are utilitarian and disconnected from authentic personal experience. Wanderloom unifies scrapbooking and discovery around a Trip → Album → Post → Place → Pin model rendered on a globe.

## Goals

- Give users a durable, structured, beautiful place to record trips.
- Make every piece of recorded content map-renderable and discoverable.
- Support a friends+follows social graph with granular visibility from day one.
- Make public trips and profiles first-class, shareable, and crawlable.
- Ship a clean, scalable MVP that is agent-friendly to keep extending.

## Non-Goals

- Booking/payments/itinerary execution.
- Video support (roadmap).
- Advanced AI (roadmap).
- Ads/monetization UI (roadmap; tracking only at MVP).
- Offline mode (roadmap).

## User Personas

1. **Maya, the Travel Creator** — posts publicly, wants a polished profile and trip pages to share on social media, cares about follower growth and presentation quality.
2. **Daniel, the Family Documentarian** — travels with family, wants friends-only sharing, doesn't care about public reach, wants an easy mobile capture flow.
3. **Priya, the Dreamer/Planner** — travels occasionally, spends more time browsing others' maps for inspiration than posting, wants to save places and follow creators.

## Core User Journeys

### J1 — Create and document a trip
User creates a Trip → adds an Album (e.g. a city) → adds a Post with text/photos/date inside the album → attaches a Place to the post → Pin appears on their globe.

### J2 — Set visibility and share
User sets a Trip (or individual Post) visibility to private/friends/public → optionally generates a shareable link → shares outside the app.

### J3 — Build social graph
User sends/accepts friend requests (approval required) and follows public profiles (no approval required) → friends-only and public content becomes visible accordingly.

### J4 — Discover via globe
User opens the globe/map → browses pins from friends and public travelers → taps a pin → views the Place's posts → taps through to the trip or profile → saves the place or follows the user.

### J5 — Public trip page
A logged-out or logged-in visitor opens a shared public trip link → sees a read-optimized trip page (cover, albums, posts, map) → can sign up to follow/friend.

## Functional Requirements

- FR1: Users can sign up/log in with email+password (Supabase Auth). Google/Apple buttons are visible but disabled.
- FR2: Users can create, edit, delete Trips with title, description, date range, cover photo, visibility.
- FR3: Users can create, edit, delete Albums/Collections within a Trip.
- FR4: Users can create, edit, delete Posts with title, text, date, photos, and an attached Place, within a Trip or Album.
- FR5: Users can search for or create a global Place (name, coordinates, category) when authoring a Post.
- FR6: The system renders Pins on a globe/map for Places that have visible (to the viewer) Posts/Trips attached.
- FR7: Visibility is enforced per Trip and per Post: private, friends-only, public.
- FR8: Users can send/accept/decline/remove friend relationships (mutual, approval required).
- FR9: Users can follow/unfollow public profiles (one-directional, no approval required).
- FR10: Users can designate Trip collaborators with edit or view permissions.
- FR11: Public profile pages and public trip pages are accessible without authentication.
- FR12: Users can generate a shareable link for a trip respecting its visibility.
- FR13: Mobile and web both support photo upload to Supabase Storage.
- FR14: Basic usage/analytics events are recorded (uploads, storage usage, page views, share events, follow/friend events).
- FR15: Optional AI helpers (caption/tag suggestions, trip summary, public guide generation) may be invoked but are never required to complete core flows.

## Non-Functional Requirements

- NFR1: TypeScript across all apps and packages.
- NFR2: Row-Level Security enforced at the database layer for all visibility rules — application code must not be the only enforcement point.
- NFR3: Shared validation (Zod) used identically on client and any server-side checks to avoid drift.
- NFR4: Map rendering must degrade gracefully (fallback projection) if globe mode is unsupported on a device.
- NFR5: Photo uploads must be resumable/retry-safe enough for mobile network conditions (basic retry, not full offline queue at MVP).
- NFR6: Public pages should be fast and SEO-reasonable (SSR/ISR on web for public profile/trip pages).
- NFR7: No storage limits surfaced to users at MVP, but usage must be tracked internally for future monetization.

## Success Metrics (MVP)

- Activation: % of signups who create at least one Trip with one Post within 7 days.
- Content depth: average Posts per Trip, average Photos per Post.
- Social graph formation: % of users with ≥1 friend or ≥1 follow within 14 days.
- Sharing: number of public trip link shares and resulting visits.
- Discovery: % of sessions that include browsing a non-owned trip/profile.
- Retention: week-2 and week-4 return rate.

## MVP Acceptance Criteria

- A new user can sign up, create a Trip, add an Album, add a Post with a photo and a Place, and see a Pin on the globe — end to end, on both web and mobile.
- A user can set a Trip to public and share a working link that a logged-out visitor can open and view correctly scoped content.
- A user can friend another user (with approval) and follow a public profile (without approval), and visibility rules are correctly enforced for each.
- RLS policies prevent a user from reading private content they aren't authorized to see, verified via direct database query, not just UI behavior.
- Seed data exists so the globe, trip pages, and profiles are visually populated without manual setup.
