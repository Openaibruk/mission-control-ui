const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: project } = await supabase.from('projects').select('id').eq('name', 'ChipChip Delivery Fee Rollout').single();
  
  if (project) {
    await supabase.from('tasks').insert([
      { title: 'Draft Telegram/SMS Copy for 3 Birr Fee', description: 'Write the customer-facing rollout copy highlighting Free Super Leader Pickup.', status: 'in_progress', assignees: ['@Bini'], project_id: project.id },
      { title: 'Define Customer Segments for Delivery Fee', description: 'Map out the distribution strategy for how to roll this out without causing churn.', status: 'in_progress', assignees: ['@Nahom'], project_id: project.id }
    ]);
    
    await supabase.from('tasks').update({ status: 'done' }).eq('title', 'Approve Strategic Mission Board (A/B/C)');
    console.log('Tasks assigned for Option B.');
  }
}
run();
