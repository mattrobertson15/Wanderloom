"use client";

import Link from "next/link";
import { useState } from "react";
import type { PinFeatureProperties } from "@wanderloom/domain";
import { GlobeMap } from "@/components/globe-map";
import { MOCK_PIN_FEATURE_COLLECTION } from "@/lib/mock/pins";

const FILTER_PILLS = ["mine", "friends", "public"] as const;

export default function GlobePage() {
  const [selectedPin, setSelectedPin] = useState<PinFeatureProperties | null>(null);

  return (
    <div className="relative px-6 py-6 md:px-12">
      <div className="mb-4 flex gap-2">
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill}
            className="rounded-pill border border-text-secondary/20 px-4 py-1.5 text-sm capitalize text-text-secondary first:bg-accent-primary first:text-white first:border-transparent"
          >
            {pill}
          </button>
        ))}
      </div>
      <div className="relative">
        <GlobeMap pins={MOCK_PIN_FEATURE_COLLECTION} onPinSelect={setSelectedPin} />
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-lg bg-background-elevated p-4 shadow-md md:left-4 md:right-auto md:w-72">
            <div>
              <p className="font-medium text-text-primary">{selectedPin.placeName}</p>
              <Link href={`/t/${selectedPin.tripSlug}`} className="text-sm font-medium text-accent-primary">
                View trip →
              </Link>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              aria-label="Close"
              className="text-text-secondary hover:text-text-primary"
            >
              ×
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-text-secondary">
        Pins rendered from seed data via packages/domain map transforms. Live filtering/auth-scoped pins ship in
        Session 08.
      </p>
    </div>
  );
}
