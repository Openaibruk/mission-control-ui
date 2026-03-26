#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
);

(async () => {
  const { data: projects } = await supabase.from('projects').select('*');
  console.log('Projects:', JSON.stringify(projects, null, 2));
  
  const { data: tasks } = await supabase.from('tasks').select('id,title,project_id').like('title', '%Ethiopian Kids%');
  console.log('Ethiopian Kids tasks:', JSON.stringify(tasks, null, 2));
})().catch(err => { console.error(err.message); process.exit(1); });
