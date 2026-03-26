import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
);

(async () => {
  try {
    const { data: existing } = await supabase.from('projects').select('id').eq('name', 'Autoscientist Research Agent').maybeSingle();
    if (existing) {
      console.log('Autoscientist project already exists:', existing.id);
      process.exit(0);
    }

    const { data: project, error } = await supabase.from('projects').insert({
      name: 'Autoscientist Research Agent',
      description: 'Automated research using karpathy/autoresearch. Generates deep-dive reports on demand.',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).select().single();

    if (error) throw error;
    console.log('Created project:', project.id);

    // Example tasks to get started
    const tasks = [
      { title: 'Install autoresearch dependencies', description: 'pip install git+https://github.com/karpathy/autoresearch.git', priority: 'high', status: 'inbox', assignees: ['@Henok'] },
      { title: 'Run first research: AI trends 2025', description: 'python scripts/run_research.py "AI trends 2025"', priority: 'medium', status: 'inbox', assignees: ['@Nova'] },
      { title: 'Set up automated weekly research cron', description: 'Schedule weekly research on workspace optimization', priority: 'low', status: 'inbox', assignees: ['@Nova'] }
    ];

    for (const t of tasks) {
      await supabase.from('tasks').insert({ ...t, project_id: project.id });
    }
    console.log('Tasks created for project', project.id);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
