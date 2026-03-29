import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vgrdeznxllkdolvrhlnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: pData } = await supabase.from('projects').select('*').eq('status', 'approval_needed')
  const { data: tData } = await supabase.from('tasks').select('*').eq('status', 'approval_needed')
  
  console.log('Projects needing approval:', pData?.length)
  console.log('Tasks needing approval:', tData?.length)
}
main()
