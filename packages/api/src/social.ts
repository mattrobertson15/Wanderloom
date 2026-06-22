import type { WanderloomClient } from "@wanderloom/db";
import type { CreateShareLinkInput, RespondToFriendRequestInput, SendFriendRequestInput } from "@wanderloom/validation";

export async function listFriendships(client: WanderloomClient, profileId: string) {
  const { data, error } = await client
    .from("friendships")
    .select("*")
    .or(`requester_id.eq.${profileId},addressee_id.eq.${profileId}`);
  if (error) throw error;
  return data;
}

export async function sendFriendRequest(
  client: WanderloomClient,
  requesterId: string,
  input: SendFriendRequestInput,
) {
  const { data, error } = await client
    .from("friendships")
    .insert({ requester_id: requesterId, addressee_id: input.addressee_id, status: "pending" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function respondToFriendRequest(client: WanderloomClient, input: RespondToFriendRequestInput) {
  const { data, error } = await client
    .from("friendships")
    .update({ status: input.status })
    .eq("id", input.friendship_id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function removeFriendship(client: WanderloomClient, friendshipId: string) {
  const { error } = await client.from("friendships").delete().eq("id", friendshipId);
  if (error) throw error;
}

/** The friendship row between two profiles, regardless of who requested whom. */
export async function getFriendshipBetween(client: WanderloomClient, profileA: string, profileB: string) {
  const { data, error } = await client
    .from("friendships")
    .select("*")
    .or(
      `and(requester_id.eq.${profileA},addressee_id.eq.${profileB}),and(requester_id.eq.${profileB},addressee_id.eq.${profileA})`,
    )
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listFollows(client: WanderloomClient, profileId: string) {
  const { data, error } = await client
    .from("follows")
    .select("*")
    .or(`follower_id.eq.${profileId},followee_id.eq.${profileId}`);
  if (error) throw error;
  return data;
}

export async function followProfile(client: WanderloomClient, followerId: string, followeeId: string) {
  const { data, error } = await client
    .from("follows")
    .insert({ follower_id: followerId, followee_id: followeeId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function unfollowProfile(client: WanderloomClient, followerId: string, followeeId: string) {
  const { error } = await client
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId);
  if (error) throw error;
}

export async function getFollowBetween(client: WanderloomClient, followerId: string, followeeId: string) {
  const { data, error } = await client
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function randomToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createShareLink(client: WanderloomClient, createdBy: string, input: CreateShareLinkInput) {
  const { data, error } = await client
    .from("share_links")
    .insert({ trip_id: input.trip_id, created_by: createdBy, expires_at: input.expires_at, token: randomToken() })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function resolveShareLink(client: WanderloomClient, token: string) {
  const { data, error } = await client.from("share_links").select("*, trips(*)").eq("token", token).single();
  if (error) throw error;
  return data;
}
