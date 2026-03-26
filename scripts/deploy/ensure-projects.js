const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  // 1. Create Morning Standup Project
  const { data: p1, error: e1 } = await supabase.from('projects').insert([{
    name: 'Personal Morning Standup (GWS)',
    description: 'Automated daily morning briefings using Google Workspace integrations to summarize calendar events and unread emails.',
    status: 'in_progress',
    department: 'Cross-dept',
    total_tasks: 0,
    done_tasks: 0
  }]).select().single();
  if (e1) console.error('Error creating Standup project:', e1);
  else console.log('Created Project:', p1.name);

  // 2. Unpause Postiz Social Media Automation
  const { data: p2, error: e2 } = await supabase.from('projects')
    .update({ status: 'in_progress' })
    .ilike('name', '%Postiz%')
    .select();
  if (e2) console.error('Error updating Postiz project:', e2);
  else console.log('Unpaused and updated Postiz project to in_progress.');
}
run();
