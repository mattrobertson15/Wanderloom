# Migrations

Plain SQL migrations applied via the Supabase CLI (`supabase db push` or
`supabase migration up` against a linked project). Files are numbered and
applied in order:

1. `0001_extensions.sql` — PostGIS
2. `0002_enums.sql` — shared enum types
3. `0003_tables_core.sql` — profiles, places, trips, albums, posts, photos, pins
4. `0004_tables_social.sql` — friendships, follows, trip_collaborators
5. `0005_tables_sharing_events.sql` — share_links, events
6. `0006_triggers.sql` — profile creation, updated_at, pins sync
7. `0007_rls_functions.sql` — helper functions used by policies
8. `0008_rls_policies.sql` — RLS enablement + all policies
9. `0009_storage_buckets.sql` — storage buckets + object policies

See `/docs/DATABASE_SCHEMA.md` for the schema rationale.
