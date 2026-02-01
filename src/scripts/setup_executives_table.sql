-- Run these commands in your Supabase SQL Editor to set up the Executives table

-- 1. Create the executives table if it doesn't exist
CREATE TABLE IF NOT EXISTS executives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    dept TEXT,
    img_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Policy: Allow everyone to view executives
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    school TEXT,
    department TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clean up existing policies if you are rerunning this
DROP POLICY IF EXISTS "Allow public read-only access on executives" ON executives;
DROP POLICY IF EXISTS "Allow admins full access on executives" ON executives;

-- Policy: Allow everyone to view executives
CREATE POLICY "Allow public read-only access on executives" 
ON executives FOR SELECT 
TO public 
USING (true);

-- Policy: Allow authenticated admins to insert/update/delete
-- Uses the 'profiles' table with 'is_admin' column
CREATE POLICY "Allow admins full access on executives" 
ON executives FOR ALL 
TO authenticated 
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
)
WITH CHECK (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);

-- 4. Storage Bucket Setup Hint:
-- You need to create a storage bucket named "content-images" 
-- with "Public" access enabled in your Supabase dashboard.
