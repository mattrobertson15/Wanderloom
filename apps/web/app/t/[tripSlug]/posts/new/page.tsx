import { notFound, redirect } from "next/navigation";
import { getTripBySlug } from "@wanderloom/api";
import { NewPostForm } from "@/components/new-post-form";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export default async function NewPostPage({ params }: { params: Promise<{ tripSlug: string }> }) {
  const { tripSlug } = await params;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  let trip;
  try {
    trip = await getTripBySlug(supabase, tripSlug);
  } catch {
    notFound();
  }
  if (trip.owner_id !== user.id) notFound();

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="font-display text-2xl text-text-primary">New post in {trip.title}</h1>
      <NewPostForm tripId={trip.id} tripSlug={trip.slug} defaultVisibility={trip.visibility} />
    </div>
  );
}
