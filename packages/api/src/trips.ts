import type { WanderloomClient } from "@wanderloom/db";
import type { CreateTripInput, UpdateTripInput } from "@wanderloom/validation";

export async function getTripBySlug(client: WanderloomClient, slug: string) {
  const { data, error } = await client.from("trips").select("*").eq("slug", slug).single();
  if (error) throw error;
  return data;
}

export async function getTripById(client: WanderloomClient, id: string) {
  const { data, error } = await client.from("trips").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function listTripsForOwner(client: WanderloomClient, ownerId: string) {
  const { data, error } = await client
    .from("trips")
    .select("*, pins(place_id)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTrip(client: WanderloomClient, ownerId: string, input: CreateTripInput) {
  const { data, error } = await client
    .from("trips")
    .insert({ ...input, owner_id: ownerId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrip(client: WanderloomClient, tripId: string, input: UpdateTripInput) {
  const { data, error } = await client.from("trips").update(input).eq("id", tripId).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteTrip(client: WanderloomClient, tripId: string) {
  const { error } = await client.from("trips").delete().eq("id", tripId);
  if (error) throw error;
}
