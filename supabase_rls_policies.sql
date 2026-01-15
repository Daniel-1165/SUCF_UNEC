-- =====================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Run these commands in your Supabase SQL Editor
-- =====================================================

-- 1. BOOKS TABLE POLICIES
-- Allow admins to insert, update, and delete books
-- Allow everyone to read books

-- First, enable RLS if not already enabled
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to books" ON books;
DROP POLICY IF EXISTS "Allow admin insert books" ON books;
DROP POLICY IF EXISTS "Allow admin update books" ON books;
DROP POLICY IF EXISTS "Allow admin delete books" ON books;

-- Create new policies
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

-- =====================================================
-- 2. GALLERY TABLE POLICIES (if needed)
-- =====================================================

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin insert gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin delete gallery" ON gallery;

CREATE POLICY "Allow public read access to gallery"
ON gallery FOR SELECT
TO public
USING (true);

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

-- =====================================================
-- 3. ARTICLES TABLE POLICIES (if needed)
-- =====================================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to articles" ON articles;
DROP POLICY IF EXISTS "Allow admin insert articles" ON articles;
DROP POLICY IF EXISTS "Allow admin update articles" ON articles;
DROP POLICY IF EXISTS "Allow admin delete articles" ON articles;

CREATE POLICY "Allow public read access to articles"
ON articles FOR SELECT
TO public
USING (true);

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

-- =====================================================
-- 4. NEWS TABLE POLICIES (if needed)
-- =====================================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to news" ON news;
DROP POLICY IF EXISTS "Allow admin insert news" ON news;
DROP POLICY IF EXISTS "Allow admin delete news" ON news;

CREATE POLICY "Allow public read access to news"
ON news FOR SELECT
TO public
USING (true);

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

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify your policies are set up correctly
-- =====================================================

-- Check all policies on books table
SELECT * FROM pg_policies WHERE tablename = 'books';

-- Check all policies on gallery table
SELECT * FROM pg_policies WHERE tablename = 'gallery';

-- Check all policies on articles table
SELECT * FROM pg_policies WHERE tablename = 'articles';

-- Check all policies on news table
SELECT * FROM pg_policies WHERE tablename = 'news';
