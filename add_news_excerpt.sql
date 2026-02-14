-- Add excerpt column to news table
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'news';
