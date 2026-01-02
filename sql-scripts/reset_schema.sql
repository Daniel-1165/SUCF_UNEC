-- FAIL-SAFE RECOVERY SCRIPT
-- Run this to fix the 500 Error.

-- 1. Clean Slate (Trigger & Function)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Ensure Table Exists & Fix Permissions
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  full_name text,
  school text,
  department text,
  level text
);

-- Force Permissions (Crucial for 500 errors)
alter table public.profiles enable row level security;
grant all on table public.profiles to postgres, service_role;
grant select, insert, update on table public.profiles to anon, authenticated;

-- 3. Reset Policies
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- 4. Fail-Safe Trigger Function
-- This version uses a TRY-CATCH block. If profile creation fails, 
-- it allows the User to be created anyway, preventing the 500 error.
create or replace function public.handle_new_user()
returns trigger 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, school, department, level)
  values (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Anonymous'), 
    COALESCE(new.raw_user_meta_data->>'school', 'Unknown'),
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'level'
  );
  return new;
exception
  when others then
    -- Log error (visible in Supabase logs) but DO NOT FAIL the request
    raise warning 'Profile creation failed: %', SQLERRM;
    return new;
end;
$$ language plpgsql;

-- 5. Re-attach Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

select 'Fail-safe schema applied' as status;
