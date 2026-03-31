import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://vgrdeznxllkdolvrhlnm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI')

async function run() {
  const { data: acts } = await supabase.from('activities').select('id, agent_name')
  for (const a of acts) {
    if (typeof a.agent_name !== 'string') {
      console.log("BAD ACTIVITY AGENT NAME:", a.id, typeof a.agent_name, a.agent_name)
    }
  }
  console.log("Check complete.")
}
run()
