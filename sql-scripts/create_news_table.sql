-- Create News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public news are viewable by everyone" 
ON public.news FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert news" 
ON public.news FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update news" 
ON public.news FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete news" 
ON public.news FOR DELETE 
USING (public.is_admin());
