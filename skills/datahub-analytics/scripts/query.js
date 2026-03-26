const https = require('https');

const args = process.argv.slice(2);
const toolName = args[0];
let params = args[1] ? JSON.parse(args[1]) : null;

if (!toolName) {
  console.error("Usage: node query.js <tool_name> [json_params]");
  process.exit(1);
}

// If no params provided, generate defaults (last 30 days)
if (!params) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  params = {
    startDate: formatDate(start),
    endDate: formatDate(end)
  };
}

const API_URL = 'https://earrqspffkrnreucmtvf.supabase.co/functions/v1/datahub-mcp-server';
const API_KEY = 'mcp_gCNsJa4XoP3Tb9o143jPiR1AyoF5iN7HITnPmZwwfHdIk6aC';

const requestBody = JSON.stringify({
  method: 'tools/call',
  params: {
    name: toolName,
    arguments: params
  },
  jsonrpc: '2.0',
  id: 1
});

const req = https.request(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Length': Buffer.byteLength(requestBody)
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.error) {
        console.error(`API Error: ${JSON.stringify(parsed.error, null, 2)}`);
      } else if (parsed.result && parsed.result.content) {
        console.log(JSON.stringify(parsed.result.content, null, 2));
      } else {
        console.log(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log(data); // If not JSON, print raw
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(requestBody);
req.end();
