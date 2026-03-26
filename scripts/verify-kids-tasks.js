#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
);

(async () => {
  try {
    const { data } = await supabase.from('tasks').select('id,title,status,assignees,project_id').eq('project_id', '1ba5d962-fcb5-4157-8cbd-3b278a063509');
    console.log(`Ethiopian Kids tasks (${data.length}):`);
    data.forEach(t => console.log(`- [${t.status}] ${t.title} (assignees: ${JSON.stringify(t.assignees)})`));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
