require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const command = process.argv[2];
const payloadStr = process.argv[3];
let payload = {};

if (payloadStr) {
  try {
    payload = JSON.parse(payloadStr);
  } catch (e) {
    console.error("Error: Payload must be valid JSON string.");
    process.exit(1);
  }
}

async function run() {
  let result;
  switch (command) {
    case 'agents:upsert':
      result = await supabase.from('agents').upsert(payload).select();
      break;
    case 'tasks:list':
      result = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      break;
    case 'tasks:create':
      result = await supabase.from('tasks').insert(payload).select();
      break;
    case 'tasks:update':
      result = await supabase.from('tasks').update(payload.updates).eq('id', payload.id).select();
      break;
    case 'messages:post':
      result = await supabase.from('messages').insert(payload).select();
      break;
    case 'messages:list':
      result = await supabase.from('messages').select('*').eq('task_id', payload.task_id).order('created_at', { ascending: true });
      break;
    case 'documents:create':
      result = await supabase.from('documents').insert(payload).select();
      break;
    case 'documents:list':
      result = await supabase.from('documents').select('*');
      break;
    case 'activities:log':
      result = await supabase.from('activities').insert(payload).select();
      break;
    case 'notifications:get':
      result = await supabase.from('notifications').select('*').eq('mentioned_agent', payload.agent_name).eq('delivered', false);
      break;
    case 'notifications:mark_read':
      result = await supabase.from('notifications').update({ delivered: true }).eq('id', payload.id).select();
      break;
    case 'tasks:checkout':
      result = await supabase.rpc('checkout_task', { task_id: payload.task_id, agent_name: payload.agent_name });
      break;
    case 'tasks:release':
      result = await supabase.rpc('release_checkout', { task_id: payload.task_id });
      break;
    case 'goals:list':
      result = await supabase.from('goals').select('*').order('created_at', { ascending: false });
      break;
    case 'goals:create':
      result = await supabase.from('goals').insert(payload).select();
      break;
    case 'goals:update':
      result = await supabase.from('goals').update(payload.updates).eq('id', payload.id).select();
      break;
    case 'org:list':
      result = await supabase.from('org_chart').select('*, agents(name, role, status)').order('level', { ascending: true });
      break;
    case 'org:upsert':
      result = await supabase.from('org_chart').upsert(payload).select();
      break;
    case 'approvals:list':
      result = await supabase.from('approval_gates').select('*').eq('status', 'pending').order('created_at', { ascending: false });
      break;
    case 'approvals:update':
      result = await supabase.from('approval_gates').update(payload.updates).eq('id', payload.id).select();
      break;
    case 'audit:list':
      result = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(payload.limit || 50);
      break;
    case 'budgets:update':
      result = await supabase.from('agents').update({ budget_monthly_usd: payload.budget }).eq('id', payload.id).select();
      break;
    default:
      console.error("Unknown command:", command);
      process.exit(1);
  }

  if (result.error) {
    console.error("Supabase Error:", JSON.stringify(result.error, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(result.data, null, 2));
}

run();