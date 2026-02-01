-- Run these commands in your Supabase SQL Editor to update the table structure

-- 1. Add bible_reference column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fellowship_events' AND column_name = 'bible_reference') THEN
        ALTER TABLE fellowship_events ADD COLUMN bible_reference TEXT;
    END IF;
END $$;

-- 2. Add description column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fellowship_events' AND column_name = 'description') THEN
        ALTER TABLE fellowship_events ADD COLUMN description TEXT;
    END IF;
END $$;

-- 3. (Optional) Check current columns (for verification)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'fellowship_events';
