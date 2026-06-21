import type { Config } from "tailwindcss";
import { colors, radii } from "@wanderloom/config";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        text: colors.text,
        accent: colors.accent,
        visibility: colors.visibility,
        map: colors.map,
      },
      borderRadius: {
        sm: `${radii.sm}px`,
        md: `${radii.md}px`,
        lg: `${radii.lg}px`,
        pill: `${radii.pill}px`,
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
