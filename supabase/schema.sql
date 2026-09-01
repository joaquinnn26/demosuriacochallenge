create table if not exists public.activities (
  slug text primary key,
  name text not null,
  category text not null check (category in ('trekking', 'astronomia', 'invernales', 'escalada', 'viajes')),
  filters text[] not null default '{}',
  status text not null default 'draft' check (status in ('published', 'draft', 'archived')),
  location text not null default '',
  google_maps_url text,
  latitude double precision,
  longitude double precision,
  difficulty text not null check (difficulty in ('Fácil', 'Media', 'Difícil')),
  duration text not null check (duration in ('1 día', 'Más de 1 día')),
  duration_days integer,
  distance text not null default '',
  distance_km numeric,
  elevation text not null default '',
  elevation_m integer,
  min_age text not null default 'Consultar',
  min_age_years integer,
  max_participants text not null default 'Cupo limitado',
  max_participants_count integer,
  price text not null default 'Consultar valor',
  next_date text not null default '',
  next_date_iso date,
  image text not null default '',
  images text[] not null default '{}',
  image_alt text not null default '',
  summary text not null default '',
  description text not null default '',
  route_points text[] not null default '{}',
  includes text[] not null default '{}',
  required_gear text[] not null default '{}',
  recommended_gear text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_status_sort_order_idx
  on public.activities (status, sort_order);

alter table public.activities
  add column if not exists google_maps_url text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists duration_days integer,
  add column if not exists distance_km numeric,
  add column if not exists elevation_m integer,
  add column if not exists min_age_years integer,
  add column if not exists max_participants_count integer,
  add column if not exists next_date_iso date,
  add column if not exists images text[] not null default '{}';

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_activities_updated_at on public.activities;

create trigger set_activities_updated_at
before update on public.activities
for each row
execute function public.set_updated_at();

alter table public.activities enable row level security;

drop policy if exists "Actividades publicadas visibles" on public.activities;

create policy "Actividades publicadas visibles"
on public.activities
for select
to anon, authenticated
using (status = 'published');
