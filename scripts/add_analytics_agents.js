require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/mission-control-ui/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const agents = [
    { name: 'Orion', role: 'Head of Analytics & Data Science', status: 'active' },
    { name: 'Lyra', role: 'Data Engineer & Visualization', status: 'active' }
  ];
  const { data, error } = await supabase.from('agents').insert(agents).select();
  if (error) console.error(error);
  else console.log('Added:', data);
}
run();
