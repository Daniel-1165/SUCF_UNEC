-- ==========================================
-- FINAL FIX FOR FELLOWSHIP EVENTS AND STORAGE
-- ==========================================

-- 1. Ensure the fellowship_events table structure is correct
CREATE TABLE IF NOT EXISTS public.fellowship_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_time TEXT NOT NULL,
    location TEXT,
    description TEXT,
    bible_reference TEXT,
    flyer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Ensure all columns exist (idempotent alterations)
DO $$
BEGIN
    BEGIN
        ALTER TABLE fellowship_events ADD COLUMN description TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE fellowship_events ADD COLUMN bible_reference TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
    
    BEGIN
        ALTER TABLE fellowship_events ADD COLUMN flyer_url TEXT;
    EXCEPTION WHEN duplicate_column THEN END;
END $$;

-- 2. ENABLE RLS
ALTER TABLE public.fellowship_events ENABLE ROW LEVEL SECURITY;

-- 3. RESET POLICIES (Drop existing to avoid conflicts)
DROP POLICY IF EXISTS "Public Read Access" ON public.fellowship_events;
DROP POLICY IF EXISTS "Admin Insert" ON public.fellowship_events;
DROP POLICY IF EXISTS "Admin Update" ON public.fellowship_events;
DROP POLICY IF EXISTS "Admin Delete" ON public.fellowship_events;
DROP POLICY IF EXISTS "Allow public read access to fellowship events" ON public.fellowship_events;
DROP POLICY IF EXISTS "Allow admin insert fellowship events" ON public.fellowship_events;
DROP POLICY IF EXISTS "Allow admin delete fellowship events" ON public.fellowship_events;

-- 4. CREATE CLEAN POLICIES
-- Policy: Everyone can see events
CREATE POLICY "Public Read Events" 
ON public.fellowship_events FOR SELECT 
TO public 
USING (true);

-- Policy: Admins can do everything
CREATE POLICY "Admin Full Access"
ON public.fellowship_events FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 5. STORAGE BUCKET CONFIGURATION (CRITICAL FOR IMAGES)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. STORAGE POLICIES
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to content-images" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;

-- Explicitly drop the new policies we are about to create to avoid 42710 errors
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Modify Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Images" ON storage.objects;

-- Policy: Public can view images
CREATE POLICY "Public View Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-images');

-- Policy: Authenticated users (Admins) can upload
CREATE POLICY "Auth Upload Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images');

-- Policy: Admins can update/delete
CREATE POLICY "Admin Modify Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images');

CREATE POLICY "Admin Delete Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images');

-- 7. NOTIFICATION
SELECT 'Fellowship events table and Storage buckets configured successfully.' as result;
