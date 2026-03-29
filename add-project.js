import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      { 
        name: 'Mission Control Data-Driven Redesign', 
        description: 'Transform the current dashboard from a partially static UI into a dynamic, real-time Mission Control system with deep visibility, editing capabilities, and structured data flow across all modules.',
        status: 'approval_needed'
      }
    ])

  console.log(data, error)
}
main()
