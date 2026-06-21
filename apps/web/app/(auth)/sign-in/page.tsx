"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { OAuthButtons } from "@/components/oauth-buttons";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/globe");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-base px-6">
      <div className="w-full max-w-sm rounded-lg bg-background-elevated p-8 shadow-sm">
        <h1 className="font-display text-2xl text-text-primary">Welcome back</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-text-secondary/30 px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-text-secondary/30 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-pill bg-accent-primary px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <OAuthButtons />
        <p className="mt-6 text-center text-sm text-text-secondary">
          New to Wanderloom?{" "}
          <Link href="/sign-up" className="text-accent-primary">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
