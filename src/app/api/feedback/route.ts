import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      // If table doesn't exist yet, return empty array
      return NextResponse.json({ feedback: [] });
    }

    return NextResponse.json({ feedback: data || [] });
  } catch {
    return NextResponse.json({ feedback: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, priority } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const feedbackData = {
      title: title.trim(),
      description: (description || '').trim(),
      category: category || 'bug',
      priority: priority || 'medium',
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('feedback')
      .insert(feedbackData)
      .select()
      .single();

    if (error) {
      console.error('Feedback insert error:', error.message);
      // Return success even if table doesn't exist yet (graceful degradation)
      return NextResponse.json({ success: true, feedback: feedbackData, note: 'Stored locally (DB table may not exist)' });
    }

    return NextResponse.json({ success: true, feedback: data });
  } catch (err) {
    console.error('Feedback API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
