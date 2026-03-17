import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { taskId, action } = await request.json();

    if (!taskId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'taskId and action (approve|reject) required' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'in_progress' : 'rejected';

    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus, checkout_by: null, checkout_at: null, checkout_expires_at: null })
      .eq('id', taskId)
      .eq('status', 'approval_needed')
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Task not found or not pending approval' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task: data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
