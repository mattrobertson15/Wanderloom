import type { WanderloomClient } from "@wanderloom/db";
import type { CreatePhotoInput, CreatePostInput, UpdatePostInput } from "@wanderloom/validation";

export async function listPostsForTrip(client: WanderloomClient, tripId: string) {
  const { data, error } = await client
    .from("posts")
    .select("*, photos(*)")
    .eq("trip_id", tripId)
    .order("post_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listPostsForAlbum(client: WanderloomClient, albumId: string) {
  const { data, error } = await client
    .from("posts")
    .select("*, photos(*)")
    .eq("album_id", albumId)
    .order("post_date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function listPostsForPlace(client: WanderloomClient, placeId: string) {
  const { data, error } = await client
    .from("posts")
    .select("*, photos(*), trips(*)")
    .eq("place_id", placeId)
    .order("post_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPost(client: WanderloomClient, postId: string) {
  const { data, error } = await client.from("posts").select("*, photos(*)").eq("id", postId).single();
  if (error) throw error;
  return data;
}

export async function createPost(client: WanderloomClient, authorId: string, input: CreatePostInput) {
  const { data, error } = await client
    .from("posts")
    .insert({ ...input, author_id: authorId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updatePost(client: WanderloomClient, postId: string, input: UpdatePostInput) {
  const { data, error } = await client.from("posts").update(input).eq("id", postId).select("*").single();
  if (error) throw error;
  return data;
}

export async function deletePost(client: WanderloomClient, postId: string) {
  const { error } = await client.from("posts").delete().eq("id", postId);
  if (error) throw error;
}

export async function attachPhotoToPost(client: WanderloomClient, uploaderId: string, input: CreatePhotoInput) {
  const { data, error } = await client
    .from("photos")
    .insert({ ...input, uploader_id: uploaderId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deletePhoto(client: WanderloomClient, photoId: string) {
  const { error } = await client.from("photos").delete().eq("id", photoId);
  if (error) throw error;
}
