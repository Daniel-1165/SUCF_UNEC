-- Add excerpt column to articles table
-- This allows admins to add custom short summaries for articles

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS excerpt text;

-- Update existing articles to have an excerpt (optional - can be left NULL)
-- This will take the first 150 characters of content as excerpt for existing articles
UPDATE public.articles 
SET excerpt = SUBSTRING(content FROM 1 FOR 150) || '...'
WHERE excerpt IS NULL AND content IS NOT NULL;
