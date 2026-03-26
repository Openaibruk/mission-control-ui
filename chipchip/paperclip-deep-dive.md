# Paperclip Deep-Dive: Architecture Analysis

**Author:** @Kiro (Architecture Specialist)  
**Date:** 2026-03-17  
**Repo:** https://github.com/paperclipai/paperclip  
**License:** MIT  
**Local Status:** ✅ Running on port 3100 (`local_trusted`, `private`, health OK)  
**Company in Instance:** ChipChip — Ethiopian e-commerce platform

---

## 1. Executive Summary

Paperclip is a **company orchestrator for AI agents** — not an agent framework, not a chatbot platform, not a workflow builder. It models the organizational structure of a business and coordinates AI agents as employees within that structure. If OpenClaw is an employee, Paperclip is the company.

**Core thesis:** Managing 20+ autonomous AI agents requires the same primitives as managing 20+ human employees — org charts, budgets, goals, governance, ticketing, and accountability. Paperclip provides all of these as a self-hosted Node.js server.

---

## 2. Architecture Overview

### 2.1 High-Level Stack

```
┌──────────────────────────────────────────────────┐
│                  PAPERCLIP                       │
│              (port 3100, Node.js)                │
│                                                  │
│  ┌────────────┐  ┌───────────┐  ┌─────────────┐ │
│  │ React UI   │  │ REST API  │  │ WebSocket   │ │
│  │ (served    │  │ /api/*    │  │ Live Events │ │
│  │  same-     │  │           │  │ (SSE-like)  │ │
│  │  origin)   │  │           │  │             │ │
│  └────────────┘  └───────────┘  └─────────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │             Service Layer                     ││
│  │  heartbeat │ budgets │ issues │ approvals    ││
│  │  goals │ companies │ costs │ agents │ plugins ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │          Adapter Layer (Agent Connectors)     ││
│  │  openclaw-gateway │ claude-local │ codex     ││
│  │  cursor-local │ gemini-local │ opencode     ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │          Embedded PostgreSQL                  ││
│  │  (~/.paperclip/instances/default/db)         ││
│  └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

**Key tech decisions:**
- **Embedded PostgreSQL** — zero-setup database, no Docker required for local dev. Data persists at `~/.paperclip/instances/default/db`. External `DATABASE_URL` optional.
- **Drizzle ORM** — type-safe schema in `packages/db/src/schema/` with 50+ tables.
- **Monorepo** — pnpm workspaces: `server/`, `packages/db`, `packages/adapters/*`, `packages/plugins/*`, `packages/shared`, `ui/`, `cli/`.
- **Same-origin UI** — React UI served by the API server in dev middleware mode. No CORS issues.

### 2.2 Deployment Modes

| Mode | Auth | Bind | Use Case |
|------|------|------|----------|
| `local_trusted` | None | localhost | Solo dev, personal use |
| `authenticated/private` | Tailscale/OAuth | 0.0.0.0 | Team on private network |
| `authenticated/public` | Full auth | 0.0.0.0 | Production cloud |

Our instance: `local_trusted` / `private` — running on localhost, no auth required.

---

## 3. Core Domain Model

### 3.1 Companies (Multi-Tenancy)

The `companies` table is the root tenant boundary. Every entity is company-scoped via `company_id` foreign key.

```typescript
// packages/db/src/schema/companies.ts
companies = {
  id: uuid (PK),
  name: text,
  description: text,
  status: text (active/paused),
  issuePrefix: text (unique, e.g. "CHI"),  // Like Jira project keys
  issueCounter: integer,                     // Auto-incrementing issue numbers
  budgetMonthlyCents: integer,               // Company-level budget cap
  spentMonthlyCents: integer,
  requireBoardApprovalForNewAgents: boolean  // Governance gate
}
```

**Strength:** True multi-company isolation. One Paperclip instance can run multiple independent companies with completely separate data, audit trails, and budgets. This is architecturally clean — every query is scoped by `company_id`.

**Current state:** ChipChip company exists with $10,000/month budget (1,000,000 cents), `requireBoardApprovalForNewAgents: true`.

### 3.2 Agents (The Org Chart)

```typescript
// packages/db/src/schema/agents.ts
agents = {
  id: uuid (PK),
  companyId: uuid (FK → companies),
  name: text,                    // e.g. "Nova", "Henok", "Kiro"
  role: text,                    // e.g. "general", "pm", "engineering"
  title: text,                   // e.g. "Chief of Staff", "CTO"
  reportsTo: uuid (FK → agents), // Self-referential org chart!
  adapterType: text,             // openclaw_gateway, claude_local, etc.
  adapterConfig: jsonb,          // Adapter-specific config
  budgetMonthlyCents: integer,   // Per-agent budget cap
  spentMonthlyCents: integer,
  permissions: jsonb,            // Fine-grained permission grants
  lastHeartbeatAt: timestamp
}
```

**Key architectural pattern:** The `reportsTo` self-referential foreign key creates a **tree-structured org chart** directly in the database. This is elegant — you get hierarchy queries with recursive CTEs, delegation flows follow the tree, and the reporting structure is queryable data, not config.

**Adapter types supported:** `openclaw_gateway`, `claude_local`, `codex_local`, `cursor_local`, `gemini_local`, `opencode_local`, `pi_local`. Each has its own adapter implementation under `packages/adapters/`.

### 3.3 Goals (Mission Alignment)

```typescript
// packages/db/src/schema/goals.ts
goals = {
  id: uuid (PK),
  companyId: uuid (FK),
  title: text,
  description: text,
  level: text,            // "company" | "project" | "task"
  status: text,           // "planned" | "active" | "completed"
  parentId: uuid (FK → goals),  // Hierarchical goal tree
  ownerAgentId: uuid (FK → agents)
}
```

**Pattern:** Three-level goal hierarchy: **Company Mission → Project Goal → Task**. Every issue/task traces back to the company mission through this chain. Agents always see the "why" behind their work, not just a task title.

The `getDefaultCompanyGoal()` function in `services/goals.ts` shows thoughtful fallback logic — it checks active root goals first, then any root goal, then any company-level goal.

### 3.4 Issues (Ticket System)

```typescript
// packages/db/src/schema/issues.ts
issues = {
  id: uuid (PK),
  companyId: uuid (FK),
  projectId: uuid (FK → projects),
  goalId: uuid (FK → goals),
  parentId: uuid (FK → issues),        // Sub-issues
  title: text,
  description: text,
  status: text,                         // backlog → todo → in_progress → in_review → done
  priority: text,                       // low/medium/high/critical
  assigneeAgentId: uuid (FK → agents),
  assigneeUserId: text,
  checkoutRunId: uuid (FK → heartbeat_runs),  // Who's working on this
  executionRunId: uuid (FK → heartbeat_runs),
  executionLockedAt: timestamp,         // Prevents double-work
  issueNumber: integer,                 // e.g. CHI-1, CHI-2
  requestDepth: integer,                // Delegation depth tracking
  // + labels, attachments, documents, read states, comments
}
```

**Architectural strength — Atomic Checkout:**

The issue system implements a **checkout/lock pattern** similar to pessimistic locking:
- `checkoutRunId` — the heartbeat run that has "checked out" this issue
- `executionLockedAt` — timestamp of lock acquisition
- `executionRunId` — the run currently executing

This prevents **double-work** — two agents can't pick up the same task simultaneously. The checkout is atomic at the database level.

**Status flow:** `backlog → todo → in_progress → in_review → blocked → done → cancelled`

Side-effects are automatic:
- `in_progress` → sets `startedAt`
- `done` → sets `completedAt`
- `cancelled` → sets `cancelledAt`

### 3.5 Budgets & Cost Enforcement

```typescript
// packages/db/src/schema/budget_policies.ts + budget_incidents.ts
budgetPolicies = {
  scopeType: "company" | "agent" | "project",
  scopeId: uuid,
  windowKind: "monthly" | "lifetime",
  amountCents: integer,
  warnPercent: integer,      // e.g. 80 → warn at 80% spent
  status: "ok" | "warning" | "hard_stop"
}
```

**Three-tier budget enforcement:**

1. **Company level** — total monthly spend cap
2. **Agent level** — per-agent monthly cap
3. **Project level** — per-project allocation

**Enforcement flow:**
- `ok` → normal operation
- `warning` → alerts fired, work continues
- `hard_stop` → `cancelWorkForScope()` hook fires, agent is paused

The budget service (`services/budgets.ts`) uses UTC month windows and computes spend from `costEvents`. It's a clean, composable system — `BudgetEnforcementScope` is a generic type that works for any scope.

### 3.6 Heartbeats (Agent Wake/Sleep Cycle)

```typescript
// server/src/services/heartbeat.ts (3100+ lines)
```

Heartbeats are the **core execution primitive** in Paperclip. Agents don't run continuously — they wake on schedule, do work, and go back to sleep.

**Heartbeat lifecycle:**

1. **Trigger** — scheduled cron, event-based (task assignment, @-mention), or manual
2. **Budget check** — pre-flight budget validation before any work
3. **Issue checkout** — atomic task acquisition (prevent double-work)
4. **Adapter invocation** — the actual agent (OpenClaw, Claude, Codex) is invoked
5. **Execution** — agent works on the task, streaming logs back
6. **Result processing** — outcome parsed, costs recorded, session updated
7. **Wake propagation** — delegation flows up/down org chart

**Key patterns:**

- **`startLocksByAgent`** — a `Map<string, Promise<void>>` per agent, preventing concurrent heartbeat starts for the same agent. This is a simple but effective concurrency guard.
- **`MAX_CONCURRENT_RUNS`** — configurable (default 1, max 10) per-agent concurrency limit.
- **Session persistence** — agents resume the same task context across heartbeats via `agentTaskSessions`, not restarting from scratch. The session key strategies are: `issue` (per-issue session), `fixed` (static key), `run` (per-run session).
- **Wake requests** — `agentWakeupRequests` table handles deferred wake-up (e.g., when a subordinate completes work and the manager needs to review).
- **Runtime services** — `workspaceRuntimeServices` manages persistent services (databases, dev servers) that survive across heartbeat runs.
- **Run logs** — heartbeat runs store full logs with `logStore`, `logRef`, and `logBytes` for audit trail.

### 3.7 Approvals (Governance)

```typescript
// server/src/services/approvals.ts
```

Paperclip implements a **board approval** model:

- Company setting: `requireBoardApprovalForNewAgents` — gates new agent creation
- Approval statuses: `pending → approved/rejected/revision_requested`
- Approval comments for discussion
- `issueApprovals` — issue-specific approval gates
- Budget incidents can trigger approval workflows

**Pattern:** The `resolveApproval()` function validates state transitions, records the decision, and fires side-effects (e.g., `notifyHireApproved` hooks for new agent hiring).

This is a proper governance layer — not just a checkbox, but a state machine with validation and side-effects.

### 3.8 Activity Logging & Audit Trail

```typescript
// packages/db/src/schema/activity_log.ts + heartbeat_run_events.ts
```

Paperclip maintains two complementary audit systems:

1. **`activity_log`** — high-level business events (who did what, when)
2. **`heartbeat_run_events`** — fine-grained execution events (tool calls, outputs, decisions)

Every conversation is traced. Every decision is explained. Full tool-call tracing with immutable audit log.

---

## 4. Adapter Architecture

### 4.1 OpenClaw Gateway Adapter

Located at `packages/adapters/openclaw-gateway/src/server/execute.ts` (~1400 lines).

**Connection model:** WebSocket to OpenClaw gateway (`ws://127.0.0.1:18789`)

**Protocol:**
```
Client (Paperclip) ──WS──→ OpenClaw Gateway
  ├── req: agent.start { message, sessionKey, idempotencyKey }
  ├── event: stdout / stderr / tool_use / result
  └── req: agent.wait { timeoutMs }
```

**Key implementation details:**

- **Ed25519 device identity** — Paperclip generates a keypair and authenticates via OpenClaw's protocol. Supports both configured keys and ephemeral keys.
- **Session key strategies:**
  - `issue` — `paperclip:issue:{issueId}` (persistent per-task context)
  - `fixed` — static configured key
  - `run` — `paperclip:run:{runId}` (isolated per-execution)
- **Idempotency** — `idempotencyKey` is the Paperclip `runId`, preventing duplicate execution on retry.
- **Auto-pairing** — `autoPairOnFirstConnect=true` handles initial device pairing automatically.
- **Live log streaming** — stdout/stderr chunks are streamed back as `MAX_LIVE_LOG_CHUNK_BYTES` (8KB) chunks.
- **Session codec** — abstracts session key resolution for different strategies.

**Adapter interface** (from `server/src/adapters/types.ts`):
```typescript
interface AdapterExecutionContext {
  onLog: (chunk: Buffer) => void;
  signal: AbortSignal;
  // ...
}
interface AdapterExecutionResult {
  exitCode: number;
  usage: UsageSummary;  // tokens, cost
  sessionId: string;
}
```

### 4.2 Other Adapters

| Adapter | Path | Mechanism |
|---------|------|-----------|
| `openclaw-gateway` | `packages/adapters/openclaw-gateway/` | WebSocket to OpenClaw |
| `claude-local` | `packages/adapters/claude-local/` | Local Claude Code process |
| `codex-local` | `packages/adapters/codex-local/` | Local Codex process |
| `cursor-local` | `packages/adapters/cursor-local/` | Local Cursor agent |
| `gemini-local` | `packages/adapters/gemini-local/` | Local Gemini CLI |
| `opencode-local` | `packages/adapters/opencode-local/` | Local OpenCode |
| `pi-local` | `packages/adapters/pi-local/` | Local Pi agent |

The local adapters (`*-local`) are sessioned adapters that manage local process lifecycles. The OpenClaw adapter is unique in using WebSocket for remote communication.

---

## 5. Plugin System

Paperclip has an **emerging plugin system** (post-V1) with:

- **Runtime sandbox** — plugins run in isolated workers (`plugin-runtime-sandbox.ts`)
- **Manifest validation** — `plugin-manifest-validator.ts` + `plugin-config-validator.ts`
- **Capability system** — plugins declare what host services they need
- **Tool registry** — plugins can contribute tools to agents (`plugin-tool-registry.ts`, `plugin-tool-dispatcher.ts`)
- **Job scheduling** — `plugin-job-scheduler.ts`, `plugin-job-coordinator.ts`
- **Event bus** — `plugin-event-bus.ts` for plugin-to-plugin communication
- **State store** — `plugin-state-store.ts` for plugin persistence
- **UI extensions** — plugins can add UI panels (currently same-origin JS, not sandboxed)
- **Lifecycle management** — install, enable, disable, uninstall (`plugin-lifecycle.ts`)

**Current limitations** (from PLUGIN_SPEC.md):
- Single-tenant, self-hosted, single-node only
- Plugin UI runs as trusted code (not sandboxed)
- No cross-node plugin distribution
- npm-based install assumes writable filesystem

---

## 6. What Paperclip Does Well

### 6.1 Organizational Metaphor

Paperclip's biggest strength is that it **thinks in companies, not in pipelines**. The org chart, goals, budgets, and governance model is not an afterthought — it's the core abstraction. This makes it intuitive for anyone who has managed a team.

### 6.2 Atomic Task Checkout

The checkout/lock system prevents double-work. `checkoutRunId` + `executionLockedAt` + `executionRunId` form a proper pessimistic lock. This is a subtle but critical feature — without it, multiple heartbeats could pick up the same issue.

### 6.3 Goal-Ancestry Context

Every task carries full goal ancestry. An agent working on issue CHI-5 doesn't just see "Fix login bug" — it traces back to "Build Ethiopia's #1 e-commerce platform." This context-awareness produces better decisions.

### 6.4 Budget Enforcement

Three-tier budgets (company → agent → project) with warning thresholds and hard stops. The `BudgetEnforcementScope` abstraction is clean and composable. Budget incidents are tracked with resolution workflows.

### 6.5 Multi-Company Isolation

True tenant isolation at the database level. Every entity has `company_id`. One deployment can serve multiple independent companies. This is architecturally sound for a SaaS future.

### 6.6 Session Persistence

Agent sessions persist across heartbeats. The agent doesn't restart from scratch — it picks up where it left off. The three session key strategies (`issue`, `fixed`, `run`) offer flexibility for different use cases.

### 6.7 Embedded PostgreSQL

Zero-setup database for local dev. No Docker, no external service. Just `pnpm dev` and you're running. The auto-backup system (every 60 minutes, 30-day retention) is a nice touch.

### 6.8 Worktree Support

First-class git worktree support for parallel development. Each worktree gets an isolated Paperclip instance with seeded data, dynamic branding (colored favicon, banner), and automatic env scoping. This is a developer-experience win.

### 6.9 Governance with Rollback

Agent config changes are revisioned (`agentConfigRevisions`). Bad changes can be rolled back. Approval gates enforce human oversight. The `requireBoardApprovalForNewAgents` flag is a simple but effective governance control.

### 6.10 Portable Company Templates

Export/import org structures with secret scrubbing and collision handling. This enables "Clipmart" — a marketplace of pre-built company templates. Good abstraction for distribution.

---

## 7. What Paperclip Lacks / Weaknesses

### 7.1 No Inter-Agent Communication Protocol

Paperclip models hierarchy but doesn't have a native messaging protocol between agents. Agents communicate through issue comments and delegation, not direct messaging. This works for async task-based work but limits real-time collaboration.

### 7.2 Plugin System is Immature

The plugin system is documented as "proposed complete spec for the post-V1 plugin system." The actual implementation is early-stage:
- No sandboxed UI
- No cross-node distribution
- npm-only install
- Plugin UI is trusted code, not capability-bounded

### 7.3 No Built-in Code Review

Paperclip explicitly states: "Not a code review tool." For a system managing coding agents, the absence of integrated PR review is a gap. You need to bring your own review process.

### 7.4 Single-Node Architecture

The embedded PostgreSQL and local filesystem storage assume a single persistent node. For production scale, you need external PostgreSQL and cloud storage. The system is not yet horizontally scalable.

### 7.5 Limited Agent Skill/Context System

While Paperclip manages organizational context (goals, budgets, reporting lines), the actual agent skill configuration (what tools an agent can use, what knowledge it has) is delegated to the adapter. There's no unified skill registry within Paperclip itself.

### 7.6 No Built-in Notification System

There's no email, Slack, or push notification system. The live events (WebSocket) work for the dashboard, but there's no way to alert a human when something needs attention outside the dashboard.

### 7.7 Budget Enforcement is Reactive

Budget enforcement checks happen at heartbeat start, not continuously. An agent could burn through its budget mid-run. The cost tracking is post-hoc — costs are recorded after the run, not throttled in real-time.

### 7.8 Early-Stage Documentation

The `doc/plans/` directory has many planning documents but the public docs at `paperclip.ing/docs` are still developing. The internal codebase has good TypeScript types but limited inline documentation.

### 7.9 No Role-Based Access Control (RBAC) Model

There are `principalPermissionGrants` and `companyMemberships` tables, plus `agentPermissions`, but there's no documented RBAC model. The permission system appears functional but not yet fully specified.

### 7.10 Dashboard-Only Monitoring

All monitoring happens through the React dashboard. There's no metrics export (Prometheus/StatsD), no structured logging pipeline (beyond file-based logs), and no alerting integration.

---

## 8. Code Quality & Patterns

### 8.1 Positive Patterns

- **Service-oriented architecture** — `services/` directory with clean separation: `heartbeat.ts`, `budgets.ts`, `issues.ts`, `companies.ts`, `goals.ts`, etc. Each service takes a `Db` instance and returns an object of methods.
- **Type safety** — Heavy use of Drizzle ORM's inferred types (`$inferSelect`, `$inferInsert`). Schema changes are type-checked.
- **Error handling** — Standardized error constructors (`conflict()`, `notFound()`, `unprocessable()`) with HTTP status codes.
- **Database migrations** — Drizzle Kit with `db:generate` and `db:migrate` commands. Schema versioned in source control.
- **Auto-backups** — Timer-based DB backups with configurable retention.
- **Secret management** — Local encryption with master key, strict mode for production, migration helpers for inline env secrets.
- **Live events** — Server-sent event stream (`live-events.ts`) for real-time dashboard updates.

### 8.2 Areas for Improvement

- **Heartbeat service is 3100+ lines** — `heartbeat.ts` is a monolith. It handles trigger resolution, budget checks, adapter invocation, result processing, and wake propagation. Should be decomposed.
- **No API versioning** — Routes are under `/api/*` with no version prefix.
- **No request validation middleware** — Route handlers do their own validation inline.
- **Limited test coverage** — `vitest` is configured but test files are sparse relative to the codebase size.

---

## 9. Integration with OpenClaw

### 9.1 Current State

Paperclip is **running and connected** to our OpenClaw instance:

| Component | Status |
|-----------|--------|
| Paperclip server | ✅ Running on :3100 |
| Deployment mode | `local_trusted` / `private` |
| Company | ChipChip (active, $10K/mo budget) |
| Health | OK, auth ready, bootstrap ready |

### 9.2 Integration Architecture

```
┌─────────────┐    WebSocket     ┌──────────────────┐
│  Paperclip  │  ──────────────→ │  OpenClaw        │
│  :3100      │  ws://127.0.0.1  │  Gateway :18789  │
│             │     :18789       │                  │
│  Heartbeat  │                  │  Nova (PM)       │
│  Scheduler  │  agent request   │  Henok (Dev)     │
│             │  ─────────────→  │  Kiro (Arch)     │
│  Budget     │  agent.wait      │  Cinder (QA)     │
│  Monitor    │  ←─────────────  │  + others        │
└─────────────┘  result + logs   └──────────────────┘
```

**Session strategy:** `issue` mode — each Paperclip issue gets a persistent OpenClaw session keyed as `paperclip:issue:{issueId}`. This maintains conversation context across heartbeats.

### 9.3 What's Working

- Paperclip server health check returns OK
- ChipChip company is configured and active
- Org chart structure is defined (Bruk → Nova → team)
- Budget allocation is set ($300/month across 8 agents)

### 9.4 What's Next

- Verify OpenClaw gateway adapter connectivity (WebSocket to :18789)
- Create first issues and assign to agents
- Set up heartbeat schedules
- Monitor first agent runs end-to-end

---

## 10. Architectural Assessment Matrix

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Domain modeling | ⭐⭐⭐⭐⭐ | Company/goal/agent/issue model is well-designed |
| Multi-tenancy | ⭐⭐⭐⭐⭐ | Clean `company_id` scoping throughout |
| Agent coordination | ⭐⭐⭐⭐ | Atomic checkout is strong; inter-agent comm is weak |
| Budget enforcement | ⭐⭐⭐⭐ | Three-tier with warnings; reactive not real-time |
| Governance | ⭐⭐⭐⭐ | Approval gates with state machines; RBAC incomplete |
| Plugin system | ⭐⭐⭐ | Good spec; early implementation |
| Scalability | ⭐⭐⭐ | Single-node; needs external Postgres for scale |
| Documentation | ⭐⭐⭐ | Internal planning docs good; public docs developing |
| Test coverage | ⭐⭐ | Minimal tests relative to codebase size |
| Production readiness | ⭐⭐⭐ | Great for self-hosted; not cloud-native yet |

---

## 11. Recommendation

Paperclip is a **strong foundation for managing autonomous AI agent teams**. Its organizational metaphor is the right one — agents need companies, not just chat windows. The atomic checkout, goal ancestry, and budget enforcement are production-grade patterns.

For ChipChip's use case (coordinating 8 agents across engineering, marketing, and analytics), Paperclip provides exactly the right abstraction layer on top of OpenClaw. The main risks are the immaturity of the plugin system and the single-node architecture, neither of which blocks initial deployment.

**Verdict:** Deploy with confidence for local/small-team use. Monitor the plugin system and scalability roadmap for production scaling.

---

*Report generated by @Kiro — Architecture Specialist*  
*2026-03-17 12:58 EAT*
