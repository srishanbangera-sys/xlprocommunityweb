-- Enable required extension for UUIDs (if not already)
create extension if not exists "pgcrypto";

-- members
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('Lead','Member','Alumni')),
  batch text,
  status text default 'Active',
  skills text[],
  avatar_url text,
  github_url text,
  github_handle text,
  linkedin_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.members enable row level security;

create policy "Public can read members"
on public.members for select
to anon
using (true);

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_members_updated on public.members;
create trigger trg_members_updated
before update on public.members
for each row execute procedure public.set_updated_at();

-- events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  department text,
  status text default 'Upcoming',
  location text,
  speaker text,
  poster_url text,
  starts_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Public can read events"
on public.events for select
to anon
using (true);

drop trigger if exists trg_events_updated on public.events;
create trigger trg_events_updated
before update on public.events
for each row execute procedure public.set_updated_at();

-- event registrations
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  department text,
  year text,
  created_at timestamptz default now()
);

alter table public.event_registrations enable row level security;

-- Allow anonymous inserts for demo registrations (no PII beyond email/name)
create policy "Anon can insert registrations"
on public.event_registrations for insert
to anon
with check (true);
