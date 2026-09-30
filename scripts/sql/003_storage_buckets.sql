-- create storage buckets and ensure columns exist
-- Buckets for member avatars and event posters
select storage.create_bucket('members', public => true);
select storage.create_bucket('events', public => true);

-- Allow public read access for both buckets
create policy if not exists "Public read members bucket"
on storage.objects for select
using ( bucket_id = 'members' );

create policy if not exists "Public read events bucket"
on storage.objects for select
using ( bucket_id = 'events' );

-- Ensure columns exist on tables
alter table if exists public.members
  add column if not exists avatar_url text;

alter table if exists public.events
  add column if not exists poster_url text;

-- Realtime publication (idempotent)
alter publication supabase_realtime add table public.members;
alter publication supabase_realtime add table public.events;
