const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { execSync } = require('child_process');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function getDiskPercent() {
  try {
    const out = execSync('df --output=pcent / | tail -1', { encoding: 'utf-8' });
    return parseInt(out.replace('%', '').trim(), 10);
  } catch (e) {
    console.error('Failed to get disk usage:', e.message);
    return null;
  }
}

async function logActivity(message, level = 'info') {
  try {
    await supabase.from('activities').insert({
      agent_name: 'Nova',
      action: 'disk-monitor',
      details: { message, level },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

async function createUrgentTask() {
  try {
    await supabase.from('tasks').insert({
      title: '🚨 Disk space critically high',
      description: `Disk usage is above 90%. Immediate cleanup required.`,
      priority: 'critical',
      status: 'inbox',
      assignee: 'Nova',
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Failed to create urgent task:', err.message);
  }
}

async function run() {
  const pct = getDiskPercent();
  if (pct === null) return;
  console.log(`Disk usage: ${pct}%`);
  if (pct > 80) {
    await logActivity(`Disk usage is at ${pct}% — consider cleanup`, 'warning');
    console.log('⚠️ Warning logged to Supabase activities');
  }
  if (pct > 90) {
    await createUrgentTask();
    await logActivity(`Critical disk usage ${pct}% — urgent task created`, 'error');
    console.log('🚨 Urgent task created');
  }
}

run().catch(console.error);
