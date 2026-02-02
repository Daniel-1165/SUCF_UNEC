-- RUN THIS IN SUPABASE SQL EDITOR TO FIX FULL NAME AND USER SEARCH ISSUES

-- 1. Ensure the profiles table is correctly structured
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

-- 2. Add email if it's missing (for older tables)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
  END IF;
END $$;

-- 3. Create or Update the trigger function to capture ALL metadata including full_name
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
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    school = COALESCE(EXCLUDED.school, public.profiles.school),
    department = COALESCE(EXCLUDED.department, public.profiles.department),
    level = COALESCE(EXCLUDED.level, public.profiles.level);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Rebind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. BACKFILL: Sync existing users who might have profile entries but missing full names
UPDATE public.profiles p
SET 
  full_name = u.raw_user_meta_data->>'full_name',
  email = u.email,
  school = u.raw_user_meta_data->>'school',
  department = u.raw_user_meta_data->>'department',
  level = u.raw_user_meta_data->>'level'
FROM auth.users u
WHERE p.id = u.id
AND (p.full_name IS NULL OR p.email IS NULL);

-- 6. Insert missing profiles for existing users
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

-- 7. Fix RLS policies for common administrative tasks
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

SELECT 'Database fix applied successfully. Full names backfilled.' as status;
