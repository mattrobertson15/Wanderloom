import type { WanderloomClient } from "@wanderloom/db";
import type { CreateAlbumInput, UpdateAlbumInput } from "@wanderloom/validation";

export async function listAlbumsForTrip(client: WanderloomClient, tripId: string) {
  const { data, error } = await client
    .from("albums")
    .select("*")
    .eq("trip_id", tripId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createAlbum(client: WanderloomClient, input: CreateAlbumInput) {
  const { data, error } = await client.from("albums").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateAlbum(client: WanderloomClient, albumId: string, input: UpdateAlbumInput) {
  const { data, error } = await client.from("albums").update(input).eq("id", albumId).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteAlbum(client: WanderloomClient, albumId: string) {
  const { error } = await client.from("albums").delete().eq("id", albumId);
  if (error) throw error;
}
