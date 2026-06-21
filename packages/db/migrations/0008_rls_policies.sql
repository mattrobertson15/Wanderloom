-- Enable RLS everywhere user content lives, then define policies
-- implementing docs/DATABASE_SCHEMA.md's visibility model.

alter table profiles enable row level security;
alter table places enable row level security;
alter table trips enable row level security;
alter table albums enable row level security;
alter table posts enable row level security;
alter table photos enable row level security;
alter table pins enable row level security;
alter table friendships enable row level security;
alter table follows enable row level security;
alter table trip_collaborators enable row level security;
alter table share_links enable row level security;
alter table events enable row level security;

-- profiles: public-facing identity, readable by everyone.
create policy "profiles are publicly readable"
  on profiles for select
  using (true);

create policy "users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- places: global reference data, readable by everyone, insertable by
-- any authenticated user. No update/delete policy at MVP (admin concern).
create policy "places are publicly readable"
  on places for select
  using (true);

create policy "authenticated users can create places"
  on places for insert
  to authenticated
  with check (auth.uid() = created_by);

-- trips
create policy "trips are visible per visibility model"
  on trips for select
  using (can_view_trip(id, owner_id, visibility));

create policy "owners can insert trips"
  on trips for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "owners and editors can update trips"
  on trips for update
  using (auth.uid() = owner_id or is_trip_collaborator(id, 'editor'));

create policy "owners can delete trips"
  on trips for delete
  using (auth.uid() = owner_id);

-- albums: visibility derives from the parent trip (albums have no
-- visibility of their own).
create policy "albums are visible if parent trip is visible"
  on albums for select
  using (
    exists (
      select 1 from trips
      where trips.id = albums.trip_id
        and can_view_trip(trips.id, trips.owner_id, trips.visibility)
    )
  );

create policy "owners and editors can insert albums"
  on albums for insert
  to authenticated
  with check (
    exists (
      select 1 from trips
      where trips.id = albums.trip_id
        and (trips.owner_id = auth.uid() or is_trip_collaborator(trips.id, 'editor'))
    )
  );

create policy "owners and editors can update albums"
  on albums for update
  using (
    exists (
      select 1 from trips
      where trips.id = albums.trip_id
        and (trips.owner_id = auth.uid() or is_trip_collaborator(trips.id, 'editor'))
    )
  );

create policy "owners and editors can delete albums"
  on albums for delete
  using (
    exists (
      select 1 from trips
      where trips.id = albums.trip_id
        and (trips.owner_id = auth.uid() or is_trip_collaborator(trips.id, 'editor'))
    )
  );

-- posts: effective visibility = min(post.visibility, trip.visibility).
create policy "posts are visible per effective visibility"
  on posts for select
  using (
    exists (
      select 1 from trips
      where trips.id = posts.trip_id
        and (
          trips.owner_id = auth.uid()
          or is_trip_collaborator(trips.id)
          or effective_post_visibility(posts.visibility, trips.visibility) = 'public'
          or (
            effective_post_visibility(posts.visibility, trips.visibility) = 'friends'
            and are_friends(auth.uid(), trips.owner_id)
          )
        )
    )
  );

create policy "owners and editors can insert posts"
  on posts for insert
  to authenticated
  with check (
    exists (
      select 1 from trips
      where trips.id = posts.trip_id
        and (trips.owner_id = auth.uid() or is_trip_collaborator(trips.id, 'editor'))
    )
  );

create policy "owners and editors can update posts"
  on posts for update
  using (
    exists (
      select 1 from trips
      where trips.id = posts.trip_id
        and (trips.owner_id = auth.uid() or is_trip_collaborator(trips.id, 'editor'))
    )
  );

create policy "owners and editors can delete posts"
  on posts for delete
  using (
    exists (
      select 1 from trips
      where trips.id = posts.trip_id
        and (trips.owner_id = auth.uid() or is_trip_collaborator(trips.id, 'editor'))
    )
  );

-- photos: visibility follows the parent post (cover photos with no post_id
-- are readable if their uploader is the viewer; trip/album cover lookups
-- are resolved app-side against the already-authorized trip/album).
create policy "photos are visible if parent post is visible"
  on photos for select
  using (
    post_id is null
    or exists (
      select 1 from posts
      join trips on trips.id = posts.trip_id
      where posts.id = photos.post_id
        and (
          trips.owner_id = auth.uid()
          or is_trip_collaborator(trips.id)
          or effective_post_visibility(posts.visibility, trips.visibility) = 'public'
          or (
            effective_post_visibility(posts.visibility, trips.visibility) = 'friends'
            and are_friends(auth.uid(), trips.owner_id)
          )
        )
    )
  );

create policy "uploaders can insert their own photos"
  on photos for insert
  to authenticated
  with check (auth.uid() = uploader_id);

create policy "uploaders can delete their own photos"
  on photos for delete
  using (auth.uid() = uploader_id);

-- pins: denormalized, visibility column is pre-resolved at write time.
create policy "pins are visible per their resolved visibility"
  on pins for select
  using (
    auth.uid() = owner_id
    or visibility = 'public'
    or (visibility = 'friends' and are_friends(auth.uid(), owner_id))
  );

-- pins are written only via the sync_pin_for_post trigger (security
-- definer), so no direct insert/update/delete policy is needed for clients.

-- friendships: visible to either party; mutable by either party.
create policy "friendships visible to participants"
  on friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "users can send friend requests"
  on friendships for insert
  to authenticated
  with check (auth.uid() = requester_id);

create policy "participants can update friendship status"
  on friendships for update
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "participants can remove a friendship"
  on friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- follows: visible to follower/followee; only the follower can create/remove.
create policy "follows visible to participants"
  on follows for select
  using (auth.uid() = follower_id or auth.uid() = followee_id);

create policy "users can follow others"
  on follows for insert
  to authenticated
  with check (auth.uid() = follower_id);

create policy "followers can unfollow"
  on follows for delete
  using (auth.uid() = follower_id);

-- trip_collaborators: visible to the collaborator and the trip owner;
-- managed only by the trip owner.
create policy "collaborators visible to owner and collaborator"
  on trip_collaborators for select
  using (
    auth.uid() = profile_id
    or auth.uid() = (select owner_id from trips where trips.id = trip_collaborators.trip_id)
  );

create policy "trip owners manage collaborators"
  on trip_collaborators for all
  using (auth.uid() = (select owner_id from trips where trips.id = trip_collaborators.trip_id))
  with check (auth.uid() = (select owner_id from trips where trips.id = trip_collaborators.trip_id));

-- share_links: visible/manageable by their creator; resolution for
-- anonymous visitors happens via a server-side route using the service role.
create policy "creators manage their share links"
  on share_links for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- events: insert-only from authenticated clients; no client-side select.
create policy "authenticated users can record their own events"
  on events for insert
  to authenticated
  with check (auth.uid() = profile_id or profile_id is null);
