"use client";

import { useState, type FormEvent } from "react";
import { VISIBILITY_LEVELS } from "@wanderloom/config";

export default function NewTripPage() {
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<(typeof VISIBILITY_LEVELS)[number]>("private");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // TODO(session-06): wire to packages/api createTrip once auth session is live.
    console.log("create trip", { title, visibility });
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="font-display text-2xl text-text-primary">Start a new trip</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
            placeholder="America 2026"
          />
        </label>
        <fieldset className="flex flex-col gap-2 text-sm text-text-secondary">
          <legend className="mb-1">Visibility</legend>
          {VISIBILITY_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 capitalize">
              <input
                type="radio"
                name="visibility"
                value={level}
                checked={visibility === level}
                onChange={() => setVisibility(level)}
              />
              {level}
            </label>
          ))}
        </fieldset>
        <button type="submit" className="mt-2 rounded-pill bg-accent-primary px-4 py-2 text-sm text-white">
          Create trip
        </button>
      </form>
    </div>
  );
}
