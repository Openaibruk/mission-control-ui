# Unified Mission Control Architecture Proposal

> **Goal:** Build the best-of-breed AI agent management platform by combining Mission Control's real-time UX with Paperclip's organizational orchestration strengths.
>
> **Date:** 2026-03-17
> **Author:** Nova (synthesized from Kiro's research reports)

---

## Executive Summary

**Mission Control** has a strong real-time dashboard, Supabase backend, and rich OpenClaw integrations. **Paperclip** excels at org charts, budgets, governance, and goal alignment. Neither is complete alone.

**The plan:** Add Paperclip's organizational intelligence to Mission Control's real-time UI — without losing what MC does well or duplicating what OpenClaw already provides.

**Not a rebuild. An upgrade.**

---

## Current State Comparison

### What MC Does Better ✅

| Feature | Why MC Wins |
|---------|------------|
| Real-time Dashboard | Supabase Realtime, live updates, dark theme polish |
| Kanban Board | Visual task management with drag-and-drop |
| Token Cost Tracking | Per-model breakdown, 7-day charts, total spend |
| Chat Widget | Floating assistant UI (needs LLM wiring) |
| Feedback System | Bug/feature/improvement submission with IPMR tagging |
| Driver Onboarding | Domain-specific ChipChip feature |
| Google Drive Sync | Document export pipeline |
| Skill Ecosystem | 40+ OpenClaw skills (Gmail, Calendar, GitHub, etc.) |
| Multi-channel | Telegram, Discord, WhatsApp, webchat |
| Agent Memory | SOUL.md, MEMORY.md, daily logs |

### What Paperclip Does Better ✅

| Feature | Why Paperclip Wins |
|---------|-------------------|
| Org Charts | Full hierarchy with roles, reporting lines, titles |
| Budget Enforcement | Per-agent monthly limits, hard ceiling, soft alerts at 80% |
| Goal Alignment | Mission → Project → Agent Goal → Task chain (every task has "why") |
| Governance | Board approval gates, pause/terminate, rollback capability |
| Heartbeats | Scheduled wake-up with context delivery, fat vs thin context |
| Atomic Task Checkout | DB-level single assignment, no double-work |
| Ticket Threading | Initiative → Project → Milestone → Issue hierarchy |
| Audit Trail | Immutable, append-only, full tool-call tracing |
| Adapter System | 8+ agent adapters, drop-in registration |
| Multi-Company | Unlimited isolated companies per deployment |
| Portable Templates | Export/import org configs with secret scrubbing |

### What Both Miss ❌

| Gap | Impact |
|-----|--------|
| No real agent execution in MC | Chat is keyword-matched, not connected to agents |
| Hardcoded dashboard stats | 3 of 6 stats are mock data |
| No notification UI | Schema exists, zero UI presence |
| No real-time agent-to-agent chat | Agents can't message each other |
| No test coverage | Zero automated tests |

---

## Unified Architecture

### Design Principles

1. **Don't replace what works** — enhance MC's Supabase + Next.js stack
2. **Steal the best ideas** — budgets, goals, governance, heartbeats from Paperclip
3. **Don't duplicate OpenClaw** — skills, memory, multi-channel already handled there
4. **Real agent connections** — wire the chat widget to actual OpenClaw gateway
5. **Data-driven, not hardcoded** — everything from Supabase, nothing static

### Target Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                 MISSION CONTROL (UPGRADED)                    │
│                 Next.js + Supabase + Realtime                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    DASHBOARD LAYER                       │ │
│  │  Overview │ Board │ Agents │ Projects │ Chat │ Settings  │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  NEW: Org Chart View (from Paperclip model)      │   │ │
│  │  │  NEW: Budget Dashboard (per-agent spend/limits)  │   │ │
│  │  │  NEW: Notification Center (bell + badge + panel) │   │ │
│  │  │  NEW: Governance Panel (approval queue)          │   │ │
│  │  │  FIX: Real agent stats (replace hardcoded data)  │   │ │
│  │  │  FIX: Wired chat → OpenClaw gateway (real LLM)   │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 DATA LAYER (Supabase)                    │ │
│  │                                                         │ │
│  │  EXISTING TABLES:          NEW TABLES:                  │ │
│  │  ├─ tasks                  ├─ org_chart (hierarchy)     │ │
│  │  ├─ agents                 ├─ budget_rules              │ │
│  │  ├─ projects               ├─ approval_gates            │ │
│  │  ├─ activities             ├─ goal_chain                │ │
│  │  ├─ messages               ├─ heartbeat_schedules       │ │
│  │  ├─ documents              ├─ audit_log (append-only)   │ │
│  │  ├─ notifications          ├─ task_checkout (atomic)    │ │
│  │  ├─ feedback               └─ delegation_rules          │ │
│  │  └─ driver_onboarding                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              OPENCLAW INTEGRATION LAYER                  │ │
│  │  ├─ Chat API → Real gateway WebSocket (not keywords)    │ │
│  │  ├─ Heartbeat cron → /api/cron/wake (already works)     │ │
│  │  ├─ Agent invoke → gateway agent.run                    │ │
│  │  └─ Budget enforcement → pre-run token check            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              CLI (scripts/mc.js)                         │ │
│  │  Add: budget CRUD, org-chart CRUD, approval commands     │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## New Features (Prioritized)

### 🔴 P0 — Critical Fixes (This Week)

#### 1. Fix Hardcoded Dashboard Stats
**Problem:** Gateway status, session count, agent count are hardcoded mock data.
**Fix:** Query Supabase for real agent status, gateway health endpoint, active task counts.
**Effort:** 2-3 hours

#### 2. Wire Chat Widget to OpenClaw Gateway
**Problem:** Chat is a keyword matcher — no LLM, no real agent interaction.
**Fix:** Replace `/api/chat` route with actual OpenClaw gateway WebSocket call (like Paperclip's adapter does). Use `agent.run` with Nova's session key.
**Effort:** 4-6 hours

#### 3. Add Task Checkout (Atomic Assignment)
**Problem:** Multiple agents could pick up the same task.
**Fix:** Add `checked_out_by`, `checked_out_at` fields to tasks. Use Supabase RLS or RPC for atomic checkout.
**Effort:** 2-3 hours

---

### 🟠 P1 — Core Organizational Features (This Month)

#### 4. Goal Alignment Chain
**Paperclip feature:** Mission → Project → Agent Goal → Task hierarchy.
**MC implementation:**
- Add `parent_type` + `parent_id` to tasks (can link to project, goal, or another task)
- Add `goals` table: `{id, project_id, agent_id, description, status, key_results[]}`
- UI: Show goal ancestry in task detail view ("This task contributes to: X → Y → Z")
- Every task creation prompts for goal link (optional but encouraged)

**Why:** Agents understand *why* they're doing work, not just *what* to do.

**Effort:** 6-8 hours

#### 5. Budget System
**Paperclip feature:** Per-agent monthly budgets with hard ceilings and soft alerts.
**MC implementation:**
- Add to agents table: `budget_monthly_usd` (decimal), `budget_spent_usd` (running total, reset monthly)
- Middleware: Before any agent task run, check `budget_spent + estimated_cost > budget_monthly`
- If exceeded: block task, notify Bruk, mark agent as "over_budget"
- Soft alert at 80%: yellow badge on agent card
- Dashboard widget: Budget usage bars per agent, total org spend
- Cron job: Monthly reset of `budget_spent_usd`

**Why:** Prevents runaway token costs. Paperclip's most valuable feature.

**Effort:** 8-10 hours

#### 6. Org Chart (Data Model + View)
**Paperclip feature:** Full hierarchy with roles, reporting lines.
**MC implementation:**
- Add `org_chart` table: `{id, agent_id, parent_agent_id, department, title, level}`
- Replace hardcoded departments with DB-driven org chart
- UI: Interactive org chart view (tree diagram) showing reporting lines, status, budget usage
- Keep existing Agent Grid as alternative view

**Effort:** 6-8 hours

#### 7. Notification Center (UI)
**Problem:** Notifications table exists but has zero UI.
**Fix:**
- Notification bell icon in header with badge count
- Dropdown panel: list of undelivered notifications with mark-as-read
- Browser push notifications (optional)
- Telegram notifications for critical items (via OpenClaw)

**Effort:** 3-4 hours

#### 8. Governance / Approval Gates
**Paperclip feature:** Board approval for critical agent actions.
**MC implementation:**
- Add `approval_gates` table: `{id, action_type, agent_id, requester_id, status, details, approved_by, approved_at}`
- Gate types: agent creation, budget changes, strategy overrides, destructive actions
- UI: Approval queue in dashboard (like a PR review queue)
- Bruk gets Telegram notification when approval needed
- Agents can't execute gated actions without explicit approval

**Effort:** 6-8 hours

---

### 🟡 P2 — Enhanced Coordination (Next Month)

#### 9. Heartbeat Scheduling
**Paperclip feature:** Agents wake on schedule, check work, act.
**MC implementation:**
- Add `heartbeat_schedules` table: `{id, agent_id, cron_expression, context_template, last_run, next_run}`
- Separate from OpenClaw's existing cron — this adds per-agent schedule config
- UI: Cron editor per agent in agent detail view
- Context delivery: Pre-load task context before heartbeat fires

**Effort:** 4-6 hours

#### 10. Immutable Audit Log
**Paperclip feature:** Append-only, full tool-call tracing.
**MC implementation:**
- New `audit_log` table with RLS: append-only, no UPDATE/DELETE permissions
- Log all: task creations, status changes, agent actions, budget changes, governance decisions
- UI: Audit view with filters (by agent, date range, action type)
- Export to CSV

**Effort:** 3-4 hours

#### 11. Fix Notification System (Full Pipeline)
- Wire task assignment → notification creation
- Wire approval gates → notification creation
- Wire budget alerts → notification creation
- All agent-relevant events generate notifications

**Effort:** 2-3 hours

#### 12. Agent-to-Agent Delegation
**Paperclip feature:** Tasks delegate across the org chart based on capabilities.
**MC implementation:**
- Add `capabilities` JSON field to agents (list of skills/tags)
- When task needs capability X, auto-suggest best agent
- Delegation history in task thread

**Effort:** 4-6 hours

---

### 🟢 P3 — Polish & Nice-to-Haves (Backlog)

| Feature | Description | Effort |
|---------|------------|--------|
| Company Templates | Export/import project + agent configs as JSON | 3-4h |
| Task Threading | Subtasks with parent/child relationships | 4-6h |
| Agent Capabilities UI | Visual skill tags on agent cards | 2h |
| Historical Trends | 30/90-day charts for token costs, task velocity | 3-4h |
| Customizable Dashboard | Drag-and-drop widget layout | 6-8h |
| Audit Export | Scheduled CSV/PDF export of audit logs | 2h |

---

## What We're NOT Adopting From Paperclip

| Paperclip Feature | Why We're Skipping |
|-------------------|-------------------|
| "Not a chatbot" stance | Wrong for us — Telegram/Discord access is essential |
| Replace OpenClaw skills | Our 40+ skills are far richer than SKILL.md |
| Switch from Supabase | Embedded Postgres adds complexity; Supabase manages everything |
| Strict single-assignee | Our workflow benefits from collaboration |
| Plugin system (JSON-RPC workers) | OpenClaw skills already serve this purpose |
| Multi-company isolation | Not a current need |
| Embedded Postgres | Supabase Cloud is simpler and scales |

---

## Implementation Roadmap

### Phase 1: Foundation Fixes (Week 1)
- [ ] Fix hardcoded dashboard stats
- [ ] Wire chat to OpenClaw gateway
- [ ] Add atomic task checkout
- [ ] Add notification bell UI

### Phase 2: Core Features (Week 2-3)
- [ ] Goal alignment chain (DB + UI)
- [ ] Budget system (DB + enforcement + UI)
- [ ] Org chart (DB + tree view)
- [ ] Governance approval gates

### Phase 3: Coordination (Week 4)
- [ ] Heartbeat scheduling per agent
- [ ] Immutable audit log
- [ ] Agent-to-agent delegation
- [ ] Wire all notifications end-to-end

### Phase 4: Polish (Ongoing)
- [ ] Company templates export/import
- [ ] Task threading and subtasks
- [ ] Historical trend charts
- [ ] Custom dashboard widgets

---

## Database Schema Changes

### New Tables

```sql
-- Goal alignment chain
CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  agent_id uuid REFERENCES agents(id),
  title text NOT NULL,
  description text,
  key_results jsonb DEFAULT '[]',
  status text DEFAULT 'active', -- active, achieved, abandoned
  created_at timestamptz DEFAULT now()
);

-- Budget enforcement
ALTER TABLE agents ADD COLUMN budget_monthly_usd decimal(10,2) DEFAULT 100.00;
ALTER TABLE agents ADD COLUMN budget_spent_usd decimal(10,2) DEFAULT 0;
ALTER TABLE agents ADD COLUMN budget_alerted_at timestamptz;

-- Org chart hierarchy
CREATE TABLE org_chart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) UNIQUE,
  parent_agent_id uuid REFERENCES agents(id),
  department text,
  title text,
  level int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Approval gates
CREATE TABLE approval_gates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  agent_id uuid REFERENCES agents(id),
  requester_id text DEFAULT 'system',
  status text DEFAULT 'pending', -- pending, approved, rejected
  details jsonb,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Heartbeat schedules
CREATE TABLE heartbeat_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id),
  cron_expression text NOT NULL,
  context_template text,
  last_run timestamptz,
  next_run timestamptz,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Immutable audit log
CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);
-- CRITICAL: No UPDATE/DELETE permissions on this table

-- Task checkout (atomic)
ALTER TABLE tasks ADD COLUMN checked_out_by text;
ALTER TABLE tasks ADD COLUMN checked_out_at timestamptz;

-- Goal linkage on tasks
ALTER TABLE tasks ADD COLUMN goal_id uuid REFERENCES goals(id);
ALTER TABLE tasks ADD COLUMN parent_task_id uuid REFERENCES tasks(id);
```

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Hardcoded dashboard stats | 3 of 6 | 0 of 6 |
| Chat → Real agent connection | ❌ | ✅ |
| Agents with budget limits | 0/8 | 8/8 |
| Tasks with goal linkage | 0% | >50% |
| Notification delivery rate | 0% | >90% |
| Approval gates for critical ops | 0 | All destructive ops |
| Audit log entries | 0 | 100% of actions |
| Test coverage | 0% | >40% |

---

## Summary

This plan takes the **best of Paperclip** (org charts, budgets, goals, governance, heartbeats, audit trails) and layers it onto **Mission Control's existing stack** (Supabase, Next.js, real-time UI, OpenClaw integration). It also fixes MC's known gaps (hardcoded stats, disconnected chat, missing notifications).

**The result:** A unified AI agent management dashboard that combines Paperclip's organizational intelligence with Mission Control's real-time UX — all in one place, all pulling from the same Supabase backend.

---

*Last updated: 2026-03-17*
