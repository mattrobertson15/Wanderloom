import { redirect } from "next/navigation";

// Resolves a shareable trip link to its public trip page. Real lookup
// against `share_links` (and visibility-aware access checks for
// friends-only trips) lands in Session 10; this stubs the redirect shape.
export default async function ShareLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  // TODO(session-10): resolve token -> trip slug via packages/api resolveShareLink.
  void token;
  redirect("/t/america-2026");
}
