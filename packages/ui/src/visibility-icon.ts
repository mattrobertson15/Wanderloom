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
