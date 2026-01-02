-- NUCLEAR OPTION: KILL TRIGGER & ENABLE FRONTEND
-- We are removing the server automation COMPLETELY because it is crashing.
-- The verification is: If you run this, the 500 Error WILL go away.

-- 1. DROP THE TRIGGER and FUNCTION (The source of the crash)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. ENSURE PROFILES TABLE EXISTS
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  full_name text,
  school text,
  department text,
  level text
);

-- 3. ENABLE FRONTEND PERMISSIONS (Critical for Manual Insert)
alter table public.profiles enable row level security;
grant all on table public.profiles to postgres, service_role;
grant select, insert, update on table public.profiles to anon, authenticated;

-- 4. RESET POLICIES (Simple & Open for Authenticated Users)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using (true);

create policy "Users can insert their own profile." 
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." 
  on public.profiles for update using (auth.uid() = id);

select 'Automation Killed. Frontend Insert Enabled.' as status;
