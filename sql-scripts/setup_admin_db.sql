-- ADMIN & CONTENT SYSTEM SETUP
-- Run this script to build the backend for your Admin Dashboard.

-- ==========================================
-- 1. PROFILE UPDATES (Admin Role)
-- ==========================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- ==========================================
-- 2. GALLERY TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url text NOT NULL,
    caption text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can see images
CREATE POLICY "Public Read Gallery" 
ON public.gallery FOR SELECT 
USING (true);

-- Policy: Only Admins can Add/Edit/Delete
CREATE POLICY "Admin Manage Gallery" 
ON public.gallery FOR ALL 
USING (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() 
    and profiles.is_admin = true
  )
);

-- ==========================================
-- 3. ARTICLES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL, -- Rich text / HTML
    image_url text,
    author_name text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read articles
CREATE POLICY "Public Read Articles" 
ON public.articles FOR SELECT 
USING (true);

-- Policy: Only Admins can Add/Edit/Delete
CREATE POLICY "Admin Manage Articles" 
ON public.articles FOR ALL 
USING (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() 
    and profiles.is_admin = true
  )
);

-- ==========================================
-- 4. STORAGE SETUP (Attempt to create via SQL)
-- ==========================================
-- Note: If this block fails, you can create the bucket manually in the dashboard.

-- Create the bucket 'content-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can view images
CREATE POLICY "Public View Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'content-images' );

-- Policy: Admins can upload/delete images
CREATE POLICY "Admin Manage Images"
ON storage.objects FOR ALL
USING (
    bucket_id = 'content-images' 
    AND (select is_admin from public.profiles where id = auth.uid()) = true
);

SELECT 'Admin System, Tables, and Storage setup complete.' as status;
