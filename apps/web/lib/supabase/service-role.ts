import { createServiceRoleClient } from "@wanderloom/db";
import { parseWebServerEnv } from "@wanderloom/config";

/**
 * Server-only client using the service role key. Required to resolve
 * `share_links` rows, which RLS otherwise restricts to their creator —
 * see the "creators manage their share links" policy. Never import this
 * from a client component.
 */
export function getServiceRoleSupabaseClient() {
  const env = parseWebServerEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  return createServiceRoleClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
