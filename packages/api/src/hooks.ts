import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTripInput, CreatePostInput, UpdateTripInput } from "@wanderloom/validation";
import { useWanderloomClient } from "./client-context";
import { queryKeys } from "./query-keys";
import { createTrip, getTripBySlug, listTripsForOwner, updateTrip } from "./trips";
import { listPostsForTrip, createPost } from "./posts";
import { listVisiblePins } from "./places";

export function useTripBySlug(slug: string) {
  const client = useWanderloomClient();
  return useQuery({ queryKey: queryKeys.trip(slug), queryFn: () => getTripBySlug(client, slug) });
}

export function useTripsForOwner(ownerId: string) {
  const client = useWanderloomClient();
  return useQuery({ queryKey: queryKeys.tripsByOwner(ownerId), queryFn: () => listTripsForOwner(client, ownerId) });
}

export function useCreateTrip(ownerId: string) {
  const client = useWanderloomClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTripInput) => createTrip(client, ownerId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tripsByOwner(ownerId) }),
  });
}

export function useUpdateTrip(tripId: string) {
  const client = useWanderloomClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTripInput) => updateTrip(client, tripId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trip(tripId) }),
  });
}

export function usePostsForTrip(tripId: string) {
  const client = useWanderloomClient();
  return useQuery({ queryKey: queryKeys.postsForTrip(tripId), queryFn: () => listPostsForTrip(client, tripId) });
}

export function useCreatePost(authorId: string) {
  const client = useWanderloomClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(client, authorId, input),
    onSuccess: (post) => queryClient.invalidateQueries({ queryKey: queryKeys.postsForTrip(post.trip_id) }),
  });
}

export function useVisiblePins() {
  const client = useWanderloomClient();
  return useQuery({ queryKey: queryKeys.pins(), queryFn: () => listVisiblePins(client) });
}
