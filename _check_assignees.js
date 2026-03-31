import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://vgrdeznxllkdolvrhlnm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI')

async function run() {
  const { data: tasks } = await supabase.from('tasks').select('id, title, assignees')
  for (const t of tasks) {
    if (t.assignees && !Array.isArray(t.assignees)) {
      console.log("BAD ASSIGNEES:", t.id, t.title, typeof t.assignees, t.assignees)
    }
  }
  console.log("Check complete.")
}
run()
