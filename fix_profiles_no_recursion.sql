-- =====================================================
-- FIX SUPABASE PROFILES TABLE - NO INFINITE RECURSION
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. DROP ALL EXISTING POLICIES ON PROFILES TABLE
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
END $$;

-- 2. CREATE PROFILES TABLE IF IT DOESN'T EXIST
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. CREATE SIMPLE, NON-RECURSIVE POLICIES

-- Policy 1: Everyone can read all profiles
-- This is safe and needed for admin checks to work
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
TO public
USING (true);

-- Policy 2: Users can insert their own profile
CREATE POLICY "profiles_insert_policy"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "profiles_update_own_policy"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Note: We removed the "admins can update all profiles" policy to avoid recursion
-- Admins will need to use the Supabase dashboard or service role key for admin operations

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
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  is_admin = CASE 
    WHEN EXCLUDED.email = 'sucfunec01@gmail.com' THEN true
    ELSE public.profiles.is_admin
  END;

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
SELECT 'Table Structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check all profiles
SELECT '' as separator;
SELECT 'All Profiles:' as info;
SELECT id, email, full_name, is_admin, created_at
FROM public.profiles;

-- Check RLS policies on profiles table
SELECT '' as separator;
SELECT 'RLS Policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- Success message
SELECT '' as separator;
SELECT '✅ Profiles table setup complete!' as status;
SELECT '✅ Admin user configured' as status
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE email = 'sucfunec01@gmail.com' AND is_admin = true);
