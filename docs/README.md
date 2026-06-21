# Wanderloom

## Project Overview

Wanderloom is a globe-first social travel scrapbook and discovery app. Users build personal travel **Trips** out of **Albums**, **Posts**, and **Photos**, attach them to reusable global **Places**, and see their memories rendered as **Pins** on an interactive globe/map. The personal scrapbook is the content engine for a broader social discovery loop: browsing friends' maps, following public travelers, sharing public trips, and discovering destinations through real trips instead of generic listicles.

## Product Vision

> Turn real travel memories into a living, social, globe-first map of the world.

Wanderloom is not a private photo journal and not a generic map utility. It's an editorial, premium scrapbook experience that doubles as a discovery platform, built on authentic personal trip data. See [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md) for full positioning.

## Tech Stack

| Layer | Choice |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Web | Next.js (App Router) + TypeScript |
| Mobile | Expo (React Native) + TypeScript |
| Backend | Supabase (Postgres + Auth + Storage + Realtime) |
| Database | Postgres + PostGIS |
| Storage | Supabase Storage (photos) |
| Maps (web) | Mapbox GL JS |
| Maps (mobile) | `@rnmapbox/maps` |
| Validation | Zod |
| Data fetching | TanStack Query |
| Auth (MVP) | Supabase email/password (Google/Apple buttons shown, disabled) |

## Monorepo Structure

```txt
wanderloom/
  apps/
    web/              # Next.js web app
    mobile/            # Expo React Native app
  packages/
    api/              # Supabase-backed API clients, queries, mutations
    config/            # Shared config: env schema, constants, design tokens
    db/                # Database types, SQL migrations, seed scripts
    domain/            # Domain models, permission helpers, business logic
    ui/                # Shared primitives that are genuinely cross-platform (tokens, icons, pure logic)
    validation/        # Zod schemas shared by web, mobile, and API layer
  docs/                # All product/engineering documentation (this folder)
```

Web and mobile UI are **not** shared component-for-component. Shared packages own types, validation, API clients, domain logic, permission helpers, and design tokens. Each app builds its own platform-appropriate UI on top of those shared primitives.

## Setup Instructions

### Prerequisites
- Node.js 20+
- pnpm 9+
- A Supabase project (local via `supabase` CLI or hosted)
- A Mapbox access token

### Install

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` in each app (`apps/web`, `apps/mobile`) and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only, never shipped to client

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=
EXPO_PUBLIC_MAPBOX_TOKEN=

# Mobile (Expo) mirrors of the above with EXPO_PUBLIC_ prefix
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

See `packages/config` for the runtime-validated env schema.

### Development Commands

```bash
pnpm dev              # run all apps in dev mode (turborepo)
pnpm --filter web dev       # run web only
pnpm --filter mobile dev    # run mobile only (Expo)
pnpm build            # build all packages/apps
pnpm lint             # lint all workspaces
pnpm typecheck        # typecheck all workspaces
pnpm test             # run tests
pnpm db:migrate       # apply Supabase migrations (packages/db)
pnpm db:seed          # seed sample data
```

## Current MVP Scope

See [MVP_SCOPE.md](./MVP_SCOPE.md) for the authoritative in/out-of-scope list. Short version: private/friends/public Trips with Albums, Posts, photos, and Places; globe/map pin rendering on web and mobile; friends + follows; public profile and trip pages; shareable links. No video, no EXIF extraction, no ads, light/optional AI only.

## Documentation Index

- [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md) — positioning, users, loops
- [PRD.md](./PRD.md) — requirements, personas, journeys, metrics
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) — schema, RLS, PostGIS
- [MVP_SCOPE.md](./MVP_SCOPE.md) — in/out of scope
- [ROADMAP.md](./ROADMAP.md) — phased plan
- [DESIGN_DIRECTION.md](./DESIGN_DIRECTION.md) — visual language
- [AI_FEATURES.md](./AI_FEATURES.md) — AI scope now and later
- [SESSION_PROMPTS.md](./SESSION_PROMPTS.md) — agent-ready build sessions
- [TODO.md](./TODO.md) — task backlog
- [DECISION_LOG.md](./DECISION_LOG.md) — locked decisions and rationale
