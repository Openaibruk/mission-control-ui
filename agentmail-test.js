const { AgentMailClient } = require('agentmail');
const client = new AgentMailClient({ apiKey: process.env.AGENTMAIL_API_KEY });
async function main() {
  try {
    const res = await client.inboxes.messages.list('novamars@agentmail.to', { limit: 5 });
    console.log(JSON.stringify(res, null, 2));
  } catch(e) { console.error(e) }
}
main()
