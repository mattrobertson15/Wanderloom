-- Social graph: friendships (symmetric, approval-gated), follows
-- (asymmetric, no approval), and trip collaborators.

create table friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles (id) on delete cascade,
  addressee_id uuid not null references profiles (id) on delete cascade,
  status friend_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friendships_no_self_friend check (requester_id <> addressee_id),
  constraint friendships_unique_pair unique (
    least(requester_id, addressee_id),
    greatest(requester_id, addressee_id)
  )
);

create index friendships_requester_id_idx on friendships (requester_id);
create index friendships_addressee_id_idx on friendships (addressee_id);

create table follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references profiles (id) on delete cascade,
  followee_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint follows_no_self_follow check (follower_id <> followee_id),
  constraint follows_unique_pair unique (follower_id, followee_id)
);

create index follows_follower_id_idx on follows (follower_id);
create index follows_followee_id_idx on follows (followee_id);

create table trip_collaborators (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  role collaborator_role not null default 'viewer',
  invited_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (trip_id, profile_id)
);

create index trip_collaborators_trip_id_idx on trip_collaborators (trip_id);
create index trip_collaborators_profile_id_idx on trip_collaborators (profile_id);
