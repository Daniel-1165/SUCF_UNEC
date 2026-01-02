-- CLEAN SLATE PROTOCOL
-- This script removes the Profiles table entirely.
-- It also hunts for ANY trigger that might be linked to the "handle_new_user" function.

-- 1. Drop the Table (Removes the target of any automation)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Drop the Function (Cascades to triggers usually, but we force it)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. Dynamic Trigger Hunt (Finds any specific triggers left behind)
DO $$
DECLARE
    trg_name text;
BEGIN
    -- Loop through all triggers on auth.users causing issues
    FOR trg_name IN 
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = 'auth.users'::regclass 
        AND tgname NOT LIKE 'RI_%' -- Don't touch system foreign keys
        AND tgisinternal = false   -- Don't touch internal postgres stuff
    LOOP
        EXECUTE 'DROP TRIGGER ' || quote_ident(trg_name) || ' ON auth.users';
        RAISE NOTICE 'Dropped suspicious trigger: %', trg_name;
    END LOOP;
END$$;

SELECT 'Clean Slate Applied. No Profiles Table. No Custom Triggers.' as status;
