-- Driver onboarding migration (from original project)
CREATE TABLE IF NOT EXISTS driver_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'interview', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON driver_applications FOR ALL USING (true) WITH CHECK (true);
