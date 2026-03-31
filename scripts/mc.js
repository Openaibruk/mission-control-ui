#!/usr/bin/env node

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const [command, payloadJson] = process.argv.slice(2);
  if (!command) {
    console.error('Usage: node mc.js <command> [<json-payload>]');
    process.exit(1);
  }

  let result;
  let error;

  try {
    switch (command) {
      case 'tasks:list': {
        const { data, err } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        result = data;
        error = err;
        break;
      }
      case 'tasks:update': {
        if (!payloadJson) {
          console.error('tasks:update requires a JSON payload with id and updates');
          process.exit(1);
        }
        const { id, updates } = JSON.parse(payloadJson);
        const { data, err } = await supabase.from('tasks').update(updates).eq('id', id).select();
        result = data;
        error = err;
        break;
      }
      case 'messages:post': {
        if (!payloadJson) {
          console.error('messages:post requires a JSON payload with task_id, agent, content');
          process.exit(1);
        }
        const payload = JSON.parse(payloadJson);
        const { data, err } = await supabase.from('messages').insert([payload]).select();
        result = data;
        error = err;
        break;
      }
      case 'activities:log': {
        if (!payloadJson) {
          console.error('activities:log requires a JSON payload with agent, action, details');
          process.exit(1);
        }
        const payload = JSON.parse(payloadJson);
        const { data, err } = await supabase.from('activities').insert([payload]).select();
        result = data;
        error = err;
        break;
      }
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (e) {
    console.error('Command error:', e.message);
    process.exit(1);
  }

  if (error) {
    console.error('Supabase error:', error);
    process.exit(1);
  }

  // Output result as JSON. For lists, output each item on its own line to aid grepping.
  if (Array.isArray(result)) {
    result.forEach(item => console.log(JSON.stringify(item)));
  } else {
    console.log(JSON.stringify(result));
  }
}

main();
