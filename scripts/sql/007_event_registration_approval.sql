-- Enable required extension for UUIDs
create extension if not exists "pgcrypto";

-- ==========================================================
-- MEMBERS TABLE
-- ==========================================================
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

drop policy if exists public_can_read_members on public.members;
create policy public_can_read_members
on public.members
for select
to anon
using (true);

-- Trigger to update updated_at
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

-- ==========================================================
-- EVENTS TABLE
-- ==========================================================
create table if not exists public.events (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    department text,
    status text default 'Upcoming',
    location text,
    speaker text,
    poster_url text,
    payment_qr_url text,
    price_per_member int,
    starts_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.events enable row level security;

drop policy if exists public_can_read_events on public.events;
create policy public_can_read_events
on public.events
for select
to anon
using (true);

drop trigger if exists trg_events_updated on public.events;
create trigger trg_events_updated
before update on public.events
for each row execute procedure public.set_updated_at();

-- ==========================================================
-- REGISTERED STUDENTS TABLE
-- ==========================================================
create table if not exists public.registered_students (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references public.events(id) on delete cascade,
    team_name text not null,
    theme text check (theme in ('circuit','non-circuit')) not null,
    team_size int check (team_size between 1 and 10) not null,
    members jsonb not null,
    amount int not null,
    txn_id text not null,
    payment_proof_url text,
    created_at timestamptz default now(),
    status text default 'pending'
);

alter table public.registered_students enable row level security;

-- Drop existing policies
drop policy if exists registered_students_public_insert on public.registered_students;
drop policy if exists registered_students_public_select on public.registered_students;
drop policy if exists registered_students_service_all on public.registered_students;

-- Public can insert
create policy registered_students_public_insert
on public.registered_students
for insert
to anon, authenticated
with check (true);

-- Public can read (optional)
create policy registered_students_public_select
on public.registered_students
for select
to anon, authenticated
using (true);

-- Service role full access
create policy registered_students_service_all
on public.registered_students
for all
to service_role
using (true)
with check (true);

-- ==========================================================
-- APPROVED LIST TABLE
-- ==========================================================
create table if not exists public.approved_list (
    id uuid primary key default gen_random_uuid(),
    registration_id uuid references public.registered_students(id) on delete cascade,
    event_id uuid,
    team_name text not null,
    members jsonb not null,
    approved_at timestamptz default now()
);

alter table public.approved_list enable row level security;

-- Drop existing policies
drop policy if exists approved_list_service_select on public.approved_list;
drop policy if exists approved_list_service_all on public.approved_list;

-- Service role only
create policy approved_list_service_select
on public.approved_list
for select
to service_role
using (true);

create policy approved_list_service_all
on public.approved_list
for all
to service_role
using (true)
with check (true);
