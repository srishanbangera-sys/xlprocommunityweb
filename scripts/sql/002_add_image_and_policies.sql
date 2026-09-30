-- Members image_url
alter table if exists public.members add column if not exists image_url text;

-- Events cover_url
alter table if exists public.events add column if not exists cover_url text;

-- Realtime enabled (ensure replication is set up)
-- This may already be on; harmless if repeated
alter publication supabase_realtime add table public.members;
alter publication supabase_realtime add table public.events;

-- Public read (adjust to your security needs)
do $$
begin
  perform 1 from pg_policies where schemaname='public' and tablename='members' and policyname='Allow public read members';
  if not found then
    create policy "Allow public read members" on public.members for select using (true);
  end if;
end $$;

do $$
begin
  perform 1 from pg_policies where schemaname='public' and tablename='events' and policyname='Allow public read events';
  if not found then
    create policy "Allow public read events" on public.events for select using (true);
  end if;
end $$;
