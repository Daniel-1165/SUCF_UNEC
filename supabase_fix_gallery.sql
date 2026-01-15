-- =====================================================
-- FIX GALLERY TABLE
-- Copy and paste this into Supabase SQL Editor
-- =====================================================

-- Enable RLS on gallery table
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin insert gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin delete gallery" ON gallery;

-- 1. Everyone can read gallery
CREATE POLICY "Allow public read access to gallery"
ON gallery FOR SELECT
TO public
USING (true);

-- 2. Only admins can insert gallery images
CREATE POLICY "Allow admin insert gallery"
ON gallery FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Only admins can delete gallery images
CREATE POLICY "Allow admin delete gallery"
ON gallery FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
