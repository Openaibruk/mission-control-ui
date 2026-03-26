import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const GATEWAY_WS = process.env.GATEWAY_WS_URL || 'ws://localhost:3114/ws';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || process.env.OPENCLAW_GATEWAY_TOKEN || '';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
}

export async function POST() {
  try {
    // 1. Get all submitted feedback
    const { data: feedback, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!feedback || feedback.length === 0) {
      return NextResponse.json({ message: 'No new feedback', processed: 0 });
    }

    const results = [];

    for (const item of feedback as FeedbackItem[]) {
      try {
        // 2. Acknowledge the feedback
        await supabase.from('feedback').update({ status: 'acknowledged' }).eq('id', item.id);

        // 3. Research and categorize - determine action plan
        const analysis = analyzeFeedback(item);

        // 4. Create project if needed
        if (analysis.createProject) {
          const { data: project } = await supabase.from('projects').insert({
            name: analysis.projectName,
            description: analysis.projectDescription,
            status: 'active',
          }).select().single();

          if (project) {
            // 5. Create tasks for the project
            for (const task of analysis.tasks) {
              await supabase.from('tasks').insert({
                title: task.title,
                description: task.description,
                status: 'todo',
                priority: task.priority,
                project_id: project.id,
                agent_id: task.agentId || null,
              });
            }

            // 6. Link feedback to project
            await supabase.from('feedback')
              .update({ status: 'project_created', project_id: project.id })
              .eq('id', item.id);
          }
        } else {
          // Simple fix - just mark as in_progress
          await supabase.from('feedback').update({ status: 'in_progress' }).eq('id', item.id);
        }

        results.push({ id: item.id, title: item.title, action: analysis.action, project: analysis.projectName });
      } catch (err) {
        results.push({ id: item.id, title: item.title, error: 'Processing failed' });
      }
    }

    // 7. Log activity
    await supabase.from('activities').insert({
      agent_id: 'nova-autopilot',
      action: 'feedback-autopilot',
      details: `Processed ${results.length} feedback items: ${results.map(r => r.title).join(', ')}`,
    });

    return NextResponse.json({ processed: results.length, results });
  } catch (err) {
    return NextResponse.json({ error: 'Autopilot failed' }, { status: 500 });
  }
}

function analyzeFeedback(item: FeedbackItem) {
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();

  // Determine if this needs a project or just a fix
  const needsProject = item.priority === 'critical' || item.priority === 'high'
    || title.includes('system') || title.includes('feature') || title.includes('add')
    || desc.includes('implement') || desc.includes('build') || desc.includes('create');

  // Determine action type
  let action = 'fix';
  if (item.category === 'feature' || title.includes('add') || title.includes('new')) action = 'feature';
  if (item.category === 'improvement') action = 'improvement';
  if (title.includes('research') || title.includes('investigate') || title.includes('explore')) action = 'research';

  // Assign to appropriate department
  const agentAssignment = getAgentAssignment(action, item.category);

  return {
    action,
    createProject: needsProject,
    projectName: `[IPMR] ${item.title}`,
    projectDescription: `Auto-created from feedback: ${item.description}\n\nCategory: ${item.category} | Priority: ${item.priority} | Action: ${action}`,
    tasks: needsProject ? generateTasks(item, action, agentAssignment) : [],
  };
}

function getAgentAssignment(action: string, category: string): Record<string, string> {
  switch (action) {
    case 'feature':
    case 'improvement':
      return { dev: 'henok', qa: 'cinder', arch: 'kiro' };
    case 'fix':
      return { dev: 'henok', qa: 'cinder' };
    case 'research':
      return { researcher: 'nova', analyst: 'shuri' };
    default:
      return { dev: 'henok' };
  }
}

function generateTasks(item: FeedbackItem, action: string, agents: Record<string, string>) {
  const tasks = [];

  if (action === 'research') {
    tasks.push({
      title: `Research: ${item.title}`,
      description: `Investigate and analyze: ${item.description}`,
      priority: item.priority === 'critical' ? 1 : item.priority === 'high' ? 2 : 3,
      agentId: null, // Will be assigned by task matching
    });
    tasks.push({
      title: `Document findings: ${item.title}`,
      description: 'Write up research findings and recommendations',
      priority: 3,
      agentId: null,
    });
  } else {
    tasks.push({
      title: `Implement: ${item.title}`,
      description: `Implement solution for: ${item.description}\n\nSource: IPMR Feedback (${item.category}, ${item.priority})`,
      priority: item.priority === 'critical' ? 1 : item.priority === 'high' ? 2 : 3,
      agentId: null,
    });
    tasks.push({
      title: `Review & Test: ${item.title}`,
      description: 'Code review and QA testing for the implementation',
      priority: 3,
      agentId: null,
    });
  }

  return tasks;
}
