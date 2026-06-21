"use client";

import { createBrowserClient } from "@supabase/ssr";
import { parseWebClientEnv } from "@wanderloom/config";
import type { WanderloomClient } from "@wanderloom/db";

let browserClient: WanderloomClient | null = null;

/** Singleton browser Supabase client for use in client components/hooks. */
export function getBrowserSupabaseClient(): WanderloomClient {
  if (browserClient) return browserClient;

  const env = parseWebClientEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  });

  browserClient = createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as WanderloomClient;
  return browserClient;
}
