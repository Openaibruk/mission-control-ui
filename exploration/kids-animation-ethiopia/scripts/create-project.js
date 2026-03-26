import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
);

(async () => {
  try {
    const { data: existing } = await supabase.from('projects').select('id').eq('name', 'Ethiopian Kids Animation Exploration').maybeSingle();
    if (existing) {
      console.log('Project already exists:', existing.id);
      const projectId = existing.id;
      // Check if tasks already exist
      const { data: tasks } = await supabase.from('tasks').select('id').eq('project_id', projectId);
      if (tasks.length === 0) {
        console.log('No tasks found; creating them now...');
        const tasksToCreate = [
          { title: 'Define channel identity (name, characters)', description: 'Finalize name, design 3 core characters, tone of voice', priority: 'high', status: 'inbox', assignees: ['@Nova'] },
          { title: 'Write 5 pilot scripts', description: '3 phonics, 2 numbers; include Amharic keywords', priority: 'high', status: 'inbox', assignees: ['@Nahom'] },
          { title: 'Set up Amharic TTS pipeline', description: 'Choose provider (Google Cloud or Play.ht), test voices, create script-to-audio script', priority: 'medium', status: 'inbox', assignees: ['@Henok'] },
          { title: 'Build Blender character rig', description: 'Rig main character with face bones for phonemes and expressions', priority: 'high', status: 'inbox', assignees: ['@Kiro'] },
          { title: 'Animate first 60-second Short', description: 'Use AI lip sync, motion cycles; render vertical 1080x1920', priority: 'critical', status: 'inbox', assignees: ['@Henok'] },
          { title: 'Edit & produce pilot video', description: 'Add voiceover, music, bilingual captions; export MP4', priority: 'high', status: 'inbox', assignees: ['@Cinder'] },
          { title: 'Launch channel & upload initial batch', description: '8 videos (5 Shorts, 3 long-form), optimize SEO, enable Made for Kids', priority: 'medium', status: 'inbox', assignees: ['@Nova'] }
        ];
        for (const t of tasksToCreate) {
          await supabase.from('tasks').insert({ ...t, project_id: projectId });
        }
        console.log('Tasks created for project', projectId);
      } else {
        console.log('Tasks already exist, skipping.');
      }
      process.exit(0);
    }

    const { data: project, error } = await supabase.from('projects').insert({
      name: 'Ethiopian Kids Animation Exploration',
      description: 'Research and implementation plan for a YouTube Kids animation channel targeting Ethiopian children (Amharic + English, cultural folktales, phonics, STEM).',
      status: 'planning'
    }).select().single();

    if (error) throw error;
    console.log('Created project:', project.id);

    const tasksToCreate = [
      { title: 'Define channel identity (name, characters)', description: 'Finalize name, design 3 core characters, tone of voice', priority: 'high', status: 'inbox', assignees: ['@Nova'] },
      { title: 'Write 5 pilot scripts', description: '3 phonics, 2 numbers; include Amharic keywords', priority: 'high', status: 'inbox', assignees: ['@Nahom'] },
      { title: 'Set up Amharic TTS pipeline', description: 'Choose provider (Google Cloud or Play.ht), test voices, create script-to-audio script', priority: 'medium', status: 'inbox', assignees: ['@Henok'] },
      { title: 'Build Blender character rig', description: 'Rig main character with face bones for phonemes and expressions', priority: 'high', status: 'inbox', assignees: ['@Kiro'] },
      { title: 'Animate first 60-second Short', description: 'Use AI lip sync, motion cycles; render vertical 1080x1920', priority: 'critical', status: 'inbox', assignees: ['@Henok'] },
      { title: 'Edit & produce pilot video', description: 'Add voiceover, music, bilingual captions; export MP4', priority: 'high', status: 'inbox', assignees: ['@Cinder'] },
      { title: 'Launch channel & upload initial batch', description: '8 videos (5 Shorts, 3 long-form), optimize SEO, enable Made for Kids', priority: 'medium', status: 'inbox', assignees: ['@Nova'] }
    ];

    for (const t of tasksToCreate) {
      await supabase.from('tasks').insert({ ...t, project_id: project.id });
    }
    console.log('Tasks created for project', project.id);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
