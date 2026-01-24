-- =====================================================
-- FELLOWSHIP EVENTS TABLE
-- Stores admin-managed fellowship event flyers
-- =====================================================

-- Create the table
CREATE TABLE fellowship_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT,
  flyer_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for faster queries (get next upcoming event)
CREATE INDEX idx_fellowship_events_date ON fellowship_events(event_date DESC);

-- Enable Row Level Security
ALTER TABLE fellowship_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to fellowship events" ON fellowship_events;
DROP POLICY IF EXISTS "Allow admin insert fellowship events" ON fellowship_events;
DROP POLICY IF EXISTS "Allow admin delete fellowship events" ON fellowship_events;

-- 1. Everyone can read events (public access)
CREATE POLICY "Allow public read access to fellowship events"
ON fellowship_events FOR SELECT
TO public
USING (true);

-- 2. Only admins can insert events
CREATE POLICY "Allow admin insert fellowship events"
ON fellowship_events FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Only admins can delete events
CREATE POLICY "Allow admin delete fellowship events"
ON fellowship_events FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Verification query
SELECT * FROM fellowship_events ORDER BY event_date DESC;
