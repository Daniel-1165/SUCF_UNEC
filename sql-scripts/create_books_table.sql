-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    author TEXT,
    description TEXT,
    file_url TEXT NOT NULL,
    semester TEXT
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Allow public to read books
CREATE POLICY "Public can view books" ON public.books
    FOR SELECT USING (true);

-- Allow authenticated admins to manage books
-- Note: Adjust the 'admin' check based on your existing user metadata/role structure.
-- Based on AdminPanel.jsx, it seems admins are checked via user.isAdmin in frontend, 
-- but for DB safety we can use a basic policy if role-based auth is configured.
CREATE POLICY "Admins can manage books" ON public.books
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.is_admin = true
      )
    );

-- STORAGE BUCKET POLICIES (Run these after creating 'books' bucket in Supabase UI)
-- Note: Replace 'books' with your bucket name if different.

/*
-- Policy for public read access to books bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'books' );

-- Policy for admin upload access to books bucket
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'books' AND
    (auth.jwt() ->> 'email' IN (SELECT email FROM public.profiles WHERE is_admin = true))
);
*/
