import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://vgrdeznxllkdolvrhlnm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI')

async function run() {
  const { data: projects } = await supabase.from('projects').select('id, name, status')
  for (const p of projects) {
    if (!p.status) {
      console.log("NULL STATUS:", p.id, p.name)
    }
  }
  console.log("Check complete.")
}
run()
