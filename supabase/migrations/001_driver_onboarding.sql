-- Migration: Create driver_onboarding table
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE IF NOT EXISTS driver_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  current_stage TEXT NOT NULL DEFAULT 'registration',
  stage_history JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE driver_onboarding ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (same pattern as existing tables)
CREATE POLICY "Allow all for anon" ON driver_onboarding
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_driver_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER driver_onboarding_updated_at
  BEFORE UPDATE ON driver_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_onboarding_updated_at();

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
