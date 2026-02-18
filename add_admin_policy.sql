-- =====================================================
-- ADD ADMIN UPDATE POLICY TO PROFILES TABLE
-- Run this in your Supabase SQL Editor
-- This avoids infinite recursion by using a SECURITY DEFINER function
-- =====================================================

-- 1. Create a function to check if the current user is an admin
-- SECURITY DEFINER runs with the privileges of the creator (postgres/service_role)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add the update policy for admins
-- This allows anyone who IS an admin to update ANY profile (including promoting others)
DROP POLICY IF EXISTS "admins_update_profiles_policy" ON public.profiles;

CREATE POLICY "admins_update_profiles_policy"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.check_is_admin())
WITH CHECK (public.check_is_admin());

-- 3. Verify policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
