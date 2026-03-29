import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: pData } = await supabase.from('projects').select('id, department').eq('name', 'Mission Control Data-Driven Redesign').single()
  console.log("Project:", pData);
  
  if (pData) {
    const { data: tasks } = await supabase.from('tasks').select('*').eq('project_id', pData.id)
    console.log("Tasks:", tasks.length);
    console.log("Sample task:", tasks[0]);
  }
}
main()
