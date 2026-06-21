import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { parseWebClientEnv } from "@wanderloom/config";
import type { WanderloomClient } from "@wanderloom/db";

/** Per-request Supabase client for use in server components/route handlers. */
export async function getServerSupabaseClient(): Promise<WanderloomClient> {
  const cookieStore = await cookies();
  const env = parseWebClientEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  });

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component without a mutable cookie store;
          // safe to ignore when middleware also refreshes the session.
        }
      },
    },
  }) as WanderloomClient;
}
