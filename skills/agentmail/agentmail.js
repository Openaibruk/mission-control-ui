require('dotenv').config({ path: '/home/ubuntu/.openclaw/workspace/.env.local' });
const { AgentMailClient } = require('agentmail');

const client = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY
});
const EMAIL = process.env.AGENTMAIL_EMAIL;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.error("Usage: node agentmail.js <command> [args]");
    process.exit(1);
  }

  try {
    if (command === 'list') {
      const res = await client.inboxes.messages.list(EMAIL, { limit: 5 });
      console.log(JSON.stringify(res, null, 2));
    } 
    else if (command === 'read') {
      const messageId = args[1];
      if (!messageId) throw new Error("Requires messageId argument");
      const res = await client.inboxes.messages.get(EMAIL, messageId);
      console.log(JSON.stringify(res, null, 2));
    }
    else if (command === 'send') {
      const to = args[1];
      const subject = args[2];
      const text = args[3];
      if (!to || !subject || !text) throw new Error("Usage: send <to> <subject> <text>");
      
      const toList = to.split(',').map(e => e.trim());
      const res = await client.inboxes.messages.send(EMAIL, {
        to: toList,
        subject: subject,
        text: text
      });
      console.log("Message sent:", JSON.stringify(res, null, 2));
    }
    else {
      console.error("Unknown command:", command);
      process.exit(1);
    }
  } catch (e) {
    console.error("AgentMail Error:", e.message || e);
  }
}

main();
