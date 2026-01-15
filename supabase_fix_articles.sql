-- =====================================================
-- FIX ARTICLES TABLE
-- Copy and paste this into Supabase SQL Editor
-- =====================================================

-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public read access to articles" ON articles;
DROP POLICY IF EXISTS "Allow admin insert articles" ON articles;
DROP POLICY IF EXISTS "Allow admin update articles" ON articles;
DROP POLICY IF EXISTS "Allow admin delete articles" ON articles;

-- 1. Everyone can read articles
CREATE POLICY "Allow public read access to articles"
ON articles FOR SELECT
TO public
USING (true);

-- 2. Only admins can insert articles
CREATE POLICY "Allow admin insert articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Only admins can update articles
CREATE POLICY "Allow admin update articles"
ON articles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 4. Only admins can delete articles
CREATE POLICY "Allow admin delete articles"
ON articles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
