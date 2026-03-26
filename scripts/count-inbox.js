#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
);

(async () => {
  const { count } = await supabase.from('tasks').select('*', { count: 'exact' }).eq('status', 'inbox');
  console.log('Total inbox tasks:', count);
  
  const { data } = await supabase.from('tasks').select('id,title,status,project_id').eq('status', 'inbox').order('created_at', { ascending: false }).limit(10);
  data.forEach(t => console.log(`- ${t.title} (project: ${t.project_id || 'null'})`));
})(catch(err => { console.error(err.message); process.exit(1); });
