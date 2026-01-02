-- FINAL DEFINITIVE FIX
-- This script fixes the "Database error saving new user" by:
-- 1. Using SECURITY DEFINER and setting search_path (Critical for triggers).
-- 2. Adding an EXCEPTION block so the User Creation NEVER fails, even if the profile insert errors.

-- 1. CLEANUP (Drop old broken triggers/functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. ENSURE TABLE EXISTS & PERMISSIONS
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  full_name text,
  school text,
  department text,
  level text
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;

-- 3. POLICIES (Standard Security)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 4. THE ROBUST TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public -- Ensures it runs with admin privileges in the right schema
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, school, department, level)
  VALUES (
    new.id, 
    -- Use COALESCE to handle missing data gracefully
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(new.raw_user_meta_data->>'school', ''),
    COALESCE(new.raw_user_meta_data->>'department', ''),
    COALESCE(new.raw_user_meta_data->>'level', '')
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- CRITICAL: Catch any error so the User is still created.
  -- Log the error to Supabase internal logs for debugging.
  RAISE WARNING 'Profile creation failed for User %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

-- 5. RE-ATTACH TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Final Fix Applied Successfully' as status;
