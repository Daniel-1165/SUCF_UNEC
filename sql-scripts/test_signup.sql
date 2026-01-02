-- TEST SIGNUP SCRIPT
-- RUN THIS to find the REAL Error.
-- We will try to create a user manually in the database.
-- If this fails, the "Result" window will show the EXACT reason (not just "500 Error").

BEGIN; -- Start transaction

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
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test_user_verify@example.com', -- TEST EMAIL
  '$2a$10$w....', -- Fake password hash
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

ROLLBACK; -- Undo it so we don't actually keep this fake user
