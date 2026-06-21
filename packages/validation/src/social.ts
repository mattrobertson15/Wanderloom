import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  addressee_id: z.string().uuid(),
});
export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;

export const respondToFriendRequestSchema = z.object({
  friendship_id: z.string().uuid(),
  status: z.enum(["accepted", "blocked"]),
});
export type RespondToFriendRequestInput = z.infer<typeof respondToFriendRequestSchema>;

export const followSchema = z.object({
  followee_id: z.string().uuid(),
});
export type FollowInput = z.infer<typeof followSchema>;

export const createShareLinkSchema = z.object({
  trip_id: z.string().uuid(),
  expires_at: z.string().datetime().optional(),
});
export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;
