const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  // 1. Create the Zarely project
  const { data: project, error: pError } = await supabase.from('projects')
    .insert([{
      name: 'Zarely.co AI Automation',
      description: 'Automate Zarely.co Shopify operations, inventory management, customer support, and Dancers Blog marketing using AI agents.',
      status: 'in_progress',
      department: 'Cross-dept',
      total_tasks: 4,
      done_tasks: 0
    }])
    .select()
    .single();

  if (pError) {
    console.error('Error creating project:', pError);
    return;
  }

  console.log('Created Project:', project.id);

  // 2. Fetch the 4 tasks we just made
  const { data: tasks, error: tError } = await supabase.from('tasks')
    .select('id, title')
    .ilike('title', 'Zarely:%');

  if (tError) {
    console.error('Error fetching tasks:', tError);
    return;
  }

  console.log(`Found ${tasks.length} Zarely tasks.`);

  // 3. Update the tasks to belong to this project
  for (const task of tasks) {
    const { error: uError } = await supabase.from('tasks')
      .update({ project_id: project.id })
      .eq('id', task.id);
    if (uError) {
      console.error(`Failed to update task ${task.id}:`, uError);
    } else {
      console.log(`Updated task ${task.id} to project ${project.id}`);
    }
  }
}
run();
