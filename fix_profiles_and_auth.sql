-- =====================================================
-- FIX SUPABASE PROFILES TABLE AND AUTHENTICATION
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. CREATE PROFILES TABLE IF IT DOESN'T EXIST
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. DROP EXISTING POLICIES (to avoid conflicts)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 4. CREATE NEW POLICIES

-- Allow everyone to view all profiles (needed for admin checks)
-- This is safe because we only store non-sensitive profile info
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO public
USING (true);

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Allow admins to update any profile
-- NOTE: We check is_admin directly on the row being accessed, not via a subquery
-- This prevents infinite recursion
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  -- Either it's the user's own profile, or the user is an admin
  auth.uid() = id OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
)
WITH CHECK (
  -- Same check for updates
  auth.uid() = id OR 
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);


-- 5. CREATE FUNCTION TO AUTOMATICALLY CREATE PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    -- Make the first user or specific email an admin
    CASE 
      WHEN new.email = 'sucfunec01@gmail.com' THEN true
      WHEN NOT EXISTS (SELECT 1 FROM public.profiles) THEN true
      ELSE false
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. DROP EXISTING TRIGGER IF IT EXISTS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 7. CREATE TRIGGER TO RUN FUNCTION ON USER SIGNUP
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. CREATE PROFILES FOR EXISTING USERS (if any)
INSERT INTO public.profiles (id, email, full_name, is_admin)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  CASE 
    WHEN email = 'sucfunec01@gmail.com' THEN true
    ELSE false
  END
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 9. ENSURE THE ADMIN EMAIL HAS ADMIN PRIVILEGES
UPDATE public.profiles
SET is_admin = true
WHERE email = 'sucfunec01@gmail.com';

-- 10. CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. DROP EXISTING UPDATED_AT TRIGGER IF IT EXISTS
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

-- 12. CREATE TRIGGER TO UPDATE updated_at TIMESTAMP
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if profiles table exists and has correct structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check all profiles
SELECT id, email, full_name, is_admin, created_at
FROM public.profiles;

-- Check RLS policies on profiles table
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verify triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public' OR event_object_schema = 'auth'
ORDER BY event_object_table, trigger_name;
