import { z } from "zod";

/**
 * Env schemas are split by runtime because web (Next.js) and mobile (Expo)
 * use different public-prefix conventions (`NEXT_PUBLIC_` vs `EXPO_PUBLIC_`)
 * for the same underlying values.
 */

export const webClientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1),
});

export const webServerEnvSchema = webClientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  AI_PROVIDER_API_KEY: z.string().min(1).optional(),
});

export const mobileEnvSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  EXPO_PUBLIC_MAPBOX_TOKEN: z.string().min(1),
});

export type WebClientEnv = z.infer<typeof webClientEnvSchema>;
export type WebServerEnv = z.infer<typeof webServerEnvSchema>;
export type MobileEnv = z.infer<typeof mobileEnvSchema>;

export function parseWebClientEnv(source: Record<string, string | undefined>): WebClientEnv {
  return webClientEnvSchema.parse(source);
}

export function parseWebServerEnv(source: Record<string, string | undefined>): WebServerEnv {
  return webServerEnvSchema.parse(source);
}

export function parseMobileEnv(source: Record<string, string | undefined>): MobileEnv {
  return mobileEnvSchema.parse(source);
}
