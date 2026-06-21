import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WanderloomClientProvider } from "@wanderloom/api";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getMobileSupabaseClient } from "@/lib/supabase/client";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/sign-in");
    } else if (session && inAuthGroup) {
      router.replace("/globe");
    }
  }, [session, loading, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [supabase] = useState(() => getMobileSupabaseClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WanderloomClientProvider client={supabase}>
        <AuthProvider>
          <RouteGuard>
            <Slot />
          </RouteGuard>
        </AuthProvider>
      </WanderloomClientProvider>
    </QueryClientProvider>
  );
}
