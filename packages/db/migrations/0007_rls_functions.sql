-- Helper functions used by RLS policies in 0008_rls_policies.sql.

create function is_trip_collaborator(p_trip_id uuid, p_min_role collaborator_role default 'viewer')
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from trip_collaborators tc
    where tc.trip_id = p_trip_id
      and tc.profile_id = auth.uid()
      and (p_min_role = 'viewer' or tc.role = 'editor')
  );
$$;

create function are_friends(p_a uuid, p_b uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from friendships f
    where f.status = 'accepted'
      and (
        (f.requester_id = p_a and f.addressee_id = p_b) or
        (f.requester_id = p_b and f.addressee_id = p_a)
      )
  );
$$;

-- Whether the current viewer can see a trip with the given owner/visibility.
create function can_view_trip(p_trip_id uuid, p_owner_id uuid, p_visibility visibility)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    auth.uid() = p_owner_id
    or is_trip_collaborator(p_trip_id)
    or p_visibility = 'public'
    or (p_visibility = 'friends' and are_friends(auth.uid(), p_owner_id));
$$;
