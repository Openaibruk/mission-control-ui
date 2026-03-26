const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: project } = await supabase.from('projects')
    .select('id').eq('name', 'Zarely.co AI Automation').single();

  if (!project) return console.log('No Zarely project found');

  const { count } = await supabase.from('tasks')
    .select('*', { count: 'exact', head: true }).eq('project_id', project.id);
  const { count: done } = await supabase.from('tasks')
    .select('*', { count: 'exact', head: true }).eq('project_id', project.id).eq('status', 'done');

  await supabase.from('projects').update({
    total_tasks: count,
    done_tasks: done || 0,
    status: done === count ? 'complete' : 'in_progress'
  }).eq('id', project.id);

  console.log('Zarely project updated:', count, done);
}
run().catch(console.error);
