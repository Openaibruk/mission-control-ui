const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const tasks = [
    { title: 'Generate 7-Day Content Calendar & Upload to Drive', description: 'Create CSV for Postiz based on ChipChip brand guidelines.', status: 'in_progress', assignees: ['@Bini'] },
    { title: 'Architect HR Recruiter Agent', description: 'Repurpose the job-finder codebase into an automated talent sourcing bot.', status: 'in_progress', assignees: ['@Henok'] },
    { title: 'Configure GWS Morning Standup Script', description: 'Test and configure the gws-workflow-standup-report skill for the daily 8:30 AM cron.', status: 'in_progress', assignees: ['@Kiro'] }
  ];

  for (const t of tasks) {
    const { error } = await supabase.from('tasks').insert([t]);
    if (error) console.error('Error:', error);
    else console.log('Created task:', t.title);
  }
}
run();
