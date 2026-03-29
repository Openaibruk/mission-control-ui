import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: pData } = await supabase.from('projects').select('id, department, name').eq('name', 'Mission Control Data-Driven Redesign').single()
  
  if (pData) {
    console.log("Project:", pData);
    // Maybe the string is "Mission Control", let's make sure it matches the exact label in the tabs ("All", "ChipChip", "Mission Control")
    // Wait, let's query a known task that shows under ChipChip to see its format
    const { data: exProj } = await supabase.from('projects').select('department, name').not('department', 'is', null).limit(2)
    console.log("Existing Departments:", exProj)
  }
}
main()
