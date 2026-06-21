import { createContext, useContext, type ReactNode } from "react";
import type { WanderloomClient } from "@wanderloom/db";

const SupabaseClientContext = createContext<WanderloomClient | null>(null);

export function WanderloomClientProvider({
  client,
  children,
}: {
  client: WanderloomClient;
  children: ReactNode;
}) {
  return <SupabaseClientContext.Provider value={client}>{children}</SupabaseClientContext.Provider>;
}

/**
 * Each app (web, mobile) constructs its own Supabase client (different
 * session-persistence strategies) and provides it via WanderloomClientProvider
 * near the app root. Shared hooks pull it from context so query/mutation
 * functions stay platform-agnostic.
 */
export function useWanderloomClient(): WanderloomClient {
  const client = useContext(SupabaseClientContext);
  if (!client) {
    throw new Error("useWanderloomClient must be used within a WanderloomClientProvider");
  }
  return client;
}
