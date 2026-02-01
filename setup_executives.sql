-- Create Executives Table
create table if not exists public.executives (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  role text not null,
  dept text,
  img_url text
);

-- Policy to allow read access to everyone
alter table public.executives enable row level security;
create policy "Enable read access for all users" on public.executives for select using (true);
create policy "Enable all access for admins" on public.executives for all using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.is_admin = true
  )
);

-- Insert Initial Data (Optional)
insert into public.executives (name, role, dept, img_url) values 
('Bro. Zuby Benjamin', 'President', 'Surveying', '/assets/execs/president.jpg'),
('Sis. Onyiyechi Ogbonna', 'Vice President', 'Medicine', '/assets/execs/ifunanya.jpg'),
('Sis. Fear God', 'General Secretary', 'Nursing Science', '/assets/execs/blessing.jpg'),
('Bro. Wisdom Ogbonna', 'Prayer Secretary', 'Architecture', '/assets/execs/emmanuel.jpg');

-- Ensure Profiles has is_admin if not exists (This usually exists but just in case)
-- This part assumes profiles table exists. If not, standard Supabase Auth includes it usually via triggers.
-- IF YOU NEED TO MAKE SOMEONE ADMIN MANUALLY:
-- update public.profiles set is_admin = true where id = 'USER_UUID_HERE';
