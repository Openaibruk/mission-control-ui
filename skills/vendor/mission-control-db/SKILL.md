---
name: mission-control-db
description: "Interact with the Mission Control Supabase database: list/create/update tasks, manage agents, post messages, log activities, handle notifications, and manage documents. Use when any request involves Mission Control tasks, agents, projects, activity logs, or the Supabase-backed dashboard data. Triggers on: task list, create task, update task, agent status, mission control, dashboard data, activity log, notifications."
---

# Mission Control DB

Interact with the Mission Control Supabase backend via `scripts/mc.js`.

## Setup

The `.env` file at the workspace root (`/home/ubuntu/.openclaw/workspace/.env`) contains the Supabase credentials. **Do not ask the user for keys** — they are already configured. If `.env` is missing or empty, recreate it from the values in `mission-control-ui/.env.local`:

```bash
# Extract from the UI env file
grep 'NEXT_PUBLIC_SUPABASE_URL' /home/ubuntu/.openclaw/workspace/mission-control-ui/.env.local | sed 's/NEXT_PUBLIC_//' > /home/ubuntu/.openclaw/workspace/.env
grep 'NEXT_PUBLIC_SUPABASE_ANON_KEY' /home/ubuntu/.openclaw/workspace/mission-control-ui/.env.local | sed 's/NEXT_PUBLIC_//' >> /home/ubuntu/.openclaw/workspace/.env
```

## Usage

All commands run from the workspace root:

```bash
cd /home/ubuntu/.openclaw/workspace && node scripts/mc.js <command> ['<json-payload>']
```

## Commands Reference

| Command | Payload | Description |
|---|---|---|
| `tasks:list` | none | List all tasks (newest first) |
| `tasks:create` | `{"title":"...","description":"...","status":"inbox","assignees":["@Agent"]}` | Create a task |
| `tasks:update` | `{"id":"<uuid>","updates":{"status":"done"}}` | Update a task |
| `agents:upsert` | `{"id":"...","name":"...","role":"...","status":"active"}` | Create or update agent |
| `messages:post` | `{"task_id":"<uuid>","agent":"@Name","content":"..."}` | Post message on a task |
| `messages:list` | `{"task_id":"<uuid>"}` | List messages for a task |
| `documents:create` | `{"title":"...","content":"...","type":"report"}` | Create a document |
| `documents:list` | none | List all documents |
| `activities:log` | `{"agent":"@Name","action":"...","details":"..."}` | Log an activity |
| `notifications:get` | `{"agent_name":"@Name"}` | Get undelivered notifications |
| `notifications:mark_read` | `{"id":"<uuid>"}` | Mark notification as delivered |

## Valid Task Statuses

`inbox`, `in_progress`, `done`, `backlog`

## Examples

```bash
# List all tasks
node scripts/mc.js tasks:list

# Create a task
node scripts/mc.js tasks:create '{"title":"Fix login bug","description":"Users cant log in on mobile","status":"inbox","assignees":["@Forge"]}'

# Mark a task done
node scripts/mc.js tasks:update '{"id":"abc-123","updates":{"status":"done"}}'

# Log activity
node scripts/mc.js activities:log '{"agent":"@Nova","action":"task_completed","details":"Fixed login bug"}'
```

## Troubleshooting

If you get `SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env`, run the setup command above to recreate `.env` from the UI env file. **Never ask the user for these keys.**
