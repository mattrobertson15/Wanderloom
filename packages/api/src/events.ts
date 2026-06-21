import type { WanderloomClient } from "@wanderloom/db";
import type { EventType } from "@wanderloom/db";

/**
 * Internal usage tracking only — never surfaced to end users at MVP.
 * See docs/DATABASE_SCHEMA.md (events table) and docs/AI_FEATURES.md
 * (ai_usage cost tracking).
 */
export async function recordEvent(
  client: WanderloomClient,
  profileId: string | null,
  type: EventType,
  metadata: Record<string, unknown> = {},
) {
  const { error } = await client.from("events").insert({ profile_id: profileId, type, metadata });
  if (error) throw error;
}
