-- Schema for video-analyzer-v1
-- Ensure pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text null,
  original_path text not null,
  proxy_path text null,
  first_frame_path text null,
  duration_sec numeric null,
  fps numeric null,
  width int null,
  height int null,
  status text not null check (status in ('uploaded','processing','ready','error')),
  error_message text null
);

create table if not exists player_selections (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  x numeric not null,
  y numeric not null,
  w numeric not null,
  h numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  track_json_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists moments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  type text not null check (type in ('touch','shot','sprint','custom')),
  start_sec numeric not null,
  end_sec numeric not null,
  confidence text not null check (confidence in ('low','med','high')),
  source text not null check (source in ('auto','manual')),
  notes text null
);

create table if not exists clips (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references moments(id) on delete cascade,
  video_id uuid not null references videos(id) on delete cascade,
  clip_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  input_json jsonb not null,
  output_md text not null,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  type text not null,
  status text not null check (status in ('queued','running','done','error')),
  payload jsonb not null,
  result jsonb null,
  error_message text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_status_idx on jobs(status);
