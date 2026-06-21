import type { WanderloomClient } from "@wanderloom/db";
import type { CreatePlaceInput } from "@wanderloom/validation";

export async function searchPlacesByName(client: WanderloomClient, query: string, limit = 10) {
  const { data, error } = await client.from("places").select("*").ilike("name", `%${query}%`).limit(limit);
  if (error) throw error;
  return data;
}

export async function getPlace(client: WanderloomClient, placeId: string) {
  const { data, error } = await client.from("places").select("*").eq("id", placeId).single();
  if (error) throw error;
  return data;
}

export async function createPlace(client: WanderloomClient, createdBy: string, input: CreatePlaceInput) {
  const { data, error } = await client
    .from("places")
    .insert({
      name: input.name,
      category: input.category,
      address: input.address,
      country_code: input.country_code,
      created_by: createdBy,
      location: `SRID=4326;POINT(${input.location.lng} ${input.location.lat})`,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/** Pins visible to the current RLS-scoped session, for globe rendering. */
export async function listVisiblePins(client: WanderloomClient) {
  const { data, error } = await client.from("pins").select("*, places(name, location)");
  if (error) throw error;
  return data;
}
