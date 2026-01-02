-- Run this in your Supabase SQL Editor to enable categorization

-- 1. Add category to Gallery
ALTER TABLE public.gallery ADD COLUMN category text;

-- 2. Add category to Articles (if not already present)
ALTER TABLE public.articles ADD COLUMN category text;

-- 3. Set default categories for existing records
UPDATE public.gallery SET category = 'Events' WHERE category IS NULL;
UPDATE public.articles SET category = 'Spiritual Growth' WHERE category IS NULL;
