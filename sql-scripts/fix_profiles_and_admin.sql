-- 1. Add email column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Backfill email from auth.users
UPDATE public.profiles
SET email = users.email
FROM auth.users AS users
WHERE profiles.id = users.id
AND profiles.email IS NULL;

-- 3. Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, school, department, level)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'school',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'level'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fix the books table policies to use auth.uid()
-- Drop old policies if they exist (to ensure fresh start)
DROP POLICY IF EXISTS "Admins can manage books" ON public.books;

CREATE POLICY "Admins can manage books" ON public.books
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.is_admin = true
      )
    );

-- 5. Add a debug policy for profiles if needed (optional but helpful)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY; -- already enabled

SELECT 'Profiles and Books policy fixed successfully' as status;
