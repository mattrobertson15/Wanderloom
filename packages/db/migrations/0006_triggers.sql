-- Auto-create a profile row whenever a new auth user signs up.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data ->> 'display_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Generic updated_at maintenance.
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_set_updated_at
  before update on trips
  for each row execute procedure set_updated_at();

create trigger albums_set_updated_at
  before update on albums
  for each row execute procedure set_updated_at();

create trigger posts_set_updated_at
  before update on posts
  for each row execute procedure set_updated_at();

create trigger friendships_set_updated_at
  before update on friendships
  for each row execute procedure set_updated_at();

-- Pins maintenance: a pin row represents "this place is map-visible because
-- of this trip/post." Effective visibility = min(post.visibility, trip.visibility).
create function effective_post_visibility(p_post_visibility visibility, p_trip_visibility visibility)
returns visibility
language sql
immutable
as $$
  select case
    when p_post_visibility = 'private' or p_trip_visibility = 'private' then 'private'::visibility
    when p_post_visibility = 'friends' or p_trip_visibility = 'friends' then 'friends'::visibility
    else 'public'::visibility
  end;
$$;

create function sync_pin_for_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trip_visibility visibility;
  v_owner_id uuid;
begin
  if (tg_op = 'DELETE') then
    delete from pins where post_id = old.id;
    return old;
  end if;

  if new.place_id is null then
    delete from pins where post_id = new.id;
    return new;
  end if;

  select visibility, owner_id into v_trip_visibility, v_owner_id
  from trips where id = new.trip_id;

  insert into pins (place_id, trip_id, post_id, owner_id, visibility)
  values (
    new.place_id,
    new.trip_id,
    new.id,
    v_owner_id,
    effective_post_visibility(new.visibility, v_trip_visibility)
  )
  on conflict (trip_id, post_id, place_id)
  do update set visibility = excluded.visibility;

  -- If the place changed, drop any stale pin rows for this post that no
  -- longer match its current place.
  delete from pins where post_id = new.id and place_id <> new.place_id;

  return new;
end;
$$;

create trigger posts_sync_pin
  after insert or update of place_id, visibility, trip_id on posts
  for each row execute procedure sync_pin_for_post();

create trigger posts_delete_pin
  after delete on posts
  for each row execute procedure sync_pin_for_post();

-- Keep pins in sync when a trip's own visibility changes (affects every
-- post under it via effective visibility).
create function sync_pins_for_trip()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update pins p
  set visibility = effective_post_visibility(posts.visibility, new.visibility)
  from posts
  where posts.id = p.post_id and p.trip_id = new.id;
  return new;
end;
$$;

create trigger trips_sync_pins
  after update of visibility on trips
  for each row execute procedure sync_pins_for_trip();
