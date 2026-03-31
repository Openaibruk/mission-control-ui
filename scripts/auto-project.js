import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://vgrdeznxllkdolvrhlnm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI')

async function run() {
  const projectName = "Autonomous Workflow Audit 2026";
  const projectDesc = "A completely autonomous test project to validate dynamic project creation, task breakdown, and automated task execution.";
  
  console.log(`[1] Creating Project: ${projectName}`);
  const { data: pData, error: pErr } = await supabase.from('projects').insert([
    { name: projectName, description: projectDesc, status: 'active', department: 'Operations' }
  ]).select().single();
  
  if (pErr) return console.error("Project Creation Failed:", pErr);
  console.log(`Project Created with ID: ${pData.id}`);

  console.log(`[2] Autonomous Planner: Breaking down into tasks...`);
  const tasks = [
    {
      project_id: pData.id,
      title: 'Analyze existing DB schemas',
      description: 'Review the current Supabase projects and tasks tables to document exact column definitions for the team.',
      status: 'inbox',
      assignees: ['@Data-Agent'],
      priority: 'high'
    },
    {
      project_id: pData.id,
      title: 'Draft Autonomous Pipeline Proposal',
      description: 'Write a short markdown file summarizing how dynamic task generation will replace hardcoded scripts.',
      status: 'inbox',
      assignees: ['@System-Agent'],
      priority: 'medium'
    }
  ];

  const { data: tData, error: tErr } = await supabase.from('tasks').insert(tasks).select();
  if (tErr) return console.error("Task Creation Failed:", tErr);
  
  console.log(`[3] ${tData.length} Tasks Created and pushed to 'inbox'.`);
  console.log(`The task-worker-heartbeat cron job will naturally pick these up next cycle, or we can trigger them manually.`);
}
run()
