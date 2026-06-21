-- Storage buckets per docs/ARCHITECTURE.md and docs/DATABASE_SCHEMA.md.
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('trip-covers', 'trip-covers', true),
  ('post-photos', 'post-photos', false)
on conflict (id) do nothing;

create policy "avatars are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "users upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "trip covers are publicly readable"
  on storage.objects for select
  using (bucket_id = 'trip-covers');

create policy "users upload covers into their own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'trip-covers' and (storage.foldername(name))[1] = auth.uid()::text);

-- post-photos is private; access is mediated by signed URLs generated
-- server-side after checking the owning post's effective visibility.
create policy "users upload their own post photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users manage their own post photos"
  on storage.objects for delete
  using (bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text);
