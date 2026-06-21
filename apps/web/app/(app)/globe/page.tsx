import { GlobeMap } from "@/components/globe-map";
import { MOCK_PIN_FEATURE_COLLECTION } from "@/lib/mock/pins";

const FILTER_PILLS = ["mine", "friends", "public"] as const;

export default function GlobePage() {
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
      <GlobeMap pins={MOCK_PIN_FEATURE_COLLECTION} />
      <p className="mt-3 text-xs text-text-secondary">
        Pins rendered from seed data via packages/domain map transforms. Live filtering/auth-scoped pins ship in
        Session 08.
      </p>
    </div>
  );
}
