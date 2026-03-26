const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  // Check for pending feedback (status not 'done')
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .neq('status', 'done')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('NO_REPLY');
    process.exit(0);
  }

  console.log(JSON.stringify(data, null, 2));
}
run();
