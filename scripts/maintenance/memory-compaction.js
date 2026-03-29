const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspace = '/home/ubuntu/.openclaw/workspace';
const dailyLogDir = path.join(workspace, 'memory/daily-log');
const factsDir = path.join(workspace, 'memory/facts');

// Get all .md files in daily-log
if (!fs.existsSync(dailyLogDir)) process.exit(0);

const files = fs.readdirSync(dailyLogDir).filter(f => f.endsWith('.md'));
if (files.length === 0) {
  console.log("No daily logs to compact.");
  process.exit(0);
}

let aggregatedLogs = "";
for (const file of files) {
  const content = fs.readFileSync(path.join(dailyLogDir, file), 'utf-8');
  aggregatedLogs += `\n\n--- Content from ${file} ---\n\n` + content;
}

const prompt = `You are the Autoscientist.
Please read the following aggregated daily logs from OpenClaw agents and extract the durable, long-term facts that should be persisted across sessions (such as user preferences, environment configurations, and major architectural decisions).
Format your output as a Markdown list. Ignore ephemeral data like task completions or daily standups.

LOGS:
${aggregatedLogs}
`;

try {
  const result = execSync('openclaw chat "' + prompt.replace(/"/g, '\\"') + '"', { encoding: 'utf-8' });
  const timestamp = new Date().toISOString().split('T')[0];
  fs.writeFileSync(path.join(factsDir, `compacted_facts_${timestamp}.md`), result);
  
  // Clean up daily logs
  for (const file of files) {
    fs.unlinkSync(path.join(dailyLogDir, file));
  }
  console.log(`Successfully compacted ${files.length} daily logs into facts.`);
} catch (e) {
  console.error("Compaction failed:", e.message);
}
