-- Add RLS policies for admin writes and public reads, plus storage policies

-- Ensure RLS is enabled
alter table if exists public.members enable row level security;
alter table if exists public.events enable row level security;
alter table if exists public.event_registrations enable row level security;

-- Public read (frontend uses anon key)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'members' and policyname = 'Public read members'
  ) then
    create policy "Public read members" on public.members
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'Public read events'
  ) then
    create policy "Public read events" on public.events
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_registrations' and policyname = 'Public read registrations'
  ) then
    create policy "Public read registrations" on public.event_registrations
      for select using (true);
  end if;
end
$$;

-- Admin write policies (service role only)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'members' and policyname = 'Admin write members'
  ) then
    create policy "Admin write members" on public.members
      for all
      using ((auth.jwt() ->> 'role') = 'service_role')
      with check ((auth.jwt() ->> 'role') = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'Admin write events'
  ) then
    create policy "Admin write events" on public.events
      for all
      using ((auth.jwt() ->> 'role') = 'service_role')
      with check ((auth.jwt() ->> 'role') = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_registrations' and policyname = 'Admin write registrations'
  ) then
    create policy "Admin write registrations" on public.event_registrations
      for all
      using ((auth.jwt() ->> 'role') = 'service_role')
      with check ((auth.jwt() ->> 'role') = 'service_role');
  end if;
end
$$;

-- Create storage buckets (idempotent)
select storage.create_bucket('members', true);
select storage.create_bucket('events', true);

-- Ensure RLS on storage.objects
alter table if exists storage.objects enable row level security;

-- Public read for buckets
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read members bucket'
  ) then
    create policy "Public read members bucket" on storage.objects
      for select using (bucket_id = 'members');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read events bucket'
  ) then
    create policy "Public read events bucket" on storage.objects
      for select using (bucket_id = 'events');
  end if;
end
$$;

-- Admin writes for buckets
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admin write members bucket'
  ) then
    create policy "Admin write members bucket" on storage.objects
      for all
      using (bucket_id = 'members' and (auth.jwt() ->> 'role') = 'service_role')
      with check (bucket_id = 'members' and (auth.jwt() ->> 'role') = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admin write events bucket'
  ) then
    create policy "Admin write events bucket" on storage.objects
      for all
      using (bucket_id = 'events' and (auth.jwt() ->> 'role') = 'service_role')
      with check (bucket_id = 'events' and (auth.jwt() ->> 'role') = 'service_role');
  end if;
end
$$;
