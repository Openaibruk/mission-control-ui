const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  // Map titles to file paths
  const map = {
    'Configure GWS Morning Standup Script': '/home/ubuntu/.openclaw/workspace/morning-standup-test.md',
    'Architect HR Recruiter Agent': '/home/ubuntu/.openclaw/workspace/hr-recruiter-agent-design.md',
    'Generate 7-Day Content Calendar & Upload to Drive': '/home/ubuntu/.openclaw/workspace/ChipChip_Weekly_Content.csv'
  };

  for (const [title, path] of Object.entries(map)) {
    console.log(`Updating task: ${title}`);
    await supabase.from('tasks')
      .update({ status: 'done', output_url: path })
      .eq('title', title);
  }
  
  console.log('All done!');
}
run();
