import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: pData, error: pError } = await supabase.from('projects').insert([
    {
      name: 'Mission Control Data-Driven Redesign V2',
      description: 'Transform the current dashboard from a partially static UI into a dynamic, real-time Mission Control system with deep visibility, editing capabilities, and structured data flow across all modules.',
      status: 'active',
      department: 'Mission Control'
    }
  ]).select().single()

  if (pError) {
    console.error("Project error:", pError)
    return
  }

  const projectId = pData.id

  const tasks = [
    {
      project_id: projectId,
      title: 'Phase 1: Overview & Aesthetics (UI Redesign)',
      description: 'Fix light mode visibility issues, implement full Project Overview page with extended editing, and improve Activity Stream filtering and details.',
      status: 'inbox',
      assignees: ['@UI-Agent'],
      priority: 'high'
    },
    {
      project_id: projectId,
      title: 'Phase 2: Agent & Project Management Data Binding',
      description: 'Connect Agents page to dynamic workspace data (all agents, soul.md editor, tools, skills, models) and add full live streaming metrics to Live Agent page.',
      status: 'inbox',
      assignees: ['@Data-Agent'],
      priority: 'high'
    },
    {
      project_id: projectId,
      title: 'Phase 3: Analytics & Settings Module Connection',
      description: 'Connect ClickHouse/MCP servers to Analytics page with B2C/B2B toggles. Connect all Settings to real backend configurations.',
      status: 'inbox',
      assignees: ['@Backend-Agent'],
      priority: 'medium'
    },
    {
      project_id: projectId,
      title: 'Phase 4: Files & Workspace System Build',
      description: 'Build the new Files page for agent outputs and the visual Workspace Management tree view for VPS synchronization.',
      status: 'inbox',
      assignees: ['@System-Agent'],
      priority: 'medium'
    }
  ]

  const { error: tError } = await supabase.from('tasks').insert(tasks)
  if (tError) console.error("Task error:", tError)
  else console.log("Project and tasks created successfully.")
}

main()
