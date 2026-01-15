-- =====================================================
-- FIX NEWS TABLE
-- Copy and paste this into Supabase SQL Editor
-- =====================================================

-- Enable RLS on news table
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public read access to news" ON news;
DROP POLICY IF EXISTS "Allow admin insert news" ON news;
DROP POLICY IF EXISTS "Allow admin delete news" ON news;

-- 1. Everyone can read news
CREATE POLICY "Allow public read access to news"
ON news FOR SELECT
TO public
USING (true);

-- 2. Only admins can insert news
CREATE POLICY "Allow admin insert news"
ON news FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Only admins can delete news
CREATE POLICY "Allow admin delete news"
ON news FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
