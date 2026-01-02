-- PROMOTE USER TO ADMIN
-- Replace 'YOUR_EMAIL_HERE' with your actual email address before running.

UPDATE public.profiles
SET is_admin = true
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'ebukadaniel065@gmail.com'
);

-- Run this check to verify
SELECT * FROM public.profiles WHERE is_admin = true;
