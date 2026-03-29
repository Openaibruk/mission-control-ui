const pty = require('/tmp/node_modules/node-pty');
const { AgentMailClient } = require('agentmail');
require('dotenv').config({ path: '.env.local' });

const client = new AgentMailClient({ apiKey: process.env.AGENTMAIL_API_KEY });
const EMAIL = 'novamars@agentmail.to';

const ptyProcess = pty.spawn('sendblue', ['setup'], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

let state = 0;
let codeSent = false;

ptyProcess.on('data', async function(data) {
  const str = data.toString();
  process.stdout.write(str);
  
  if (str.includes('Email') && state === 0) {
    state = 1;
    setTimeout(() => {
      ptyProcess.write('novamars@agentmail.to\r');
    }, 500);
  }
  
  if (str.includes('Verification code') && !codeSent) {
    codeSent = true;
    console.log("\n[Bot] Waiting 8 seconds for the email to arrive via API...");
    setTimeout(async () => {
      try {
        const res = await client.inboxes.messages.list(EMAIL, { limit: 1 });
        const msgInfo = res.messages[0];
        
        console.log(`\n[Bot] Found message ID: ${msgInfo.messageId}, fetching body...`);
        const fullMsg = await client.inboxes.messages.get(EMAIL, msgInfo.messageId);
        const content = JSON.stringify(fullMsg);
        
        // Find 8-digit code (e.g. 12345678) in the message
        const match = content.match(/\b(\d{8})\b/);
        if (match) {
          const code = match[1];
          console.log("\n[Bot] Extracted code: " + code);
          ptyProcess.write(code + '\r');
        } else {
          console.log("\n[Bot] Could not find 8-digit code in email text");
          ptyProcess.write('00000000\r');
        }
      } catch(e) {
        console.error("\n[Bot] Error reading email:", e);
      }
    }, 8000);
  }
  
  if (str.includes('Company name') && state === 1) {
    state = 2;
    setTimeout(() => {
      ptyProcess.write('openclaw\r');
    }, 500);
  }
  
  if (str.includes('Name') && state === 2) {
    state = 3;
    setTimeout(() => {
      ptyProcess.write('Nova\r');
    }, 500);
  }
  
  if (str.toLowerCase().includes('password') && state === 3) {
    state = 4;
    setTimeout(() => {
      ptyProcess.write('Nova123!A\r');
    }, 500);
  }
});
