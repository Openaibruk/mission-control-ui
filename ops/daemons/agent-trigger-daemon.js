const { createClient } = require('@supabase/supabase-js');
const { exec } = require('child_process');
require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('⚡ Event-Driven Agent Trigger Daemon Started');
console.log('Listening to public.tasks and public.activities inserts...');

// Keep track of recent wakes to avoid spamming
let lastWake = 0;
const WAKE_COOLDOWN_MS = 5000;

function triggerWake(reason) {
  const now = Date.now();
  if (now - lastWake < WAKE_COOLDOWN_MS) {
    console.log(`=> Skipping wake for: ${reason} (on cooldown)`);
    return;
  }
  
  console.log(`=> Triggering wake for: ${reason}`);
  lastWake = now;
  exec(`openclaw cron run e2c80367-9b9b-4279-bad8-ccad3fcdc707`, (error) => {
    if (error) {
       console.error(`Exec error: ${error}`);
       return;
    }
    console.log(`=> Woke task-worker-heartbeat job instantly.`);
  });
}

const channel = supabase.channel('event-triggers')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'tasks' },
    (payload) => {
      const task = payload.new;
      console.log(`[Task Created] ${task.title} (Status: ${task.status})`);
      
      if (task.assignees && task.assignees.length > 0) {
        triggerWake(`Task assigned to ${task.assignees.join(', ')}`);
      }
    }
  )
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'activities' },
    (payload) => {
      const activity = payload.new;
      if (activity.action && activity.action.includes('[PING]')) {
         console.log(`[Agent Pinged] ${activity.action}`);
         triggerWake(`Manual UI Ping`);
      }
    }
  )
  .subscribe();

// Keep alive
setInterval(() => {}, 1000 * 60 * 60);
