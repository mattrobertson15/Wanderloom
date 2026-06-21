-- Core content tables: profiles, places, trips, albums, posts, photos, pins.
-- RLS is enabled and policies are defined later in 0008_rls_policies.sql,
-- once all referenced tables/functions exist.

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  home_location geography(point, 4326),
  default_visibility visibility not null default 'private',
  is_public_profile boolean not null default false,
  created_at timestamptz not null default now()
);

create index profiles_home_location_idx on profiles using gist (home_location);

-- Places are global and reusable; never owned by a single user or trip.
create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category place_category not null default 'other',
  location geography(point, 4326) not null,
  address text,
  country_code text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index places_location_idx on places using gist (location);
create index places_name_idx on places using gin (to_tsvector('english', name));

create table trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  description text,
  cover_photo_id uuid,
  start_date date,
  end_date date,
  visibility visibility not null default 'private',
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trips_owner_id_idx on trips (owner_id);
create index trips_visibility_idx on trips (visibility);

create table albums (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  title text not null,
  description text,
  cover_photo_id uuid,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index albums_trip_id_idx on albums (trip_id);

create table posts (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  album_id uuid references albums (id) on delete set null,
  place_id uuid references places (id) on delete set null,
  author_id uuid not null references profiles (id) on delete cascade,
  title text,
  body text,
  post_date date,
  visibility visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_trip_id_idx on posts (trip_id);
create index posts_album_id_idx on posts (album_id);
create index posts_place_id_idx on posts (place_id);

create table photos (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts (id) on delete cascade,
  uploader_id uuid not null references profiles (id) on delete cascade,
  storage_path text not null,
  width int,
  height int,
  taken_at timestamptz,
  location geography(point, 4326),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index photos_post_id_idx on photos (post_id);
create index photos_location_idx on photos using gist (location);

alter table trips
  add constraint trips_cover_photo_id_fkey
  foreign key (cover_photo_id) references photos (id) on delete set null;

alter table albums
  add constraint albums_cover_photo_id_fkey
  foreign key (cover_photo_id) references photos (id) on delete set null;

-- Pins are a derived, denormalized index of "this place is map-visible
-- because of this trip/post." Maintained by triggers in 0006_triggers.sql.
create table pins (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places (id) on delete cascade,
  trip_id uuid not null references trips (id) on delete cascade,
  post_id uuid references posts (id) on delete cascade,
  owner_id uuid not null references profiles (id) on delete cascade,
  visibility visibility not null,
  created_at timestamptz not null default now(),
  unique (trip_id, post_id, place_id)
);

create index pins_place_id_idx on pins (place_id);
create index pins_owner_id_idx on pins (owner_id);
create index pins_visibility_idx on pins (visibility);
