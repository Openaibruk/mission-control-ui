---
name: agentmail
description: "Send and receive emails autonomously via Nova's official AgentMail inbox (novamars@agentmail.to). Useful for verifying accounts, checking inbox messages, getting authentication codes, sending outbound emails, and reading full email content."
category: "Utilities"
---

# AgentMail Tool

You have a dedicated email address: **`novamars@agentmail.to`** powered by the AgentMail API.

You can use this tool to manage your inbox via the included Node.js script.

## Usage

```bash
node /home/ubuntu/.openclaw/workspace/skills/agentmail/agentmail.js <command> [args]
```

## Commands

### List Recent Messages

Lists the 5 most recent emails in the inbox.

```bash
node /home/ubuntu/.openclaw/workspace/skills/agentmail/agentmail.js list
```

### Read a Message

Reads the full content (text body and HTML body) of a specific message by its `messageId` (found via the `list` command).

```bash
node /home/ubuntu/.openclaw/workspace/skills/agentmail/agentmail.js read <messageId>
```

### Send an Email

Sends an outbound email from `novamars@agentmail.to`.

```bash
node /home/ubuntu/.openclaw/workspace/skills/agentmail/agentmail.js send <to_email> <subject> "<body>"
```

## Setup & Credentials
The API key `AGENTMAIL_API_KEY` and email `AGENTMAIL_EMAIL` are automatically injected into the environment via `.env.local`.

