import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export type WanderloomClient = SupabaseClient<Database>;

/**
 * Server-only client using the service role key. Bypasses RLS — never
 * import this from client-bundled code (web client components or the
 * mobile app). Reserved for seed scripts, admin tooling, and trusted
 * server contexts (route handlers / server actions).
 */
export function createServiceRoleClient(url: string, serviceRoleKey: string): WanderloomClient {
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
