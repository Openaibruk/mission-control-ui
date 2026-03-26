const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  const { data: project } = await supabase.from('projects').select('id').eq('name', 'HR Recruiter Agent Builder').single();
  if (project) {
    await supabase.from('tasks').update({ status: 'done', output_url: '/home/ubuntu/.openclaw/workspace/hr-recruiter-agent-design.md' }).eq('title', 'Architect HR Recruiter Agent');
    console.log('Fixed HR tasks.');
  }

  const { data: gwsProject } = await supabase.from('projects').select('id').eq('name', 'Personal Morning Standup (GWS)').single();
  if (gwsProject) {
    await supabase.from('tasks').update({ status: 'done', output_url: '/home/ubuntu/.openclaw/workspace/morning-standup-test.md' }).eq('title', 'Configure GWS Morning Standup Script');
    console.log('Fixed GWS tasks.');
  }

  const { data: smProject } = await supabase.from('projects').select('id').ilike('name', '%Postiz%').single();
  if (smProject) {
    await supabase.from('tasks').update({ status: 'done', output_url: '/home/ubuntu/.openclaw/workspace/ChipChip_Weekly_Content.csv' }).eq('title', 'Generate 7-Day Content Calendar & Upload to Drive');
    console.log('Fixed SM tasks.');
  }
}
run();
