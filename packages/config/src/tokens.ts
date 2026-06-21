/**
 * Shared design tokens. Placeholder values per docs/DESIGN_DIRECTION.md —
 * consumed by Tailwind config on web and a styling layer on mobile.
 * Visual values are intentionally provisional; the token *names* are the
 * stable contract both apps build against.
 */

export const colors = {
  background: {
    base: "#FAF6F0",
    elevated: "#FFFFFF",
  },
  text: {
    primary: "#2B2622",
    secondary: "#7A7268",
  },
  accent: {
    primary: "#D97A4D",
    secondary: "#2C6E6B",
  },
  visibility: {
    private: "#6B7280",
    friends: "#D9A23B",
    public: "#2C6E6B",
  },
  map: {
    base: "#E7E0D4",
    pin: "#D97A4D",
  },
} as const;

export const typography = {
  display: "var(--font-display)",
  body: "var(--font-body)",
  caption: "var(--font-body)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export type ColorTokens = typeof colors;
export type TypographyTokens = typeof typography;
