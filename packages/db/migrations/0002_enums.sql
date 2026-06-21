create type visibility as enum ('private', 'friends', 'public');
create type friend_status as enum ('pending', 'accepted', 'blocked');
create type collaborator_role as enum ('viewer', 'editor');
create type place_category as enum (
  'landmark', 'restaurant', 'lodging', 'activity', 'nature', 'city', 'other'
);
create type event_type as enum (
  'media_upload', 'storage_usage', 'ai_usage', 'ad_impression',
  'public_page_view', 'share_link_created', 'share_link_visited',
  'follow_created', 'friend_request_sent', 'friend_request_accepted'
);
