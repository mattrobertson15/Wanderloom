# Design Direction

## Visual Principles

- **Warm, editorial, premium** — closer to a travel magazine or curated atlas than a SaaS dashboard or map utility.
- **Photo-forward** — photos are the hero content everywhere; UI chrome stays quiet and gets out of the way.
- **Globe as emotional anchor** — the globe/map is the most prominent surface in the authenticated experience, not a secondary tab buried in navigation.
- **Structured but personal** — Trip → Album → Post hierarchy should feel like flipping through a curated scrapbook, not browsing a database.

## Brand Feel

Think: a well-bound travel journal crossed with an interactive atlas. Tactile, warm, a little nostalgic, but rendered with clean modern UI craft (soft shadows, generous spacing, confident typography) rather than skeuomorphic textures.

## Layout Principles

- Generous whitespace and breathing room around photo content; avoid dense dashboard layouts.
- Card-based composition for Trips, Albums, and Posts — consistent corner radius, soft elevation, photo-led.
- Hierarchy is always legible: a viewer should always know "I am inside Trip X → Album Y" via persistent, lightweight breadcrumbs/headers, not heavy nested navigation chrome.
- Mobile-first information density: never cram more than the platform comfortably supports; let web take advantage of extra width with grid layouts, not just wider single columns.

## Map/Globe UI Direction

- Globe projection by default where supported; calm, low-saturation base map style so user-generated pins/photos remain the visual focus.
- Pins are the primary interactive element — tapping/clicking a pin should feel immediate and reveal a lightweight preview (photo + place name + trip context) before committing to a full navigation.
- Clustering at low zoom should feel like "constellations" of travel rather than generic map markers — consider warm-toned cluster badges rather than default Mapbox styling.
- Filter controls (mine / friends / public) should be lightweight, pill-style toggles overlaying the map, not a separate settings page.

## Trip Card Direction

- Full-bleed cover photo, title overlaid with a subtle gradient for legibility.
- Secondary metadata (date range, place count, visibility indicator) in a quiet caption row below or overlaid minimally.
- Visibility shown via a small, unobtrusive icon/badge (lock, friends, globe) — never a loud badge.

## Post Card Direction

- Photo(s) lead; text excerpt follows in an editorial caption style (serif or warm humanist sans for body text where appropriate).
- Place name shown as a tappable chip/link, visually distinct from free-text content, reinforcing that Places are structured data, not just text.
- Date displayed in a way that reads like a journal entry, not a system timestamp (e.g. "March 14" not "2026-03-14T00:00:00Z").

## Color / Typography Placeholders

These are placeholders for `packages/config` design tokens — final values to be refined visually, not locked here.

```txt
Color roles:
  background.base        warm off-white / soft sand
  background.elevated     white / very light warm gray
  text.primary             near-black warm gray
  text.secondary           muted warm gray
  accent.primary           warm terracotta / sunset orange
  accent.secondary         deep ocean teal
  visibility.private        muted slate
  visibility.friends        warm amber
  visibility.public         ocean teal
  map.base                  desaturated warm neutral
  map.pin                   accent.primary

Typography roles:
  display    editorial serif or high-contrast humanist sans (trip titles, hero headings)
  body       warm humanist sans, optimized for readability (post text, UI copy)
  caption    same family as body, smaller/muted (metadata, timestamps)
```

## Mobile Design Guidance

- Tab bar: Globe, Trips, Create (+), Discover, Profile — Globe is the default/home tab.
- Native platform conventions for navigation transitions and gestures; don't fight iOS/Android norms in service of "consistency" with web.
- Photo capture/upload flow should be as close to native camera-roll picker UX as possible — minimize custom cropping/editing chrome at MVP.

## Web Design Guidance

- Landing page leads with a globe hero (even if simplified/static for marketing context) and a clear "see how it works" / "sign up" path.
- Authenticated home is the globe/map view, not a feed.
- Public trip/profile pages should be fast, shareable-looking (good Open Graph image generation from cover photos), and readable without an account.
- Use responsive grid layouts for trip/album/post browsing on wider viewports rather than simply stretching mobile layouts.
