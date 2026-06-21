create table share_links (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  trip_id uuid references trips (id) on delete cascade,
  created_by uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index share_links_trip_id_idx on share_links (trip_id);

-- Internal usage/analytics tracking. Insert-only from clients; select is
-- restricted to service-role/admin contexts. Not user-facing at MVP.
create table events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles (id) on delete set null,
  type event_type not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index events_profile_id_idx on events (profile_id);
create index events_type_idx on events (type);
create index events_created_at_idx on events (created_at);
