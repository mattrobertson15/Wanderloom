import { notFound, redirect } from "next/navigation";
import { recordEvent, resolveShareLink } from "@wanderloom/api";
import { getServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

// Resolves a shareable trip link to its public trip page. `share_links` is
// only selectable by its creator under RLS, so resolution runs through the
// service role here — see the "creators manage their share links" policy.
export default async function ShareLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = getServiceRoleSupabaseClient();

  let shareLink;
  try {
    shareLink = await resolveShareLink(supabase, token);
  } catch {
    notFound();
  }

  const trip = shareLink.trips as { slug: string } | null;
  if (!trip) notFound();

  if (shareLink.expires_at && new Date(shareLink.expires_at) < new Date()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-10 text-center">
        <h1 className="font-display text-2xl text-text-primary">This link has expired</h1>
        <p className="mt-2 text-sm text-text-secondary">Ask the trip owner to share a new link.</p>
      </div>
    );
  }

  await recordEvent(supabase, null, "share_link_visited", { token, trip_id: shareLink.trip_id });

  redirect(`/t/${trip.slug}`);
}
