import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Log user message
    await supabase.from('activities').insert({ agent_name: 'Bruk', action: message })

    // Parse intent and generate response
    const response = await handleMessage(message)

    // Log Nova response
    await supabase.from('activities').insert({ agent_name: 'Nova', action: `Nova received: "${message}". ${response}` })

    // Stream response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const words = response.split(' ')
        let buffer = ''
        let i = 0
        const interval = setInterval(() => {
          if (i < words.length) {
            buffer += (i > 0 ? ' ' : '') + words[i]
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: buffer })}\n\n`))
            i++
          } else {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
            controller.close()
            clearInterval(interval)
          }
        }, 30)
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleMessage(msg: string): Promise<string> {
  const lower = msg.toLowerCase().trim()

  // Create task
  if (lower.startsWith('create task') || lower.startsWith('add task') || lower.startsWith('new task')) {
    const title = msg.replace(/^(create|add|new)\s+task\s*/i, '').trim()
    if (title) {
      await supabase.from('tasks').insert([{ title, description: '', status: 'inbox', assignees: [] }])
      return `✅ Task created: "${title}" — added to inbox.`
    }
    return 'What should the task be called? Try: "create task Fix the login page"'
  }

  // Create project
  if (lower.startsWith('create project') || lower.startsWith('new project')) {
    const name = msg.replace(/^(create|new)\s+project\s*/i, '').trim()
    if (name) {
      await supabase.from('projects').insert([{ name, description: '', status: 'active', department: 'General', total_tasks: 0, done_tasks: 0 }])
      return `✅ Project created: "${name}" — now active on the dashboard.`
    }
    return 'What should the project be called? Try: "create project Website Redesign"'
  }

  // Status / stats
  if (lower.includes('status') || lower.includes('stats') || lower.includes('overview')) {
    const { data: tasks } = await supabase.from('tasks').select('status')
    if (tasks) {
      const total = tasks.filter(t => t.status !== 'rejected').length
      const done = tasks.filter(t => t.status === 'done').length
      const active = tasks.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status)).length
      const inbox = tasks.filter(t => t.status === 'inbox').length
      const rate = total > 0 ? Math.round((done / total) * 100) : 0
      return `📊 Dashboard Status: ${total} total tasks | ${done} done | ${active} active | ${inbox} in inbox | ${rate}% completion rate`
    }
    return 'Could not fetch task stats right now.'
  }

  // List tasks
  if (lower.includes('list task') || lower.includes('show task') || lower.includes('what task')) {
    const { data: tasks } = await supabase.from('tasks').select('title,status').order('created_at', { ascending: false }).limit(8)
    if (tasks && tasks.length > 0) {
      const list = tasks.map(t => `• ${t.title} [${t.status}]`).join('\n')
      return `📋 Recent tasks:\n${list}`
    }
    return 'No tasks found.'
  }

  // List projects
  if (lower.includes('list project') || lower.includes('show project') || lower.includes('what project')) {
    const { data: projects } = await supabase.from('projects').select('name,status,done_tasks,total_tasks').order('created_at', { ascending: false }).limit(5)
    if (projects && projects.length > 0) {
      const list = projects.map(p => `• ${p.name} [${p.status}] — ${p.done_tasks}/${p.total_tasks} tasks`).join('\n')
      return `📁 Projects:\n${list}`
    }
    return 'No projects found.'
  }

  // Help
  if (lower.includes('help') || lower === 'hi' || lower === 'hello') {
    return "I'm Nova, your Mission Control assistant! I can help with:\n• \"create task [title]\" — Add a new task\n• \"create project [name]\" — Start a new project\n• \"status\" — Get dashboard stats\n• \"list tasks\" — Show recent tasks\n• \"list projects\" — Show projects\nWhat would you like to do?"
  }

  // Default
  return `I'm here and ready to help! Try "create task [title]", "status", "list tasks", or "help" to see what I can do.`
}
