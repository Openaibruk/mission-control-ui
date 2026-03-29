const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function check() {
  const { data: projects, error: pErr } = await supabase.from('projects').select('*');
  if (pErr) console.error('Project Error:', pErr);
  const newProjects = projects ? projects.filter(p => !p.total_tasks || p.total_tasks === 0) : [];
  console.log('NEW PROJECTS:', JSON.stringify(newProjects, null, 2));

  const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
  const { data: tasks, error: tErr } = await supabase.from('tasks').select('*').in('status', ['inbox', 'in_progress']);
  if (tErr) console.error('Task Error:', tErr);
  
  // Try to use updated_at, fallback to created_at
  const stalledTasks = tasks ? tasks.filter(t => {
      const time = t.updated_at || t.created_at;
      return time && time < fiveMinAgo;
  }) : [];
  console.log('STALLED TASKS:', JSON.stringify(stalledTasks, null, 2));
}
check();
