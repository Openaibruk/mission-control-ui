const https = require('https');

const tools = [
  { name: 'get_operations_overview', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_product_sales', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_user_registrations', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_weekly_historical', params: {} },
  { name: 'get_product_performance', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_vendor_performance', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_demand_projections', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_margin_analysis', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_logistics_analytics', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_wallet_analytics', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_reviews_analytics', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_capacity_planning', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_customer_profile', params: { phone: '0911000000' } },
  { name: 'get_customer_segmentation', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_super_leader_analytics', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_fuel_analytics', params: { startDate: '2026-03-01', endDate: '2026-03-18' } },
  { name: 'get_active_flash_deals', params: {} }
];

const API_URL = 'https://earrqspffkrnreucmtvf.supabase.co/functions/v1/datahub-mcp-server';
const API_KEY = 'mcp_gCNsJa4XoP3Tb9o143jPiR1AyoF5iN7HITnPmZwwfHdIk6aC';

async function testTool(tool) {
  return new Promise((resolve) => {
    const requestBody = JSON.stringify({
      method: 'tools/call',
      params: {
        name: tool.name,
        arguments: tool.params
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
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          let status = 'UNKNOWN';
          let detail = '';
          
          if (parsed.error) {
            status = 'ERROR';
            detail = parsed.error.message || JSON.stringify(parsed.error);
          } else if (parsed.result && parsed.result.content && parsed.result.content[0]) {
             const innerText = parsed.result.content[0].text;
             try {
                const innerParsed = JSON.parse(innerText);
                if (innerParsed.error) {
                   status = 'ERROR';
                   detail = innerParsed.error;
                } else if (innerParsed.success === false) {
                   status = 'ERROR';
                   detail = innerParsed.error || 'Success=false';
                } else {
                   status = 'SUCCESS';
                   // Try to get array length or object keys
                   if (Array.isArray(innerParsed.data)) {
                      detail = `Returned ${innerParsed.data.length} records`;
                   } else if (innerParsed.data) {
                      detail = `Returned data object`;
                   } else if (Array.isArray(innerParsed)) {
                      detail = `Returned array of ${innerParsed.length}`;
                   } else {
                      detail = `Returned valid JSON object`;
                   }
                }
             } catch(e) {
                status = 'SUCCESS (RAW)';
                detail = innerText.substring(0, 50) + '...';
             }
          } else {
            status = 'UNEXPECTED';
            detail = 'No content returned';
          }
          resolve({ name: tool.name, status, detail });
        } catch (e) {
          resolve({ name: tool.name, status: 'PARSE_ERROR', detail: data.substring(0, 100) });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ name: tool.name, status: 'REQ_ERROR', detail: e.message });
    });

    req.write(requestBody);
    req.end();
  });
}

async function runAll() {
  console.log("Testing all 17 MCP tools...\n");
  for (const tool of tools) {
    const res = await testTool(tool);
    let icon = '❓';
    if (res.status === 'SUCCESS' || res.status.includes('SUCCESS')) icon = '✅';
    if (res.status === 'ERROR') icon = '❌';
    console.log(`${icon} ${res.name.padEnd(28)} | ${res.status.padEnd(8)} | ${res.detail}`);
  }
}

runAll();
