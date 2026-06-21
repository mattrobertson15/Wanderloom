"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WanderloomClientProvider } from "@wanderloom/api";
import { useState, type ReactNode } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [supabase] = useState(() => getBrowserSupabaseClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WanderloomClientProvider client={supabase}>{children}</WanderloomClientProvider>
    </QueryClientProvider>
  );
}
