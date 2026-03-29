const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function kickoff() {
  const projectId = '1ba5d962-fcb5-4157-8cbd-3b278a063509';
  const tasks = [
    {
      title: 'Market & Content Research',
      description: 'Research successful YouTube Kids channels and outline a content strategy focusing on Amharic + English, Ethiopian folktales, phonics, and STEM.',
      status: 'in_progress',
      project_id: projectId,
      assignees: ['@Nova']
    },
    {
      title: 'Production Pipeline & AI Tools',
      description: 'Identify the best AI tools and workflows for 2D/3D animation, Amharic voiceovers (TTS), and music generation.',
      status: 'in_progress',
      project_id: projectId,
      assignees: ['@Kiro']
    },
    {
      title: 'Channel Launch Plan',
      description: 'Create a step-by-step roadmap for channel branding, first 3 video concepts, and a growth strategy.',
      status: 'inbox',
      project_id: projectId,
      assignees: ['@Nova']
    }
  ];

  const { error: tErr } = await supabase.from('tasks').insert(tasks);
  if (tErr) console.error('Tasks insert error:', tErr);

  const { error: pErr } = await supabase.from('projects')
    .update({ total_tasks: 3, status: 'in_progress' })
    .eq('id', projectId);
  if (pErr) console.error('Project update error:', pErr);
  
  console.log('Project kickoff complete.');
}
kickoff();