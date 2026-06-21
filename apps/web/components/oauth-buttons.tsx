// TODO(auth-oauth): wire up real Google/Apple OAuth once client IDs exist.
// Buttons are intentionally disabled per docs/DECISION_LOG.md.
export function OAuthButtons() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-pill border border-text-secondary/30 px-4 py-2 text-sm text-text-secondary/60"
      >
        Continue with Google
      </button>
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-pill border border-text-secondary/30 px-4 py-2 text-sm text-text-secondary/60"
      >
        Continue with Apple
      </button>
    </div>
  );
}
