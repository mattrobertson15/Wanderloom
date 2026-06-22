import type { WanderloomClient } from "@wanderloom/db";

export async function getProfile(client: WanderloomClient, profileId: string) {
  const { data, error } = await client.from("profiles").select("*").eq("id", profileId).single();
  if (error) throw error;
  return data;
}

export async function getProfileByUsername(client: WanderloomClient, username: string) {
  const { data, error } = await client.from("profiles").select("*").eq("username", username).single();
  if (error) throw error;
  return data;
}

export async function getProfilesByIds(client: WanderloomClient, profileIds: string[]) {
  if (profileIds.length === 0) return [];
  const { data, error } = await client.from("profiles").select("*").in("id", profileIds);
  if (error) throw error;
  return data;
}

export async function searchProfilesByUsername(client: WanderloomClient, query: string, limit = 10) {
  const { data, error } = await client.from("profiles").select("*").ilike("username", `%${query}%`).limit(limit);
  if (error) throw error;
  return data;
}
