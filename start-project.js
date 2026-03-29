import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: pData } = await supabase.from('projects').select('id').eq('name', 'Mission Control Data-Driven Redesign').single()
  
  if (pData) {
    // Update project
    await supabase.from('projects').update({ status: 'active' }).eq('id', pData.id)
    
    // Update approval task
    await supabase.from('tasks').update({ status: 'done' }).eq('project_id', pData.id).eq('status', 'approval_needed')
    
    // Create new tasks
    await supabase.from('tasks').insert([
      {
        project_id: pData.id,
        title: 'Phase 1: Overview & Aesthetics (UI Redesign)',
        description: 'Fix light mode visibility issues, implement full Project Overview page with extended editing, and improve Activity Stream filtering and details.',
        status: 'todo',
        assignees: ['@UI-Agent'],
        priority: 'high'
      },
      {
        project_id: pData.id,
        title: 'Phase 2: Agent & Project Management Data Binding',
        description: 'Connect Agents page to dynamic workspace data (all agents, soul.md editor, tools, skills, models) and add full live streaming metrics to Live Agent page.',
        status: 'todo',
        assignees: ['@Data-Agent'],
        priority: 'high'
      },
      {
        project_id: pData.id,
        title: 'Phase 3: Analytics & Settings Module Connection',
        description: 'Connect ClickHouse/MCP servers to Analytics page with B2C/B2B toggles. Connect all Settings to real backend configurations.',
        status: 'todo',
        assignees: ['@Backend-Agent'],
        priority: 'medium'
      },
      {
        project_id: pData.id,
        title: 'Phase 4: Files & Workspace System Build',
        description: 'Build the new Files page for agent outputs and the visual Workspace Management tree view for VPS synchronization.',
        status: 'todo',
        assignees: ['@System-Agent'],
        priority: 'medium'
      }
    ])
    console.log('Project started and tasks created')
  }
}
main()
