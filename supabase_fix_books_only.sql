-- =====================================================
-- FIX BOOKS TABLE ONLY (Run this first)
-- Copy and paste this into Supabase SQL Editor
-- =====================================================

-- Enable RLS on books table
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to books" ON books;
DROP POLICY IF EXISTS "Allow admin insert books" ON books;
DROP POLICY IF EXISTS "Allow admin update books" ON books;
DROP POLICY IF EXISTS "Allow admin delete books" ON books;

-- 1. Everyone can read books
CREATE POLICY "Allow public read access to books"
ON books FOR SELECT
TO public
USING (true);

-- 2. Only admins can insert books
CREATE POLICY "Allow admin insert books"
ON books FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Only admins can update books
CREATE POLICY "Allow admin update books"
ON books FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 4. Only admins can delete books
CREATE POLICY "Allow admin delete books"
ON books FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
