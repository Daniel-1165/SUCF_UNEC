-- DISABLE TRIGGER SCRIPT
-- This script REMOVES the automation that is causing the error.
-- We will handle profile creation in the App instead.

-- 1. DROP the Trigger and Function (stops the 500 Error)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Ensure Profiles Table Exists
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  full_name text,
  school text,
  department text,
  level text
);

-- 3. Update Permissions to allow Frontend Creation
alter table public.profiles enable row level security;

-- Clear old policies to avoid conflicts
drop policy if exists "Enable read access for all users" on public.profiles;
drop policy if exists "Enable insert for authenticated users only" on public.profiles;
drop policy if exists "Enable update for users based on email" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

-- Create simple policies
create policy "Public profiles are viewable by everyone." 
on public.profiles for select using (true);

-- ALLOW INSERT checking against the User ID (crucial for frontend insertion)
create policy "Users can insert their own profile." 
on public.profiles for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." 
on public.profiles for update using ((select auth.uid()) = id);

select 'Trigger Removed. Client-side creation enabled.' as status;
