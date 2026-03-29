import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: pData } = await supabase.from('projects').select('id').eq('name', 'Mission Control Data-Driven Redesign').single()
  
  if (pData) {
    const { data, error } = await supabase.from('tasks').insert([
      {
        project_id: pData.id,
        title: 'Approve: Mission Control Data-Driven Redesign Project',
        description: 'Please review and approve the project plan for the Mission Control data-driven redesign. Check the active projects list for full details.',
        status: 'approval_needed',
        assignees: ['@Nova'],
        priority: 'high'
      }
    ])
    console.log(data, error)
  }
}
main()
