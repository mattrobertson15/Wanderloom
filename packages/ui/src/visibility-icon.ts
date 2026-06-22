import { colors, type Visibility } from "@wanderloom/config";

/**
 * Platform-agnostic mapping from visibility -> icon name + color. Each app
 * resolves the icon name through its own icon set (e.g. lucide-react on
 * web, @expo/vector-icons on mobile) — this just keeps the choice and
 * color consistent across platforms.
 */
export const VISIBILITY_ICON_NAME: Record<Visibility, "lock" | "users" | "globe"> = {
  private: "lock",
  friends: "users",
  public: "globe",
};

/** Emoji fallback used where apps don't pull in a full icon set. */
export const VISIBILITY_EMOJI: Record<Visibility, string> = {
  private: "🔒",
  friends: "👥",
  public: "🌐",
};

export function visibilityColor(visibility: Visibility): string {
  return colors.visibility[visibility];
}

export function visibilityLabel(visibility: Visibility): string {
  switch (visibility) {
    case "private":
      return "Private";
    case "friends":
      return "Friends only";
    case "public":
      return "Public";
  }
}

export function visibilityDescription(visibility: Visibility): string {
  switch (visibility) {
    case "private":
      return "Only you can see this.";
    case "friends":
      return "Visible to friends you've connected with.";
    case "public":
      return "Anyone can see this.";
  }
}
