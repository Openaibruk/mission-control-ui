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
        title: 'Approve: Mission Control Data-Driven Redesign',
        description: 'Please approve the project plan to transform the dashboard from a partially static UI into a dynamic, real-time Mission Control system with deep visibility and editing capabilities. Full details are in the project overview.',
        status: 'approval_needed',
        type: 'approval',
        assigned_to: 'Nova'
      }
    ])
    console.log(data, error)
  }
}
main()
