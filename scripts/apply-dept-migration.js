#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load .env to get SUPABASE_URL
const envPath = '.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key) env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
}

// Use service role key provided
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUxNzQwMSwiZXhwIjoyMDg5MDkzNDAxfQ.dPRxmxztKgGvOmiPz2T7blDQx6F7_OSOEs649jABYos';
const supabase = createClient(env.SUPABASE_URL, serviceRoleKey);

async function applyMigration() {
  const sql = `
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS subteam text;

CREATE INDEX IF NOT EXISTS idx_agents_department ON agents(department);
CREATE INDEX IF NOT EXISTS idx_agents_subteam ON agents(subteam);
`;

  console.log('Applying migration...');
  const { error } = await supabase.from('_sql').insert({ query: sql }).single();
  if (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
  console.log('✅ Migration applied successfully');
}

applyMigration().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
