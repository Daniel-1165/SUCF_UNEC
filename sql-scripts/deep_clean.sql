-- DEEP CLEAN SCRIPT
-- Run this to force-remove the stuck automation.

-- 1. Drop the local function and its dependencies (Calculated to remove the trigger too)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Check mistakenly created function in auth schema
DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;

-- 3. Explicitly drop the trigger just to be sure
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Check for any other triggers that might be causing issues (Optional but good)
-- Note: We can't easily auto-drop unknown triggers safely, but this cleans our known ones.

SELECT 'Deep clean completed. Try signing up now.' as status;
