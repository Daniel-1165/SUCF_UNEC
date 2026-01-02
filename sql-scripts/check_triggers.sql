-- DIAGNOSTIC SCRIPT
-- Run this to SEE what triggers are actually running on your auth.users table.

SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    event_manipulation as event,
    action_timing as activation,
    action_statement as definition
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';

-- Also check for standard postgres triggers
SELECT tgname 
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass;
