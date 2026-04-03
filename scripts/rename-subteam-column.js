#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key) env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
}

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUxNzQwMSwiZXhwIjoyMDg5MDkzNDAxfQ.dPRxmxztKgGvOmiPz2T7blDQx6F7_OSOEs649jABYos';
const supabase = createClient(env.SUPABASE_URL, serviceRoleKey);

async function renameColumn() {
  // Rename subteam → subTeam to match Agent interface
  const sql = `
ALTER TABLE agents
RENAME COLUMN subteam TO "subTeam";
`;

  console.log('Renaming column subteam → subTeam...');
  const { error } = await supabase.from('_sql').insert({ query: sql }).single();
  if (error) {
    console.error('Rename failed:', error.message);
    process.exit(1);
  }
  console.log('✅ Column renamed successfully');
}

renameColumn().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
