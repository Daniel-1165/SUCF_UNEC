-- MANUAL DATABASE HEALTH CHECK
-- Run this in Supabase SQL Editor.

-- 1. Check if we can read the users table
SELECT count(*) as total_users FROM auth.users;

-- 2. Try to insert a raw user directly (bypassing the API)
-- This will tell us if the Database is broken, or just the API.
DO $$
DECLARE
  new_id uuid := gen_random_uuid();
  random_email text := 'test_' || floor(random() * 1000)::text || '@example.com';
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_id,
    'authenticated',
    'authenticated',
    random_email, 
    '$2a$10$abcdefg....', -- Fake password
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );
  
  RAISE NOTICE 'Manual User Insert SUCCEEDED! ID: %', new_id;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Manual Insert FAILED: %', SQLERRM;
END;
$$;
