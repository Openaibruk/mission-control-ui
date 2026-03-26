import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent, task } = body;

    if (!agent || !task) {
      return NextResponse.json({ error: 'Missing agent or task parameter' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create a task assigned to the agent with in_progress status
    const { data, error } = await supabase.from('tasks').insert([{
      title: task,
      description: `Manually triggered task for @${agent}`,
      status: 'in_progress',
      assignees: [`@${agent}`],
      priority: 'medium',
    }]).select().single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also log the activity
    await supabase.from('activities').insert([{
      agent_name: 'Bruk',
      action: `⚡ Triggered task for @${agent}: ${task}`,
    }]);

    return NextResponse.json({ success: true, task: data });
  } catch (err) {
    console.error('Agent trigger error:', err);
    return NextResponse.json({ error: 'Failed to trigger agent task' }, { status: 500 });
  }
}
