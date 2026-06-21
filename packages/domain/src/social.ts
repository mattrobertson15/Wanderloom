import type { FriendStatus } from "@wanderloom/config";

export interface FriendshipLike {
  requester_id: string;
  addressee_id: string;
  status: FriendStatus;
}

/** Resolves a friendship row into the other participant's id, if any. */
export function otherParticipant(friendship: FriendshipLike, viewerId: string): string | null {
  if (friendship.requester_id === viewerId) return friendship.addressee_id;
  if (friendship.addressee_id === viewerId) return friendship.requester_id;
  return null;
}

export function isPendingIncoming(friendship: FriendshipLike, viewerId: string): boolean {
  return friendship.status === "pending" && friendship.addressee_id === viewerId;
}

export function isPendingOutgoing(friendship: FriendshipLike, viewerId: string): boolean {
  return friendship.status === "pending" && friendship.requester_id === viewerId;
}

export function areAccepted(friendship: FriendshipLike): boolean {
  return friendship.status === "accepted";
}

export interface FollowLike {
  follower_id: string;
  followee_id: string;
}

export function isFollowing(follows: readonly FollowLike[], followerId: string, followeeId: string): boolean {
  return follows.some((f) => f.follower_id === followerId && f.followee_id === followeeId);
}
