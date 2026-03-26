const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: project } = await supabase.from('projects').select('id').eq('name', 'ChipChip Delivery Fee Rollout').single();
  if (project) {
    await supabase.from('tasks').update({ status: 'done' }).eq('project_id', project.id);
    await supabase.from('projects').update({ status: 'complete', done_tasks: 3, total_tasks: 3 }).eq('id', project.id);
    console.log('Marked delivery tasks and project as done.');
  }
}
run();
