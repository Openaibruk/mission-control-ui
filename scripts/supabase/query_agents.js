require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/mission-control-ui/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('agents').select('*');
  console.log(JSON.stringify(data, null, 2));
}
run();
