import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function run() {
  console.log('Fetching tasks...');
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .ilike('title', '%Phase 1: Overview & Aesthetics (UI Redesign)%');
    
  if (error) {
    console.error('Error fetching tasks:', error);
    process.exit(1);
  }
  
  if (!tasks || tasks.length === 0) {
    console.error('Task not found.');
    process.exit(1);
  }
  
  const task = tasks[0];
  console.log('Found task:', task.title);
  
  const { error: updateError } = await supabase
    .from('tasks')
    .update({ status: 'done' })
    .eq('id', task.id);
    
  if (updateError) {
    console.error('Error updating task:', updateError);
    process.exit(1);
  }
  
  console.log('Task successfully updated to done.');
}

run();