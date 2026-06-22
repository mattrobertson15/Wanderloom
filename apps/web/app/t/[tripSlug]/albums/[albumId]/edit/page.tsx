import { notFound, redirect } from "next/navigation";
import { getAlbum, getTripBySlug } from "@wanderloom/api";
import { EditAlbumForm } from "@/components/edit-album-form";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ tripSlug: string; albumId: string }>;
}) {
  const { tripSlug, albumId } = await params;
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

  let album;
  try {
    album = await getAlbum(supabase, albumId);
  } catch {
    notFound();
  }
  if (album.trip_id !== trip.id) notFound();

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="font-display text-2xl text-text-primary">Edit album</h1>
      <EditAlbumForm
        albumId={album.id}
        tripSlug={trip.slug}
        initialTitle={album.title}
        initialDescription={album.description ?? ""}
      />
    </div>
  );
}
