#!/usr/bin/env node
// Token Cost Tracker — aggregates token usage from OpenClaw session logs
const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = '/home/ubuntu/.openclaw/agents/main/sessions';
const OUTPUT_PATH = '/home/ubuntu/.openclaw/workspace/mission-control-ui/public/api/token-costs.json';

function parseSessions() {
  const files = fs.readdirSync(SESSIONS_DIR).filter(f => f.endsWith('.jsonl'));
  const modelStats = {};
  const dailyStats = {};
  let totalCost = 0, totalTokens = 0, totalCalls = 0;

  for (const file of files) {
    const filePath = path.join(SESSIONS_DIR, file);
    let sessionModel = null;
    
    try {
      const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
      
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          
          // Track session model from header entries
          if (entry.modelId && !sessionModel) sessionModel = entry.modelId;
          
          // Find usage - could be at top level or nested in message
          const msg = entry.message || {};
          const usage = entry.usage || msg.usage;
          
          if (usage && usage.cost) {
            // Use model from message, header, or entry
            const model = sessionModel || entry.model || msg.model || msg.modelId || 'gemini-unknown';
            
            const date = entry.timestamp ? entry.timestamp.split('T')[0] : 
                        (msg.timestamp ? msg.timestamp.split('T')[0] : 'unknown');
            const cost = usage.cost.total || 0;
            const tokens = usage.totalTokens || 0;
            const input = usage.input || 0;
            const output = usage.output || 0;
            
            // Per model
            if (!modelStats[model]) modelStats[model] = { calls: 0, tokens: 0, cost: 0, input: 0, output: 0 };
            modelStats[model].calls++;
            modelStats[model].tokens += tokens;
            modelStats[model].cost += cost;
            modelStats[model].input += input;
            modelStats[model].output += output;
            
            // Per day
            if (!dailyStats[date]) dailyStats[date] = { calls: 0, tokens: 0, cost: 0 };
            dailyStats[date].calls++;
            dailyStats[date].tokens += tokens;
            dailyStats[date].cost += cost;
            
            totalCost += cost;
            totalTokens += tokens;
            totalCalls++;
          }
        } catch {}
      }
    } catch {}
  }

  // Sort days descending
  const sortedDays = Object.keys(dailyStats).sort().reverse();
  const last7Days = sortedDays.slice(0, 7).map(d => ({ date: d, ...dailyStats[d], cost: Math.round(dailyStats[d].cost * 10000) / 10000 }));
  const last30Days = sortedDays.slice(0, 30).map(d => ({ date: d, ...dailyStats[d], cost: Math.round(dailyStats[d].cost * 10000) / 10000 }));

  const result = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCost: Math.round(totalCost * 10000) / 10000,
      totalTokens,
      totalCalls,
      avgCostPerCall: totalCalls > 0 ? Math.round((totalCost / totalCalls) * 10000) / 10000 : 0,
      modelCount: Object.keys(modelStats).length,
    },
    byModel: Object.entries(modelStats)
      .sort((a, b) => b[1].cost - a[1].cost)
      .map(([model, stats]) => ({ model, ...stats, cost: Math.round(stats.cost * 10000) / 10000 })),
    last7Days,
    byDay: last30Days,
  };

  return result;
}

const data = parseSessions();

// Write to public dir for dashboard API
const outDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));

console.log(`✅ Token costs: $${data.summary.totalCost} total, ${data.summary.totalCalls} calls, ${data.summary.modelCount} models`);
console.log('Output:', OUTPUT_PATH);
console.log('Top models:', data.byModel.slice(0,3).map(m => `${m.model}: $${m.cost}`).join(', '));
