-- COMPREHENSIVE REPAIR SCRIPT
-- This script repairs the entire auth-to-profile flow.
-- Run this in the Supabase SQL Editor.

-- 1. Ensure PROFILES table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  school TEXT,
  department TEXT,
  level TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  avatar_url TEXT
);

-- 2. Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies (Drop first to avoid errors)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Allow users to see their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow admins to see all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Create proper Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, school, department, level)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'school',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'level'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Re-create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. BACKFILL EXISTING USERS
-- This is critical for users who already signed up but have no profile
INSERT INTO public.profiles (id, email, full_name, school, department, level)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'school',
  raw_user_meta_data->>'department',
  raw_user_meta_data->>'level'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 7. Verify Admin Status (Optional: Set specific email as admin if needed)
-- UPDATE public.profiles SET is_admin = true WHERE email = 'your-email@example.com';

SELECT 'Auth system repaired and profiles backfilled successfully' as status;
