-- Add image_url to books table
ALTER TABLE IF EXISTS public.books 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update RLS if necessary (usually not needed for just adding a column if policies are broad)
-- But ensuring public can see it
-- The existing policy "Public can view books" likely uses SELECT * so it should be fine.
