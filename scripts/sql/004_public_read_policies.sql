-- Enable RLS if not already enabled
alter table if exists public.members enable row level security;
alter table if exists public.events enable row level security;
alter table if exists public.event_registrations enable row level security;

-- Members: public read
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'members' and policyname = 'Public read members'
  ) then
    create policy "Public read members" on public.members
      for select
      using (true);
  end if;
end$$;

-- Events: public read
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'Public read events'
  ) then
    create policy "Public read events" on public.events
      for select
      using (true);
  end if;
end$$;

-- Event registrations: allow anonymous inserts
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'event_registrations' and policyname = 'Anon insert registrations'
  ) then
    create policy "Anon insert registrations" on public.event_registrations
      for insert
      with check (true);
  end if;
end$$;

-- Create storage buckets if they don't exist
insert into storage.buckets (id, name, public)
  values ('members', 'members', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('events', 'events', true)
  on conflict (id) do nothing;

-- Storage policies: public read
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read members bucket'
  ) then
    create policy "Public read members bucket"
      on storage.objects for select
      using (bucket_id = 'members');
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read events bucket'
  ) then
    create policy "Public read events bucket"
      on storage.objects for select
      using (bucket_id = 'events');
  end if;
end$$;
