import { VISIBILITY_EMOJI, visibilityLabel } from "@wanderloom/ui";
import type { Visibility } from "@wanderloom/config";

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-pill bg-background-elevated px-2 py-0.5 text-xs text-text-secondary">
      <span aria-hidden>{VISIBILITY_EMOJI[visibility]}</span>
      {visibilityLabel(visibility)}
    </span>
  );
}
