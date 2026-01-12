-- Create News table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'Latest',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public News Read" ON public.news
    FOR SELECT USING (true);

-- Allow authenticated admin users to insert/update/delete
-- Assuming we have an isAdmin check in metadata or a separate profile table
-- For now, allowing all authenticated users to manage news (can be refined later)
CREATE POLICY "Admin News Manage" ON public.news
    FOR ALL USING (auth.role() = 'authenticated');
