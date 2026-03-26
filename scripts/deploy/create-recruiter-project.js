const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: project, error } = await supabase.from('projects')
    .insert([{
      name: 'HR Recruiter Agent Builder',
      description: 'Repurpose the Job Finder agent architecture into an automated HR Recruiter Agent for hiring talent.',
      status: 'in_progress',
      department: 'Cross-dept',
      total_tasks: 0,
      done_tasks: 0
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
  } else {
    console.log('Successfully created project:', project.name, 'with ID:', project.id);
  }
}
run();
