-- HIVE Simulation Studio persistence foundation
-- Apply after Simulation Studio feature validation.

create table if not exists public.simulation_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  difficulty text not null default 'intermediate' check (difficulty in ('introductory','intermediate','advanced')),
  patient jsonb not null default '{}'::jsonb,
  scenario_definition jsonb not null default '{}'::jsonb,
  learning_objectives jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, slug)
);

create table if not exists public.simulation_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  scenario_id uuid references public.simulation_scenarios(id) on delete set null,
  status text not null default 'lobby' check (status in ('lobby','running','paused','completed','cancelled')),
  instructor_user_id uuid references auth.users(id),
  current_state text,
  live_state jsonb not null default '{}'::jsonb,
  score numeric not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.simulation_participants (
  session_id uuid not null references public.simulation_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'learner' check (role in ('instructor','learner','observer')),
  joined_at timestamptz not null default now(),
  primary key(session_id,user_id)
);

create table if not exists public.simulation_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.simulation_sessions(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  actor_role text,
  event_type text not null,
  event_label text not null,
  payload jsonb not null default '{}'::jsonb,
  score_delta numeric not null default 0,
  occurred_at timestamptz not null default now()
);

create index if not exists simulation_scenarios_org_idx on public.simulation_scenarios(organization_id,status);
create index if not exists simulation_sessions_org_idx on public.simulation_sessions(organization_id,created_at desc);
create index if not exists simulation_events_session_idx on public.simulation_events(session_id,occurred_at);
create index if not exists simulation_events_org_idx on public.simulation_events(organization_id);

alter table public.simulation_scenarios enable row level security;
alter table public.simulation_sessions enable row level security;
alter table public.simulation_participants enable row level security;
alter table public.simulation_events enable row level security;

grant select on public.simulation_scenarios to authenticated;
grant select,insert,update on public.simulation_sessions to authenticated;
grant select,insert,delete on public.simulation_participants to authenticated;
grant select,insert on public.simulation_events to authenticated;
grant usage,select on all sequences in schema public to authenticated;

create policy "members can read published simulation scenarios"
on public.simulation_scenarios for select to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = simulation_scenarios.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "admins can manage simulation scenarios"
on public.simulation_scenarios for all to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = simulation_scenarios.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = simulation_scenarios.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
);

create policy "members can read organization simulation sessions"
on public.simulation_sessions for select to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = simulation_sessions.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "members can create simulation sessions"
on public.simulation_sessions for insert to authenticated
with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = simulation_sessions.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "instructors can update their simulation sessions"
on public.simulation_sessions for update to authenticated
using (
  instructor_user_id = (select auth.uid())
  or exists (
    select 1 from public.organization_members m
    where m.organization_id = simulation_sessions.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
);

create policy "participants can read session membership"
on public.simulation_participants for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (
    select 1 from public.simulation_sessions s
    where s.id = simulation_participants.session_id
      and s.instructor_user_id = (select auth.uid())
  )
);

create policy "members can join simulation sessions"
on public.simulation_participants for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "participants can read simulation events"
on public.simulation_events for select to authenticated
using (
  exists (
    select 1 from public.simulation_participants p
    where p.session_id = simulation_events.session_id
      and p.user_id = (select auth.uid())
  )
  or exists (
    select 1 from public.simulation_sessions s
    where s.id = simulation_events.session_id
      and s.instructor_user_id = (select auth.uid())
  )
);

create policy "participants can append simulation events"
on public.simulation_events for insert to authenticated
with check (
  actor_user_id = (select auth.uid())
  and exists (
    select 1 from public.simulation_participants p
    where p.session_id = simulation_events.session_id
      and p.user_id = (select auth.uid())
  )
);
