const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: tasks, error: tError } = await supabase.from('tasks')
    .select('id, title')
    .ilike('title', 'Zarely:%');

  for (const task of tasks) {
    await supabase.from('tasks')
      .update({ status: 'in_progress' })
      .eq('id', task.id);
  }
  console.log('Updated tasks to in_progress');
}
run();
