"use client";

import { VISIBILITY_LEVELS, type Visibility } from "@wanderloom/config";
import { VISIBILITY_EMOJI, visibilityDescription, visibilityLabel } from "@wanderloom/ui";

export function VisibilitySelector({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (visibility: Visibility) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2 text-sm text-text-secondary">
      <legend className="mb-1">Visibility</legend>
      {VISIBILITY_LEVELS.map((level) => (
        <label
          key={level}
          className={`flex items-start gap-3 rounded-md border px-3 py-2 cursor-pointer ${
            value === level ? "border-accent-primary bg-accent-primary/10" : "border-text-secondary/30"
          }`}
        >
          <input
            type="radio"
            name="visibility"
            value={level}
            checked={value === level}
            onChange={() => onChange(level)}
            className="mt-1"
          />
          <span className="flex flex-col">
            <span className="font-medium text-text-primary">
              <span aria-hidden>{VISIBILITY_EMOJI[level]}</span> {visibilityLabel(level)}
            </span>
            <span className="text-xs text-text-secondary">{visibilityDescription(level)}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
