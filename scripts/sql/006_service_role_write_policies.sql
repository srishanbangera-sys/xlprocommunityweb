-- add write (insert/update/delete) policies for service_role on core tables
-- These policies allow only service role (used by server actions) to write.
-- Public read policies you already have remain untouched.

-- MEMBERS
alter table if exists public.members enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'members' and policyname = 'service_role_members_insert'
  ) then
    create policy "service_role_members_insert"
      on public.members for insert to public
      with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'members' and policyname = 'service_role_members_update'
  ) then
    create policy "service_role_members_update"
      on public.members for update to public
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'members' and policyname = 'service_role_members_delete'
  ) then
    create policy "service_role_members_delete"
      on public.members for delete to public
      using (auth.role() = 'service_role');
  end if;
end $$;

-- EVENTS
alter table if exists public.events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'service_role_events_insert'
  ) then
    create policy "service_role_events_insert"
      on public.events for insert to public
      with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'service_role_events_update'
  ) then
    create policy "service_role_events_update"
      on public.events for update to public
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'events' and policyname = 'service_role_events_delete'
  ) then
    create policy "service_role_events_delete"
      on public.events for delete to public
      using (auth.role() = 'service_role');
  end if;
end $$;

-- EVENT REGISTRATIONS (if used)
alter table if exists public.event_registrations enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_registrations' and policyname = 'service_role_event_regs_insert'
  ) then
    create policy "service_role_event_regs_insert"
      on public.event_registrations for insert to public
      with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_registrations' and policyname = 'service_role_event_regs_update'
  ) then
    create policy "service_role_event_regs_update"
      on public.event_registrations for update to public
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_registrations' and policyname = 'service_role_event_regs_delete'
  ) then
    create policy "service_role_event_regs_delete"
      on public.event_registrations for delete to public
      using (auth.role() = 'service_role');
  end if;
end $$;

-- STORAGE BUCKET POLICIES (members, events) for service-role writes
-- Note: Storage RLS applies on storage.objects with bucket_id filter.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'service_role_storage_members_write'
  ) then
    create policy "service_role_storage_members_write"
      on storage.objects for all to public
      using (auth.role() = 'service_role' and bucket_id = 'members')
      with check (auth.role() = 'service_role' and bucket_id = 'members');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'service_role_storage_events_write'
  ) then
    create policy "service_role_storage_events_write"
      on storage.objects for all to public
      using (auth.role() = 'service_role' and bucket_id = 'events')
      with check (auth.role() = 'service_role' and bucket_id = 'events');
  end if;
end $$;

-- Optional: ensure the buckets exist (safe no-op if already created)
insert into storage.buckets (id, name, public)
select 'members', 'members', true
where not exists (select 1 from storage.buckets where id = 'members');

insert into storage.buckets (id, name, public)
select 'events', 'events', true
where not exists (select 1 from storage.buckets where id = 'events');
