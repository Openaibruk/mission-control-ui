#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
);

(async () => {
  // Try without assignee
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(5);
  if (error) throw error;
  console.log('Sample task:', JSON.stringify(data[0], null, 2));
  console.log('\nCount:', data.length);
})().catch(err => { console.error('Error:', err.message); process.exit(1); });
