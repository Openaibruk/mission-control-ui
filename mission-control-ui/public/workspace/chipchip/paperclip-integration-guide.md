# Paperclip ↔ OpenClaw Integration Guide

## What is Paperclip?

Paperclip is an open-source AI company orchestrator. **If OpenClaw is an employee, Paperclip is the company.** It provides org charts, budgets, governance, goal alignment, and agent coordination on top of agents like OpenClaw, Claude Code, Codex, etc.

- **Repo:** https://github.com/paperclipai/paperclip
- **Docs:** https://paperclip.ing/docs
- **License:** MIT
- **Stack:** Node.js server + React UI + embedded PostgreSQL

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              PAPERCLIP SERVER               │
│         (port 3100, embedded Postgres)      │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Org Chart│  │ Budgets  │  │ Tickets   │ │
│  │ & Goals  │  │ & Costs  │  │ & Traces  │ │
│  └──────────┘  └──────────┘  └───────────┘ │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │    OpenClaw Gateway Adapter (WS)        ││
│  │    ws://127.0.0.1:18789                 ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│          OPENCLAW GATEWAY                   │
│          (port 18789, WebSocket)            │
│                                             │
│  Nova (PM) │ Henok (Dev) │ Cinder (QA)     │
│  Kiro (Arch) │ Nahom │ Bini │ Lidya │ Amen │
└─────────────────────────────────────────────┘
```

---

## Installation

```bash
# Quick install (interactive setup)
npx paperclipai onboard --yes

# Or manual
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm dev
```

- **Requirements:** Node.js 20+, pnpm 9.15+
- **Default port:** 3100
- **Database:** Embedded PostgreSQL (auto-created, no setup)

---

## OpenClaw Gateway Adapter

Paperclip has a **native OpenClaw adapter** (`@paperclipai/adapter-openclaw-gateway`).

### How It Works

1. Paperclip connects to OpenClaw via **WebSocket** (ws://)
2. Sends an `agent` request with a task message
3. Waits for completion via `agent.wait`
4. Streams event frames back to Paperclip logs/transcript

### Authentication

```yaml
# Adapter config
authToken: "<openclaw-gateway-token>"
# OR
headers:
  x-openclaw-token: "<token>"
```

### Session Routing

Three strategies:
- **`issue`** — Paperclip issues a new session key each time
- **`fixed`** — Uses a specific `sessionKey` you configure
- **`run`** — Creates a run-scoped session

### Agent Request Format

```
message: "Task description with context"
idempotencyKey: <Paperclip runId>
sessionKey: <resolved key>
agentId: <optional, from config>
timeoutSec: <adapter-level timeout>
```

### Auto-Pairing

By default (`autoPairOnFirstConnect=true`), Paperclip handles initial device pairing automatically on first connect.

---

## OpenClaw Config for Paperclip

Our OpenClaw gateway is at `ws://127.0.0.1:18789`.

Key info for Paperclip config:
- **Gateway URL:** `ws://127.0.0.1:18789`
- **Port:** 3100 (Paperclip UI)
- **Auth token:** See `~/.openclaw/openclaw.json` auth section

---

## ChipChip Org Chart (Paperclip)

### Company: ChipChip — Logistics & Delivery

**Mission:** Be Ethiopia's #1 last-mile delivery platform

```
Bruk (Human — Board/Owner)
 └── Nova (Chief of Staff / PM)
      ├── Henok (CTO / Lead Engineer)
      │    └── Cinder (QA Lead)
      ├── Kiro (Architect)
      ├── Nahom (VP Marketing)
      │    ├── Bini (Content Lead)
      │    └── Lidya (Creative Director)
      └── Amen (Analytics & Performance)
```

### Budget Allocation (Monthly)

| Agent | Role | Budget |
|-------|------|--------|
| Nova | Chief of Staff | $60 |
| Henok | CTO | $50 |
| Cinder | QA | $30 |
| Kiro | Architect | $40 |
| Nahom | Marketing Strategy | $40 |
| Bini | Content | $30 |
| Lidya | Design | $30 |
| Amen | Analytics | $20 |
| **Total** | | **$300** |

---

## Key Paperclip Concepts

### Goal Hierarchy
```
Company Mission → Project Goal → Agent Goal → Task
```
Every task traces back to why it exists.

### Heartbeats
Agents wake on a schedule:
- Check their tickets
- Pick up assigned work
- Report back
- Delegation flows up/down org chart

### Tickets
Every task is a ticket with:
- Owner (agent)
- Status (open/in_progress/done)
- Thread (conversation trace)
- Full tool-call trace & audit log

### Governance
- You're the board
- Approve/reject agent actions
- Override strategy
- Pause/terminate agents
- Set and enforce budgets

---

## Next Steps

1. ✅ Paperclip server installed and running on port 3100
2. ⬜ Access dashboard at http://localhost:3100
3. ⬜ Create "ChipChip" company via the UI
4. ⬜ Add agents from org chart above
5. ⬜ Configure OpenClaw gateway adapter (ws://127.0.0.1:18789)
6. ⬜ Set budgets and heartbeat schedules
7. ⬜ Create first tasks and assign to agents
8. ⬜ Monitor from dashboard

---

## Useful Commands

```bash
# Start Paperclip
cd paperclip-server && pnpm dev

# Access UI
open http://localhost:3100

# OpenClaw gateway status
openclaw gateway status

# Check Paperclip logs
tail -f paperclip-server/logs/*.log
```

---

*Guide created: 2026-03-17*
*Last updated: 2026-03-17*
