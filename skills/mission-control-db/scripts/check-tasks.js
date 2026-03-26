require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/mission-control-ui/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .in('status', ['inbox', 'in_progress'])
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tasks:', error.message);
    return;
  }
  
  if (data.length === 0) {
    console.log('No pending tasks found.');
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkTasks();
