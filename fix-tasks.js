import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: pData } = await supabase.from('projects').select('*').eq('name', 'Mission Control Data-Driven Redesign').single()
  
  if (pData) {
    console.log("Project:", pData);
    
    // Update the project domain/department if needed
    await supabase.from('projects').update({ department: 'Mission Control' }).eq('id', pData.id);
    
    const { data: tasks } = await supabase.from('tasks').select('*').eq('project_id', pData.id)
    console.log("Tasks for project:", tasks);
  }
}
main()
