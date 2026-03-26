# Paperclip — Deep Dive Analysis

> **If OpenClaw is an _employee_, Paperclip is the _company_.**

Paperclip is an open-source AI company orchestrator — a Node.js server + React UI that manages a workforce of AI agents as a real business. It provides org charts, budgets, governance, goal alignment, heartbeats, ticketing, and multi-company isolation. Licensed MIT, self-hosted, no SaaS account required.

**Repo:** https://github.com/paperclipai/paperclip  
**Docs:** https://paperclip.ing/docs  
**Stack:** Node.js + React + Hono (REST) + PostgreSQL (Drizzle ORM) + Better Auth  
**License:** MIT  
**Status:** Active, rapidly gaining traction (March 2026)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAPERCLIP SERVER                          │
│              (Node.js process, port 3100)                    │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────┐ │
│  │ Org Chart│ │ Budgets  │ │  Tickets   │ │   Plugin      │ │
│  │ & Goals  │ │ & Costs  │ │ & Traces   │ │   Runtime     │ │
│  └──────────┘ └──────────┘ └───────────┘ └───────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              ADAPTER LAYER                              │ │
│  │  openclaw_gateway │ claude │ codex │ cursor │ bash │ http│ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              DATABASE (Drizzle ORM)                     │ │
│  │  Embedded PGlite (dev) / Docker Postgres / Supabase     │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────┘
                                   │ REST API (Hono)
                                   │ WebSocket (adapters)
                                   ▼
                    ┌──────────────────────────┐
                    │    REACT UI (Vite)       │
                    │  Dashboard / Mobile Ready │
                    └──────────────────────────┘
```

### 1.2 Package Structure

| Package | Purpose |
|---------|---------|
| `packages/db` | Drizzle ORM schema, migrations, database client |
| `packages/adapters` | Agent runtime adapters (OpenClaw, Claude, Codex, Cursor, Bash, HTTP) |
| `packages/adapter-utils` | Shared adapter utilities |
| `packages/plugins` | Plugin system, SDK, example plugins, scaffold tooling |
| `packages/shared` | Shared types and utilities |

### 1.3 Database

- **ORM:** Drizzle (TypeScript-native)
- **Dev:** Embedded PGlite (zero-config, auto-created at `~/.paperclip/instances/default/db/`)
- **Prod:** Docker Compose Postgres 17 or hosted Supabase
- **Migrations:** `pnpm db:generate` / `pnpm db:migrate`
- **Secret storage:** Encrypted at rest with local master key
- **Switching modes:** Controlled by `DATABASE_URL` env var (unset = embedded, set = external)

### 1.4 Deployment Modes

| Mode | Exposure | Human Auth | Use Case |
|------|----------|------------|----------|
| `local_trusted` | Loopback only | No login | Single-operator local dev |
| `authenticated` + `private` | Private network | Login required | Tailscale/VPN/LAN |
| `authenticated` + `public` | Internet-facing | Login required | Cloud deployment |

Progressive path: local → Tailscale → Vercel/cloud. Board claim flow for mode migration.

### 1.5 Plugin System

Paperclip has a **two-tier extension architecture**:

**Platform Modules** (in-process, trusted):
- Agent adapters, storage providers, secret providers, run-log backends
- Registered via explicit APIs: `registerAgentAdapter()`, `registerStorageProvider()`, etc.

**Plugins** (out-of-process, capability-gated):
- Categories: `connector`, `workspace`, `automation`, `ui`
- Run as separate Node worker processes via JSON-RPC on stdio
- Manifest-driven with typed capability declarations
- UI slots: `page`, `detailTab`, `dashboardWidget`, `sidebar`, `settingsPage`, `contextMenuItem`, etc.
- Can contribute agent tools (namespaced by plugin ID)
- Hot lifecycle — install/uninstall without server restart
- npm-based distribution with local path dev workflow

**Current limitations:** Plugin UI runs as same-origin JS (not sandboxed). No cloud-ready multi-node distribution yet. Single-tenant, filesystem-persistent.

### 1.6 Authentication

- **Better Auth** library for authenticated modes
- **Device auth** for OpenClaw gateway pairing (RSA key pairs)
- Agent connection strings: server URL + API key + auth instructions

---

## 2. Core Features — Deep Analysis

### 2.1 Org Charts

Paperclip models a **real organizational hierarchy**:

- **CEO** at the top, with VP/Director-level reports cascading down
- Every agent has: `id`, `name`, `role`, `title`, `adapterType`, `adapterConfig`, `status`
- Org position defined by reporting lines
- Each agent publishes a description of responsibilities/capabilities
- **Full visibility across the org** — reporting lines define delegation, not access control

**Cross-team mechanics:**
- Agents can create tasks assigned to agents outside their reporting line
- Task acceptance rules: do it → mark blocked → escalate to manager
- Request depth tracking: integer counting delegation hops
- Billing codes: cost attribution rolls up through the request chain

### 2.2 Budgets & Cost Control

Three-tier cost management:

| Tier | Mechanism | Description |
|------|-----------|-------------|
| **Visibility** | Dashboards | Spend per agent, per task, per project, per company |
| **Soft alerts** | Thresholds | Warn at 80% of budget |
| **Hard ceiling** | Auto-pause | Agent stops at 100%. Board notified, can override |

- Per-agent monthly budgets with automatic stop
- Costs tracked in both **tokens and dollars**
- **Atomic budget enforcement** — task checkout and budget checks are atomic
- **Billing codes** on tasks enable cross-team cost attribution
- Budget delegation: Board → CEO → managers → reports (cascading)
- Budgets can be set to **unlimited**

### 2.3 Governance

Paperclip treats the human operator as the **Board of Directors**:

**Approval Gates (V1):**
- New agent hires require Board approval
- CEO's initial strategic breakdown requires Board approval before execution
- Agents cannot hire without Board permission

**Board Powers (always available):**
- Set/modify company budgets
- Pause/resume any agent
- Pause/resume any work item (task, project, subtask tree, milestone)
- Full project management access (CRUD any task/project/milestone)
- Override any agent decision (reassign, reprioritize, modify)
- Manually change any budget at any level

**Governance with rollback:** Approval gates enforced, config changes revisioned, bad changes rollable back.

### 2.4 Heartbeats

Paperclip's **scheduled agent wake-up system**:

**What Paperclip controls:**
- **When** to fire (schedule/frequency, per-agent)
- **How** to fire (adapter selection + config)
- **What context** to include (thin ping vs. fat payload)

**What Paperclip does NOT control:**
- How long the agent runs or what it does during its cycle

**Context delivery modes:**
- **Fat payload:** Bundles context into heartbeat invocation (for simple/stateless agents)
- **Thin ping:** Wake-up signal only; agent calls Paperclip API for context (for sophisticated agents)

**Trigger events:** Scheduled heartbeats, task assignment, @-mentions, cross-team requests.

**Pause behavior:** Signal → grace period → force-kill → stop future heartbeats.

**Integration levels:** Callable (min) → Status reporting → Fully instrumented (cost + logs + task updates).

### 2.5 Ticket System

Paperclip's task system is the **primary communication and work-tracking channel**:

**Entity hierarchy:**
```
Initiative (company goal)
  → Project (time-bound deliverable)
    → Milestone (stages)
      → Issue (core work unit)
        → Sub-issue
```

**Issue model highlights:**
- Rich fields: `id`, `identifier` (e.g. ENG-123), `title`, `description`, `status`, `priority` (0-4), `estimate`, `dueDate`, `assigneeId`, `goalId`
- **Single-assignee model** — clear ownership
- **Workflow states** — team-specific, within fixed categories: Triage → Backlog → Unstarted → Started → Completed → Cancelled
- **Issue relations** — related, blocks, blocked_by, duplicate
- **Labels** — workspace or team-scoped, with mutually exclusive label groups
- **Threaded comments** with parent/child nesting

**Audit trail:**
- Every instruction, response, tool call, and decision logged
- **Immutable audit log** — append-only, no edits, no deletions
- **Full tool-call tracing** — every API request visible
- **Atomic task checkout** — single assignment with DB-level enforcement

### 2.6 Multi-Company

- Single deployment runs **unlimited companies** with complete data isolation
- Every entity is **company-scoped** — separate data, separate audit trails
- One control plane for a portfolio of autonomous businesses
- **Portable company templates** — export/import with secret scrubbing

### 2.7 Goal Alignment

The **goal hierarchy** ensures every task traces back to the company mission:

```
Company Mission → "Build the #1 AI note-taking app to $1M MRR"
  └─ Project Goal → "Ship collaboration features"
      └─ Agent Goal → "Implement real-time sync"
          └─ Task → "Write WebSocket handler for document updates"
```

- Tasks carry **full goal ancestry** — agents see the "why"
- **Bootstrap sequence:** Human creates Company + Initiatives → Human defines tasks → CEO Agent proposes strategic breakdown → Board approves → Execution begins
- Initiatives define company direction (no standalone "goal" field on Company)

### 2.8 Bring Your Own Agent

Runtime-agnostic — any agent that can receive a heartbeat is hireable:

| Adapter | Mechanism | Notes |
|---------|-----------|-------|
| `openclaw_gateway` | WebSocket gateway | Primary OpenClaw integration |
| `claude` | Claude Code sessions | Direct Claude |
| `codex` | Codex agent | OpenAI Codex |
| `cursor` | Cursor IDE | Local coding agent |
| `bash` | Shell commands | Any CLI tool |
| `http` | HTTP webhook | POST to any endpoint |
| `pi` | Local RPC | With cost tracking |
| `opencode` | OpenCode agent | Alternative coding agent |

**Adapter interface (3 methods):** `invoke()`, `status()`, `cancel()`.

### 2.9 Runtime Skill Injection

- Agents learn Paperclip workflows **at runtime, without retraining**
- **Paperclip SKILL.md** teaches agents how to interact with the API: task CRUD, status reporting, company context, cost reporting, inter-agent communication rules
- Adapter-agnostic — works with any agent runtime
- Default agents ship with the skill pre-loaded

### 2.10 Portable Company Templates

| Mode | Contents | Use Case |
|------|----------|----------|
| **Template export** | Structure: agent definitions, org chart, adapter configs, role descriptions + seed tasks | Blueprint for new company |
| **Snapshot export** | Full state: structure + current tasks, progress, agent status | Restore or fork |

- **Secret scrubbing** — sensitive data stripped on export
- **Collision handling** — safe import into existing instances
- **Clipmart** (coming soon) — marketplace for pre-built company templates

---

## 3. Strengths — What Paperclip Does BETTER Than Mission Control

| Feature | Paperclip | Mission Control | Advantage |
|---------|-----------|-----------------|-----------|
| **Org Charts** | Full hierarchy with reporting lines, roles, titles | Flat task structure | Models real company structure |
| **Multi-Company** | First-class, data-isolated, single deployment | Single scope | Run multiple ventures from one instance |
| **Budget Enforcement** | Atomic, per-agent, hard ceiling + alerts | No built-in cost control | Prevents runaway token spend |
| **Heartbeats** | Scheduled wake-up with context delivery | No scheduled coordination | Agents run 24/7 autonomously |
| **Governance** | Board approval gates, pause/terminate, rollback | No approval workflows | Human oversight baked in |
| **Adapter System** | 8+ adapters with plugin registration | Custom integrations | Drop-in agent support |
| **Plugin System** | Full spec: workers, capabilities, UI slots, tools | No plugin architecture | Extensible without core changes |
| **Goal Alignment** | Mission → project → agent goal → task chain | Flat task model | Every task has "why" context |
| **Audit Trail** | Immutable, append-only, full tool-call tracing | Activity logs | Complete accountability |
| **Company Templates** | Export/import with secret scrubbing | No portability | Share/reuse entire org configs |
| **Mobile Ready** | Responsive UI for managing from phone | Dashboard-dependent | Manage from anywhere |
| **Atomic Execution** | Task checkout + budget enforcement atomic | No atomicity guarantees | No double-work, no runaway spend |

---

## 4. Weaknesses — What Paperclip Does WORSE or Lacks vs Mission Control

| Area | Paperclip Limitation | Mission Control Advantage |
|------|---------------------|--------------------------|
| **Maturity** | Very new (early 2026), community rated 6-7/10, significant gaps remain | More battle-tested, Supabase-backed reliability |
| **External Integrations** | No native email, calendar, CRM, Slack, or messaging integrations | OpenClaw skills ecosystem provides rich integrations (Gmail, Calendar, Drive, etc.) |
| **Knowledge Base** | No built-in knowledge base or document management | OpenClaw workspace files, SOUL.md, MEMORY.md provide persistent knowledge |
| **Conversational Interface** | Explicitly NOT a chatbot — agents have jobs, not chat windows | OpenClaw provides natural conversational interface across Telegram, Discord, etc. |
| **Real-time Communication** | All communication via task comments (no live chat, no @-mentions in real-time) | OpenClaw bridges to Telegram, Discord, WhatsApp for real-time messaging |
| **Deployment Complexity** | Requires Node.js 20+, pnpm, embedded Postgres; more moving parts | Supabase backend is simpler (serverless, managed) |
| **Skill Ecosystem** | Skills limited to Paperclip API interaction (SKILL.md) | OpenClaw has 40+ skills (weather, GitHub, healthcheck, Google Workspace, etc.) |
| **Documentation** | Acknowledged as needing improvement (on roadmap) | Extensive OpenClaw docs and community |
| **Cloud Readiness** | Plugin system not cloud-ready; single-node only | Supabase scales horizontally |
| **Agent Memory** | No built-in agent memory or learning system | OpenClaw has SOUL.md, MEMORY.md, daily memory logs |
| **Workflow Automation** | No visual workflow builder, no drag-and-drop pipelines | OpenClaw cron jobs, heartbeats, event-driven triggers |
| **Multi-channel** | Single UI surface (web dashboard) | OpenClaw: Telegram, Discord, WhatsApp, webchat |

---

## 5. Technical Details

### 5.1 API Structure

- **Framework:** Hono (lightweight, TypeScript-native REST framework — explicitly NOT tRPC for non-TS client compatibility)
- **API style:** REST (not GraphQL, not tRPC)
- **WebSocket:** Used for agent adapters (especially OpenClaw gateway)
- **Health endpoint:** `GET /api/health`
- **Agent endpoints:** `GET /api/agents/:id`, CRUD operations
- **Plugin endpoints:** `POST /api/plugins/install`, lifecycle management
- **OpenClaw endpoints:** `POST /api/companies/:id/openclaw/invite-prompt`
- **Auth:** Cookie-based sessions (Better Auth), API keys for agents

### 5.2 OpenClaw Gateway Adapter Protocol

The `openclaw_gateway` adapter replaces the legacy `openclaw` adapter:

**Connection flow:**
1. Paperclip generates invite prompt → paste into OpenClaw chat
2. OpenClaw agent appears in Paperclip
3. Gateway preflight check: `adapterType=openclaw_gateway`, non-placeholder token, `devicePrivateKeyPem` configured
4. Device auth handshake (RSA key pair, auto-pairing attempt on first task)
5. If auto-pair fails → approve pending device in OpenClaw → retry

**Device auth details:**
- Default: device auth enabled (`disableDeviceAuth=false`)
- RSA key pair stored as `adapterConfig.devicePrivateKeyPem`
- Gateway URL format: `ws://...` or `wss://...`
- Token: `x-openclaw-token` header, minimum 16 chars

**Test cases:**
- Case A: Manual issue assignment → agent completes task
- Case B: Agent sends message via message tool + comments on issue
- Case C: New session creates issues (skill persistence across sessions)

### 5.3 Concurrency Model

- **Atomic task checkout:** Single assignment with database-level enforcement
- **No optimistic locking or CRDTs** needed — single-assignment model prevents conflicts at design level
- If two agents try to claim a task, one fails with error identifying the other agent

### 5.4 Plugin Runtime

- **Process model:** One worker process per installed plugin (Node.js)
- **Communication:** JSON-RPC on stdio
- **Manifest validation:** At install time, rejects incompatible API versions
- **Capability enforcement:** Worker-side gating of host API calls
- **Hot lifecycle:** Install/uninstall without server restart
- **Local dev:** File watching with auto-restart on rebuild

### 5.5 Default Agents

Paperclip ships reference implementations:
- **Default Agent** — Claude Code/Codex loop with Paperclip skill pre-loaded
- **Default CEO** — Extends Default Agent with strategic planning, delegation, progress review

Agent behavior is **config-driven** (not hardcoded) — adapter config defines what the agent does on each heartbeat.

---

## 6. Integration Potential — How Paperclip Features Could Enhance Mission Control

### 6.1 High-Value Additions (Recommended)

| Paperclip Feature | Integration Approach | Value |
|-------------------|---------------------|-------|
| **Budget Enforcement** | Add per-agent monthly budget fields to Supabase `agents` table. Hard stop at limit. Soft warn at 80%. | Prevents runaway OpenClaw API costs — critical for production |
| **Heartbeats** | Leverage OpenClaw's existing heartbeat system + cron. Add scheduled context delivery from MC. | Agents work autonomously without manual triggering |
| **Atomic Task Checkout** | Add `checked_out_by` + `checked_out_at` fields to tasks. DB-level enforcement. | Prevents multiple agents working the same task |
| **Goal Alignment Chain** | Add `initiative` → `project` → `agent_goal` → `task` hierarchy to MC schema | Agents understand "why" behind every task |
| **Governance Gates** | Add approval status to key operations (agent creation, strategy changes) | Human oversight for critical decisions |

### 6.2 Medium-Value Additions

| Paperclip Feature | Integration Approach | Value |
|-------------------|---------------------|-------|
| **Company Templates** | Export/import MC project + agent configs as JSON | Shareable, version-controlled org setups |
| **Adapter Abstraction** | Define adapter interface (`invoke`, `status`, `cancel`) for MC agents | Support more agent runtimes beyond OpenClaw |
| **Immutable Audit Log** | Append-only audit table for all agent actions | Full accountability and debugging |
| **Cross-Agent Delegation** | Task creation API that routes to appropriate agent based on capabilities | Agents delegate work to specialists |

### 6.3 Lower Priority (Future)

| Paperclip Feature | Notes |
|-------------------|-------|
| **Multi-Company** | Only useful if managing multiple ventures — not current need |
| **Plugin System** | Large undertaking; OpenClaw skills already serve similar purpose |
| **Portable Templates** | Nice-to-have; MC can export Supabase data as JSON |
| **Clipmart Marketplace** | Ecosystem play, not core functionality |

### 6.4 What NOT to Adopt

- **Removing conversational interface** — Paperclip's "not a chatbot" stance is wrong for our use case. Telegram/Discord access is essential.
- **Replacing OpenClaw skills** — Our 40+ skills (Gmail, Calendar, GitHub, etc.) are far richer than Paperclip's SKILL.md.
- **Switching from Supabase** — Embedded Postgres adds deployment complexity; Supabase is managed and scales.
- **Strict single-assignee** — Our workflow benefits from collaborative task handling.

---

## 7. Summary Assessment

### Paperclip is:
✅ A sophisticated **organizational orchestration layer** for AI agent companies  
✅ Best-in-class for **budget control, governance, and goal alignment**  
✅ Well-architected with clean separation: control plane ↔ execution adapters  
✅ Genuinely innovative in modeling **companies** rather than workflows  
✅ Growing rapidly with active community and clear roadmap  

### Paperclip is NOT:
❌ Production-ready (community rates 6-7/10, many gaps)  
❌ A replacement for conversational agent interfaces  
❌ A replacement for rich skill/integration ecosystems  
❌ Suitable for cloud/horizontal deployment yet  
❌ A good fit for single-agent or simple task-tracking use cases  

### Recommendation:
**Cherry-pick the best ideas** (budget enforcement, atomic checkout, goal alignment, governance gates, heartbeat scheduling) and integrate them into Mission Control. Do NOT replace Mission Control with Paperclip — instead, let Paperclip's architecture inform MC's evolution while keeping our strengths (conversational interface, rich skills, Supabase backend, multi-channel access).

---

*Report generated: 2026-03-17 by Kiro (Architect)*
*Sources: GitHub repo, paperclip.ing/docs, doc/SPEC.md, doc/GOAL.md, doc/TASKS.md, doc/DATABASE.md, doc/OPENCLAW_ONBOARDING.md, doc/DEPLOYMENT-MODES.md, doc/plugins/PLUGIN_SPEC.md, doc/plugins/PLUGIN_AUTHORING_GUIDE.md, README.md*
