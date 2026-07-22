import { createClient } from '@supabase/supabase-js'

// ─── Replace these with your Supabase project values ───────────────────────
// You can find them at: https://supabase.com/dashboard → Project Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
// ────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/*
 ╔══════════════════════════════════════════════════════╗
 ║          SUPABASE SQL — Run in SQL Editor            ║
 ║   supabase.com → your project → SQL Editor → New    ║
 ╚══════════════════════════════════════════════════════╝

-- 1. ROOMS
create table rooms (
  id uuid primary key default gen_random_uuid(),
  num text not null unique,
  type text not null check (type in ('Standard','Deluxe','Suite')),
  rate numeric not null default 1500,
  status text not null default 'available'
    check (status in ('available','occupied','cleaning','maintenance')),
  guest_name text default '',
  created_at timestamptz default now()
);

-- 2. GUESTS
create table guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text default '',
  id_type text default '',
  id_num text default '',
  room_num text references rooms(num),
  pax integer default 1,
  date_in date not null,
  date_out date not null,
  notes text default '',
  status text not null default 'in' check (status in ('in','out')),
  paid boolean default false,
  extra numeric default 0,
  created_at timestamptz default now()
);

-- 3. HOUSEKEEPING
create table housekeeping (
  id uuid primary key default gen_random_uuid(),
  room_num text not null,
  task text not null,
  staff text default 'Unassigned',
  priority text default 'Normal' check (priority in ('Normal','High','Urgent')),
  status text default 'pending' check (status in ('pending','in-progress','done')),
  created_at timestamptz default now()
);

-- 4. Row Level Security (open for now — add auth later)
alter table rooms enable row level security;
alter table guests enable row level security;
alter table housekeeping enable row level security;

create policy "Allow all" on rooms for all using (true) with check (true);
create policy "Allow all" on guests for all using (true) with check (true);
create policy "Allow all" on housekeeping for all using (true) with check (true);

-- 5. Seed rooms
insert into rooms (num, type, rate, status, guest_name) values
  ('101','Standard',1500,'occupied','R. Dela Cruz'),
  ('102','Standard',1500,'available',''),
  ('103','Standard',1500,'available',''),
  ('104','Deluxe',2500,'available',''),
  ('105','Deluxe',2500,'occupied','A. Reyes'),
  ('106','Standard',1500,'cleaning',''),
  ('201','Deluxe',2500,'occupied','B. Santos'),
  ('202','Deluxe',2500,'available',''),
  ('203','Suite',4000,'available',''),
  ('204','Suite',4000,'occupied','L. Villanueva'),
  ('205','Deluxe',2500,'maintenance',''),
  ('206','Suite',4000,'available','');
*/
