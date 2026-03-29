const { AgentMailClient } = require('agentmail');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://vgrdeznxllkdolvrhlnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsImV4cCI6MjA4OTA5MzQwMX0.LOzByf32QCF0cjYkfiLViXz3Qs04TFp6SkJ040pcDeI'
);

const client = new AgentMailClient({ 
  apiKey: 'am_us_c2eb5daf62bff7ddab39299180812e9104df6059af7605a70e64b9b70dfb6c36' 
});
const EMAIL = 'novamars@agentmail.to';

// OpenRouter LLM 
async function analyzeTweet(tweetText, author) {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const body = {
    model: "openrouter/xiaomi/mimo-v2-pro", // using the default working model
    messages: [
      {
        role: "system",
        content: "You are the OpenClaw Tech Radar agent. Your job is to read a tweet containing a new tech tool, framework, or AI idea, and return a short, insightful summary of what the tool is and 1-2 bullet points on how it could be used for 'ChipChip' (an e-commerce platform) or 'OpenClaw' (a multi-agent AI architecture). Format your response neatly in Markdown."
      },
      {
        role: "user",
        content: `Tweet by @${author}:\n\n${tweetText}`
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const json = await response.json();
  if (!json.choices) {
    throw new Error("No choices from OpenRouter: " + JSON.stringify(json));
  }
  return json.choices[0].message.content;
}

async function processEmail(msgInfo) {
  console.log(`Processing message ID: ${msgInfo.messageId} / Thread: ${msgInfo.threadId}`);
  
  // Get full body
  const fullMsg = await client.inboxes.messages.get(EMAIL, msgInfo.messageId);
  const content = fullMsg.text || fullMsg.html || '';

  // Look for Twitter/X links
  const urlRegex = /(https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+)/ig;
  const matches = content.match(urlRegex);

  if (matches && matches.length > 0) {
    for (const link of matches) {
      console.log(`Found Twitter link: ${link}`);
      
      try {
        // Convert to vxtwitter to fetch JSON
        const vxUrl = link.replace(/twitter\.com|x\.com/, 'api.vxtwitter.com');
        const res = await fetch(vxUrl);
        const data = await res.json();
        
        if (data.text) {
           console.log(`Analyzing tweet by @${data.user_screen_name}...`);
           const analysis = await analyzeTweet(data.text, data.user_screen_name);
           
           // Get project ID
           const projectId = fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/tech-radar-id.txt', 'utf-8').trim();
           
           // Create a task in Mission Control
           const title = `Tech Radar: Tweet from @${data.user_screen_name}`;
           const description = `**Source URL:** ${link}\n\n**Tweet Content:**\n> ${data.text}\n\n---\n\n**Nova Analysis:**\n${analysis}`;
           
           await supabase.from('tasks').insert([{
             title: title,
             description: description,
             status: 'approval_needed',
             project_id: projectId,
             priority: 'medium',
             assignees: ['@Nova']
           }]);
           console.log(`Saved task for approval: ${title}`);
        }
      } catch(e) {
        console.error(`Failed to process link ${link}:`, e.message);
      }
    }
  } else {
    console.log("No Twitter links found in this email.");
  }
  
  // Clean up inbox (move thread to trash)
  console.log(`Deleting thread ${msgInfo.threadId}`);
  await client.inboxes.threads.delete(EMAIL, msgInfo.threadId);
}

async function main() {
  try {
    const res = await client.inboxes.messages.list(EMAIL, { limit: 10 });
    const messages = res.messages || [];
    
    // Filter out messages that are from sendblue or already processed
    // Actually, everything that arrives and stays in inbox is a candidate
    for (const msg of messages) {
       // We only care about user emails or forwarded tweets, not Sendblue codes
       if (msg.subject && msg.subject.includes('Sign In Code')) {
           await client.inboxes.threads.delete(EMAIL, msg.threadId);
           continue;
       }
       if (msg.from && msg.from.includes('sendblue')) {
           continue;
       }
       
       await processEmail(msg);
    }
    
    // Also, grab the project and update its total_tasks count based on the DB
    const projectId = fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/tech-radar-id.txt', 'utf-8').trim();
    const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('project_id', projectId);
    await supabase.from('projects').update({ total_tasks: count }).eq('id', projectId);
    
    console.log("Finished running tech-radar-ingest.js");
  } catch (err) {
    console.error("Ingest Error:", err);
  }
}

main();
