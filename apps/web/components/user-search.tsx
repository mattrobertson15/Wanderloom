"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { searchProfilesByUsername, useWanderloomClient } from "@wanderloom/api";
import { Avatar } from "@/components/avatar";
import { FollowButton } from "@/components/follow-button";
import { FriendshipButton } from "@/components/friendship-button";

interface ProfileResult {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

export function UserSearch({ viewerId }: { viewerId: string }) {
  const client = useWanderloomClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const profiles = await searchProfilesByUsername(client, trimmed);
      setResults(profiles.filter((profile) => profile.id !== viewerId));
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username"
          className="flex-1 rounded-md border border-text-secondary/30 px-3 py-2 text-text-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-pill bg-accent-primary px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          Search
        </button>
      </form>
      {searched && results.length === 0 && (
        <p className="mt-3 text-sm text-text-secondary">No users found.</p>
      )}
      {results.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {results.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-background-elevated p-3"
            >
              <Link href={`/u/${profile.username}`} className="flex items-center gap-3">
                <Avatar url={profile.avatar_url} label={profile.display_name ?? profile.username} />
                <div>
                  <p className="text-sm text-text-primary">{profile.display_name ?? profile.username}</p>
                  <p className="text-xs text-text-secondary">@{profile.username}</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <FollowButton profileId={profile.id} initialFollowing={false} />
                <FriendshipButton profileId={profile.id} initialState={{ status: "none" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
