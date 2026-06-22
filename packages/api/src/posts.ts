import type { WanderloomClient } from "@wanderloom/db";
import type { CreatePhotoInput, CreatePostInput, UpdatePostInput } from "@wanderloom/validation";

export async function listPostsForTrip(client: WanderloomClient, tripId: string) {
  const { data, error } = await client
    .from("posts")
    .select("*, photos(*), places(name)")
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

/**
 * Uploads a photo file into the (uploader-scoped) `post-photos` bucket and
 * returns its storage path. Callers still need to insert a `photos` row via
 * `attachPhotoToPost` to make it queryable.
 *
 * `file` accepts a `Blob`/`File` (web) or `ArrayBuffer` (React Native, where
 * `File`/`Blob` uploads are unreliable over the JS bridge) — `fileName` is
 * taken as a separate argument since `ArrayBuffer` has no `.name`.
 */
export async function uploadPostPhoto(
  client: WanderloomClient,
  uploaderId: string,
  postId: string,
  file: Blob | ArrayBuffer,
  fileName: string,
  contentType?: string,
) {
  const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const path = `${uploaderId}/${postId}/${uploadId}-${fileName}`;
  const { error } = await client.storage.from("post-photos").upload(path, file, contentType ? { contentType } : undefined);
  if (error) throw error;
  return path;
}

/**
 * `post-photos` has no select policy on `storage.objects`, so minting a
 * signed URL requires the service-role client — call this only from a
 * trusted server context, after fetching the owning `photos` row through a
 * session/anon client whose RLS pass already proved the viewer can see it.
 */
export async function createSignedPhotoUrl(client: WanderloomClient, storagePath: string, expiresInSeconds = 3600) {
  const { data, error } = await client.storage.from("post-photos").createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
