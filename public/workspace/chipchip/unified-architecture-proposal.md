# Unified Mission Control Architecture Proposal

**Author:** @Nova (Chief of Staff / Architecture Lead)
**Date:** 2026-03-17
**Status:** Proposal — Pending Review

---

## Executive Summary

Mission Control (MC) is our real-time operations dashboard backed by Supabase, Next.js, and Google Drive sync. Paperclip is an AI company orchestrator that adds org charts, budgets, governance, goal hierarchies, heartbeat scheduling, and ticket threading. Neither replaces the other — they're complementary layers.

This proposal merges the best of both into a **single, unified Mission Control** that grows from what we have today into a full AI company operating system.

---

## Current State Assessment

### What Mission Control Does Well (Keep)

| Capability | Status | Notes |
|---|---|---|
| **Supabase backend** | ✅ Working | Tasks, agents, activities, notifications, feedback tables live |
| **Real-time dashboard** | ✅ Working | Overview, projects, agents, activity feed, kanban board |
| **Google Drive sync** | ✅ Working | File output tracking, Drive API integration |
| **CLI interface** | ✅ Working | `scripts/mc.js` — tasks, agents, messages, documents, activities, notifications |
| **Agent chat** | ✅ Working | Nova widget for direct agent interaction |
| **Feedback system** | ✅ Working | Bug/feature/improvement with IPMR flagging |
| **Heartbeat trigger** | ✅ Working | POST endpoint to trigger OpenClaw heartbeat |
| **Token cost tracking** | ✅ Working | Per-agent cost monitoring |
| **Driver onboarding** | ✅ Working | Kanban-stage pipeline for logistics ops |

### What Mission Control Lacks (Add from Paperclip)

| Capability | Gap | Impact |
|---|---|---|
| **Org chart** | No org hierarchy, no reporting lines | Can't route tasks by authority, no delegation chains |
| **Budgets & governance** | No per-agent budgets, no spend enforcement | Uncontrolled token costs, no board approval flow |
| **Goal hierarchy** | Flat task list, no "why" traceability | Tasks disconnected from company mission |
| **Ticket threading** | No conversation trace per task | Lost context on how decisions were made |
| **Heartbeat scheduling** | Manual trigger only | No automated periodic agent wake-up |
| **Agent coordination patterns** | Agents don't know about each other | No delegation, escalation, or handoff protocols |

### What Paperclip Lacks (Keep from MC)

| Capability | MC Has It | Paperclip Gap |
|---|---|---|
| Rich dashboard UI | ✅ Next.js app with views | Paperclip UI is basic |
| Supabase cloud backend | ✅ Scalable, real-time | Paperclip uses embedded Postgres |
| Google Drive integration | ✅ File sync | Not present |
| CLI tooling | ✅ `mc.js` | Not present |
| Feedback/bug tracking | ✅ Full system | Not present |
| Custom domain pages | ✅ Agents, projects, onboarding | Not present |

---

## Proposed Unified Architecture

### Data Model Extensions

#### 1. Org Chart (New Table: `org_nodes`)

```sql
CREATE TABLE org_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL UNIQUE REFERENCES agents(name),
  role TEXT NOT NULL,
  parent_id UUID REFERENCES org_nodes(id),
  department TEXT,
  level INTEGER NOT NULL DEFAULT 0,
  permissions JSONB DEFAULT '{}'::jsonb,  -- { can_delegate, can_approve, budget_limit }
  created_at TIMESTAMPTZ DEFAULT now()
);
```

This gives us a proper org tree:
```
Bruk (Board/Owner, level 0)
 └── Nova (CoS, level 1, can_delegate=true, can_approve=true)
      ├── Henok (CTO, level 2, can_delegate=true)
      │    └── Cinder (QA, level 3)
      ├── Kiro (Architect, level 2)
      ├── Nahom (Marketing, level 2, can_delegate=true)
      │    ├── Bini (Content, level 3)
      │    └── Lidya (Design, level 3)
      └── Amen (Analytics, level 2)
```

#### 2. Budgets (New Table: `budgets`)

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL REFERENCES agents(name),
  period TEXT NOT NULL DEFAULT 'monthly',  -- daily, weekly, monthly
  budget_tokens INTEGER NOT NULL,
  spent_tokens INTEGER DEFAULT 0,
  budget_usd NUMERIC(10,2),
  spent_usd NUMERIC(10,2) DEFAULT 0,
  hard_limit BOOLEAN DEFAULT false,  -- true = block at limit, false = warn
  period_start DATE NOT NULL DEFAULT CURRENT_DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3. Goals (New Table: `goals`)

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('company', 'project', 'agent')),
  parent_goal_id UUID REFERENCES goals(id),
  owner_agent TEXT REFERENCES agents(name),
  project_id UUID REFERENCES projects(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'abandoned')),
  metrics JSONB DEFAULT '{}'::jsonb,  -- { target, current, unit }
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Every task gets an optional `goal_id` FK → full traceability from company mission to individual task.

#### 4. Ticket Threads (New Table: `ticket_threads`)

```sql
CREATE TABLE ticket_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'agent', 'system')),
  agent_name TEXT,
  content TEXT NOT NULL,
  tool_calls JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Every task action gets a threaded log: who said what, which tools were called, what the results were.

#### 5. Heartbeat Schedules (New Table: `heartbeat_schedules`)

```sql
CREATE TABLE heartbeat_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL REFERENCES agents(name),
  cron_expression TEXT NOT NULL,  -- e.g., '*/15 * * * *'
  task_template TEXT,  -- Prompt template for the heartbeat
  enabled BOOLEAN DEFAULT true,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 6. Governance / Approvals (Enhance existing)

Add to `tasks` table:
```sql
ALTER TABLE tasks ADD COLUMN goal_id UUID REFERENCES goals(id);
ALTER TABLE tasks ADD COLUMN ticket_thread_id UUID REFERENCES ticket_threads(id);
ALTER TABLE tasks ADD COLUMN budget_impact_tokens INTEGER DEFAULT 0;
ALTER TABLE tasks ADD COLUMN escalation_path UUID[];  -- Array of agent names to escalate to
ALTER TABLE tasks ADD COLUMN approval_state JSONB DEFAULT '{}'::jsonb;
```

---

## Feature Additions

### A. Org Chart View (`/org`)
- Interactive org tree (D3 or React Tree)
- Click a node → see their tasks, budget, activity
- Drag to reassign reporting lines
- Shows delegation chains and escalation paths

### B. Budget Dashboard (New tab or section)
- Per-agent spend vs. budget (progress bars)
- Period-over-period comparison
- Hard limit enforcement (block agent when budget exceeded)
- Company-wide spend summary
- Cost forecasting based on current rate

### C. Goal Tracker (`/goals`)
- Tree view: Company → Project → Agent → Task
- Progress bars per goal
- Click a goal → see all tasks contributing to it
- Deadlines and milestone tracking
- Metrics: target vs. actual

### D. Ticket Thread View (Enhanced task detail)
- Every task opens into a threaded view
- Chronological log of agent actions
- Tool calls with inputs/outputs
- Agent reasoning (if available from model)
- Human annotations and decisions
- Export thread to Google Drive

### E. Heartbeat Scheduler UI
- Configure per-agent wake schedules
- Visual timeline of past/future heartbeats
- Enable/disable per agent
- Template editor for heartbeat prompts
- Status: last run result, next scheduled

### F. Governance & Approvals (Enhanced)
- Approval queue for high-impact actions
- Budget threshold alerts
- Board override controls (Bruk can pause/kill agents)
- Audit log of all governance actions

### G. Agent Coordination Patterns
- **Delegation:** Agent A can assign subtasks to agents below in org
- **Escalation:** Blocked tasks auto-escalate up org tree
- **Handoff:** Tasks move between agents with full context
- **Standup:** Automated daily briefing from all active agents

---

## What to Remove / Deprecate

| Item | Reason |
|---|---|
| Paperclip embedded Postgres | We use Supabase — no need for a second DB |
| Paperclip WebSocket gateway adapter | We use OpenClaw's built-in heartbeat + cron — simpler |
| Paperclip standalone UI | Merge relevant views into MC dashboard |
| Paperclip separate server (port 3100) | Everything runs in MC (Next.js) |

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)
**Goal:** Database schema + core data structures

- [ ] Create `org_nodes` migration — build org chart
- [ ] Create `goals` migration — goal hierarchy
- [ ] Add `goal_id` FK to tasks table
- [ ] Create `heartbeat_schedules` migration
- [ ] Seed org chart from Paperclip integration guide
- [ ] Update `scripts/mc.js` with new CRUD commands

**Deliverable:** New tables live, CLI can manage org/goals/heartbeats

### Phase 2: Budgets & Governance (Week 2-3)
**Goal:** Cost control + approval workflows

- [ ] Create `budgets` migration + seed from Paperclip budget table
- [ ] Build budget dashboard component (`BudgetWidget.tsx`)
- [ ] Add budget enforcement to heartbeat → block over-limit agents
- [ ] Enhance approvals view with budget-aware approval flow
- [ ] Add escalation_path to tasks
- [ ] Wire budget tracking to existing token cost API

**Deliverable:** Agents have budgets, over-spend is caught and escalated

### Phase 3: Org Chart & Goal Tracker (Week 3-4)
**Goal:** Visual org hierarchy + goal traceability

- [ ] Build `/org` page with interactive org tree
- [ ] Build `/goals` page with goal tree + progress bars
- [ ] Link tasks to goals in task creation flow
- [ ] Add "why" breadcrumb: Task → Goal → Company Mission
- [ ] Show delegation chain on agent detail views

**Deliverable:** Full org chart visible, every task traces to a goal

### Phase 4: Ticket Threading (Week 4-5)
**Goal:** Full audit trail per task

- [ ] Create `ticket_threads` migration
- [ ] Build ticket thread component (chat-like UI)
- [ ] Wire MC.js activities:log to also write thread entries
- [ ] Add tool call capture to thread
- [ ] Build thread export to Google Drive
- [ ] Add agent reasoning capture (if model supports it)

**Deliverable:** Every task has a complete conversation/action history

### Phase 5: Heartbeat Automation (Week 5-6)
**Goal:** Scheduled agent wake-up + coordination

- [ ] Build heartbeat scheduler UI (cron editor + timeline)
- [ ] Create cron job handler that reads `heartbeat_schedules`
- [ ] Per-agent heartbeat prompt templates
- [ ] Add delegation pattern: heartbeat can assign to subordinates
- [ ] Add escalation pattern: heartbeat escalates stalled tasks
- [ ] Daily standup auto-generation from agent heartbeats

**Deliverable:** Agents wake on schedule, check work, delegate/escalate automatically

### Phase 6: Polish & Integration (Week 6-7)
**Goal:** Unified experience, Paperclip fully absorbed

- [ ] Navigation overhaul: add Org, Goals, Budgets, Heartbeats to nav
- [ ] Merge any remaining Paperclip UI concepts into MC views
- [ ] End-to-end testing of full workflow: goal → task → agent → budget → approval → done
- [ ] Update HEARTBEAT.md to reference new org chart + budgets
- [ ] Documentation update
- [ ] Decommission Paperclip standalone server

**Deliverable:** Single unified Mission Control, Paperclip features fully integrated

---

## Architecture Diagram (Target State)

```
┌─────────────────────────────────────────────────────────┐
│                 MISSION CONTROL (Next.js)                │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │Dashboard │ │ Org     │ │ Goals   │ │ Budgets      │  │
│  │Overview  │ │ Chart   │ │ Tracker │ │ & Governance │  │
│  └─────────┘ └─────────┘ └─────────┘ └──────────────┘  │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │Projects │ │ Agents  │ │ Tickets │ │ Heartbeat    │  │
│  │& Tasks  │ │ & Chat  │ │ Threads │ │ Scheduler    │  │
│  └─────────┘ └─────────┘ └─────────┘ └──────────────┘  │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │Activity │ │Feedback │ │Onboard  │ │ Settings     │  │
│  │Feed     │ │System   │ │Pipeline │ │ & Models     │  │
│  └─────────┘ └─────────┘ └─────────┘ └──────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  scripts/mc.js (CLI) — extended commands         │   │
│  │  org:*, goals:*, budgets:*, heartbeats:*, threads │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Supabase │  │ Google   │  │ OpenClaw │
  │ (DB)     │  │ Drive    │  │ Gateway  │
  └──────────┘  └──────────┘  └──────────┘
```

---

## Key Design Decisions

1. **Supabase over embedded Postgres** — We already have it, it's cloud-hosted, has real-time subscriptions, and Row Level Security. No reason to switch.

2. **Extend, don't rewrite** — MC's dashboard, CLI, and data layer are solid. We add tables and views, not replace the foundation.

3. **Paperclip concepts, not Paperclip code** — Org charts, budgets, heartbeats, and ticket threads are powerful ideas. We implement them natively in our stack rather than importing the Paperclip server.

4. **CLI parity** — Every new feature gets a `scripts/mc.js` command. The CLI is how agents interact with MC programmatically.

5. **Real-time first** — Use Supabase real-time subscriptions for live updates on budget spend, task status, and heartbeat results.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Scope creep across 6 phases | Each phase is independently shippable |
| Budget enforcement too aggressive | Start with `hard_limit=false` (warn only), graduate to hard limits |
| Org chart rigidity | Keep `permissions` as flexible JSONB, not hardcoded rules |
| Ticket thread storage growth | Archive old threads, keep 90-day active window |
| Heartbeat schedule conflicts | Single scheduler with queue — no concurrent runs per agent |

---

## Success Metrics

- [ ] Every task traces to a goal within 1 week of Phase 3 completion
- [ ] Token spend stays within budget for 30 consecutive days
- [ ] Zero stalled tasks older than 4 hours (heartbeat escalates)
- [ ] All governance actions (approve/reject) complete within 1 hour
- [ ] 100% of agent actions logged in ticket threads

---

## Next Steps

1. **Bruk review** — Approve scope and phase order
2. **Phase 1 kickoff** — Create migrations, seed org chart
3. **Parallel track** — Begin UI wireframes for Org Chart + Budget views

---

*Proposal by @Nova — Chief of Staff, Architecture Lead*
*ChipChip Logistics & Delivery — Ethiopia's #1 last-mile platform*
