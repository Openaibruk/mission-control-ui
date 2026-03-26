# OpenClaw as a Team Operating System — Capability Map

> Research date: 2026-03-19 | Author: Nova ⚡

## TL;DR

OpenClaw isn't just a chatbot framework — it's a **team operating system** that orchestrates AI agents, schedules tasks, manages memory, integrates with 15+ messaging platforms, and provides a skills/plugin ecosystem. Below: every major capability mapped to concrete team OS use cases.

---

## 1. Multi-Agent Orchestration

**What it is:** Multiple isolated agents in one Gateway process. Each agent has its own workspace, SOUL.md, sessions, auth, model config, and tool policy. Routing is deterministic via bindings (channel → agent, peer → agent, guild+role → agent).

**Key features:**
- Per-agent workspace isolation (files, memory, persona)
- Per-agent sandbox & tool allow/deny lists
- Per-agent model selection (fast model for chat, Opus for deep work)
- Binding priority: peer > parentPeer > guild+roles > guild > team > account > channel > default
- Agent-to-agent messaging (explicit allowlist)

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **AI Helpdesk** | Route `support@` DMs to "support" agent with restricted tools; route `sales@` to "sales" agent with CRM access |
| **Departmental AI** | Engineering agent on Discord #eng channels, HR agent on Slack #hr channels, exec agent on WhatsApp DMs |
| **Multi-person on one server** | Route Alex's WhatsApp DMs to "alex" agent, Mia's to "mia" agent — one Gateway, isolated brains |
| **Model-per-task** | WhatsApp → fast Claude Sonnet for quick replies; Telegram → Opus for deep analysis |
| **Secure multi-tenant** | Family agent with read-only sandbox, work agent with full tools — same host, zero cross-contamination |

---

## 2. Cron Scheduling

**What it is:** Built-in scheduler inside the Gateway. Persists jobs in `~/.openclaw/cron/`. Supports one-shot (`at`), interval (`every`), and cron expressions with timezone. Runs in main session (system events) or isolated sessions (dedicated agent turns).

**Key features:**
- Three schedule kinds: `at`, `every`, `cron` (5-field with seconds)
- Main session (piggyback on heartbeat) vs isolated (fresh agent turn)
- Model + thinking overrides per job
- Delivery modes: `announce` (channel), `webhook` (HTTP POST), `none`
- Auto-stagger for top-of-hour schedules (deterministic 0-5 min spread)
- Exponential backoff retry for transient failures
- Webhook delivery to external systems

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Automated Daily Reports** | `cron "0 9 * * *"` isolated job → announce summary to Telegram/Slack |
| **One-shot Reminders** | `--at "20m"` system event → wake main session for meeting prep |
| **Weekly Team Digest** | `cron "0 6 * * 1"` isolated with `--model opus` → deep weekly analysis |
| **CI/CD Monitoring** | Cron job polls build status via tools, announces failures to Discord |
| **Webhook-triggered Workflows** | `delivery.mode = "webhook"` → POST results to external APIs (Zapier, internal dashboards) |
| **Shift Handovers** | Cron at shift change time → generate handover summary from daily memory |
| **Invoice/Deadline Reminders** | One-shot `at` jobs tied to specific dates, auto-delete after run |

---

## 3. Heartbeats

**What it is:** Periodic agent runs in the main session (default 30 min). Agent reads HEARTBEAT.md checklist and batches multiple checks in one turn. Replies `HEARTBEAT_OK` when nothing needs attention.

**Key features:**
- Configurable interval + active hours window
- HEARTBEAT.md checklist drives behavior
- Smart suppression (no message if nothing to report)
- Batches multiple monitoring tasks in one turn
- Target delivery: `last`, specific channel, or `none`

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Ambient Awareness** | Heartbeat checks inbox + calendar + notifications every 30 min — surfaces only what matters |
| **Quiet Mode Monitoring** | `target: "none"` → agent processes internally, only alerts on exceptions |
| **Idle Check-ins** | If no messages for 8+ hours, heartbeat sends gentle check-in |
| **Project Pulse Checks** | HEARTBEAT.md lists: check build status, review PR queue, scan support tickets |

---

## 4. Cron + Heartbeat Combined (The Automation Stack)

The real power is combining both:

- **Heartbeat** = ambient monitoring, batching, context-aware (cheap, one turn covers many checks)
- **Cron** = precise timing, isolation, different models, external delivery

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Ops Command Center** | Heartbeat monitors 5 systems every 30 min; cron sends precise 9am daily report |
| **Smart Triage** | Heartbeat scans inbox; cron triggers escalation if unread > threshold |
| **Cost Optimization** | Heartbeat uses cheap model for ambient; cron uses Opus for weekly deep dives |

---

## 5. Skills System

**What it is:** Per-agent instruction modules loaded into the system prompt. Each skill is a directory with SKILL.md + optional scripts/configs. Skills live in `workspace/skills/` (per-agent) or `~/.openclaw/skills/` (shared). 50+ built-in skills available.

**Key features:**
- Per-agent vs shared skills
- Skill instructions injected into system prompt
- Skills can contain scripts, configs, API wrappers
- SKILL.md defines when to activate (description triggers)
- Skills can reference external tools via `exec`

### Available Skill Categories (from our setup)

- **Google Workspace (26 skills):** Gmail, Calendar, Drive, Docs, Sheets, Slides, Chat, Tasks, Keep, Forms, Meet, People, Classroom, Admin Reports, Model Armor, plus workflow combinations
- **Development (4):** GitHub CLI, Vercel CLI, Mission Control DB, skill-creator
- **Automation (3):** Active maintenance, output uploads, weather
- **Communication (1):** Telegram supplier communicator
- **Platform (2):** Healthcheck, node-connect

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Automated Reporting** | `gws-workflow-weekly-digest` + cron → weekly digest delivered to Slack |
| **Email Triage** | `gws-gmail-triage` + heartbeat → inbox summary every 30 min |
| **Meeting Prep** | `gws-workflow-meeting-prep` triggered before meetings via cron |
| **Standup Automation** | `gws-workflow-standup-report` → daily standup from calendar + tasks |
| **Document Workflows** | `gws-drive-upload` + `gws-chat-send` → upload doc, announce in Chat space |
| **Custom Business Logic** | Create team-specific skills (e.g., order processing, inventory checks) |

---

## 6. Memory System

**What it is:** Two-layer persistent memory using plain Markdown files. Daily logs (`memory/YYYY-MM-DD.md`) + curated long-term memory (`MEMORY.md`). Vector search over memory with semantic + BM25 hybrid search. Auto-flush before compaction.

**Key features:**
- Plain Markdown (human-readable, git-friendly)
- `memory_search` (semantic) + `memory_get` (targeted read)
- Vector embeddings (OpenAI, Gemini, local, Ollama, QMD)
- Hybrid search: vector similarity + BM25 keyword
- MMR re-ranking (diversity) + temporal decay (recency)
- Auto-flush before context compaction
- Multimodal memory (images + audio via Gemini)
- Session transcript indexing (experimental)

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Institutional Knowledge** | Agent remembers decisions, preferences, past context across sessions |
| **Onboarding** | New team member talks to agent → agent recalls all project history from memory |
| **Cross-session Continuity** | Tuesday's conversation about API design informs Friday's code review |
| **Smart Recall** | `memory_search "client preferences"` → finds scattered notes across months of daily logs |
| **Temporal Awareness** | Recent decisions rank higher than stale ones (temporal decay) |
| **Knowledge Base** | Team's MEMORY.md becomes living documentation the agent can query |

---

## 7. Gateway API & RPC

**What it is:** HTTP/WebSocket API for programmatic control. Exposes agent runs, session management, cron control, channel status, and more. Web Control UI and macOS companion app built on top.

**Key features:**
- `agent` RPC for programmatic agent runs
- `agent.wait` for synchronous execution
- Cron API: `cron.list`, `cron.add`, `cron.run`, `cron.runs`
- Session management API
- Health endpoint
- OpenAI-compatible HTTP API (pass-through to models)

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **AI API Gateway** | Apps call the Gateway API instead of raw LLM APIs — adds memory, skills, routing |
| **Custom Dashboards** | Build UIs on the Gateway API (like Mission Control) for team oversight |
| **Integration Layer** | Zapier/n8n/Make call Gateway API → agent processes → results flow back |
| **Programmatic Agent Spawns** | CI/CD pipeline calls Gateway API → agent reviews code, posts to Slack |

---

## 8. Messaging Integrations

**What it is:** 20+ channel adapters. Each supports accounts, bindings, policies, group handling, media, and streaming.

**Supported channels:** WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Mattermost, Google Chat, Matrix, IRC, LINE, Feishu, Microsoft Teams, Twitch, Nostr, Zalo, Synology Chat, Nextcloud Talk, BlueBubbles, Tlon

**Key features per channel:**
- Multiple accounts per channel
- DM policies: pairing, allowlist, open
- Group policies: allowlist, mention-based activation
- Media support: images, audio, documents in/out
- Streaming replies with chunking
- Inbound debouncing (batch rapid messages)
- Forum/topic support (Telegram topics, Discord threads)

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Omnichannel AI** | Same agent responds on WhatsApp, Telegram, and Discord — unified brain |
| **Channel-per-purpose** | Telegram for quick ops, Discord for dev discussions, Slack for company |
| **WhatsApp Business** | Multiple phone numbers → different agents (sales, support, ops) |
| **Telegram Topics** | Cron delivers daily report to specific Telegram forum topic |
| **Discord Role Routing** | Messages from #support-channels → support agent; #engineering → eng agent |
| **Cross-platform Memory** | WhatsApp conversation about a client informs Telegram reply about same client |

---

## 9. Sub-Agents & Session Spawning

**What it is:** Agents can spawn sub-agent sessions for parallel work. Sub-agents are ephemeral, auto-announce results to parent, and can be spawned via tools or cron.

**Key features:**
- `sessions_spawn` for creating sub-agents
- Push-based completion (auto-announce, no polling)
- Nested depth limits
- Sub-agents can use different models
- Results merge back to parent session

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Parallel Research** | Spawn 3 sub-agents to research different topics simultaneously |
| **Task Decomposition** | Complex task → break into sub-tasks → spawn sub-agents → collect results |
| **Automated Code Review** | Cron triggers → spawn sub-agent per PR → reviews merge → announce results |
| **Bulk Operations** | Process 50 items → spawn sub-agents in batches → aggregate results |

---

## 10. Google Workspace Integration (26 Skills)

**What it is:** Deep integration with Google's ecosystem via Workspace APIs. Covers Gmail, Calendar, Drive, Docs, Sheets, Slides, Chat, Tasks, Keep, Forms, Meet, People, Classroom, Admin Reports, and Model Armor.

**Workflow skills combine multiple services:**
- `gws-workflow-email-to-task`: Gmail → Google Tasks
- `gws-workflow-file-announce`: Drive upload → Chat announcement
- `gws-workflow-meeting-prep`: Calendar → agenda + attendees + linked docs
- `gws-workflow-standup-report`: Today's meetings + open tasks
- `gws-workflow-weekly-digest`: Weekly summary of meetings + email

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Automated Standups** | Cron → standup-report skill → daily standup from real calendar/task data |
| **Email-to-Task Pipeline** | Gmail watch → email-to-task skill → auto-create tasks for action items |
| **Meeting Intelligence** | Before each meeting → meeting-prep skill → agenda + context ready |
| **File Sharing Automation** | Upload to Drive → file-announce skill → notify team in Chat |
| **Weekly Executive Summary** | Cron Monday 9am → weekly-digest → Slack/Telegram with calendar + email stats |
| **Document Collaboration** | Read/write Google Docs programmatically for report generation |

---

## 11. Plugins & Hooks

**What it is:** Extension points for custom behavior. Plugin hooks intercept agent lifecycle events. Internal hooks react to commands and events.

**Hook points:**
- `before_model_resolve` — override model selection
- `before_prompt_build` — inject context
- `before_tool_call` / `after_tool_call` — intercept tool usage
- `agent:bootstrap` — add bootstrap files
- `message_received` / `message_sending` / `message_sent`
- `session_start` / `session_end`
- `gateway_start` / `gateway_stop`

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Compliance Logging** | `message_sending` hook → log all outbound messages to audit DB |
| **Dynamic Model Routing** | `before_model_resolve` → route to cheaper model during off-hours |
| **Custom Auth** | `before_tool_call` → enforce approval gates for sensitive operations |
| **Analytics** | `agent_end` hook → track token usage, response times, tool calls |

---

## 12. Session Management

**What it is:** Flexible session isolation and scoping. Direct chats can share one session (continuity) or be isolated per peer/channel (security). Group chats get unique sessions automatically.

**Key features:**
- `dmScope`: `main`, `per-peer`, `per-channel-peer`, `per-account-channel-peer`
- Identity links (collapse same person across channels)
- Secure DM mode for multi-user setups
- Session compaction with memory flush
- Command queue with collect/steer/followup modes

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Multi-User Agent** | `per-channel-peer` DM scope → Alex's DMs never leak to Bob's |
| **Shared Team Context** | `main` DM scope → all team members share context in one session |
| **Cross-Channel Identity** | `identityLinks` → Alex on WhatsApp = Alex on Telegram = same session |
| **Support Ticket Isolation** | Each customer DM gets isolated session → no cross-contamination |

---

## 13. Model Management & Failover

**What it is:** Multi-provider support with automatic failover. Per-agent model selection. Thinking/reasoning level control. Cost tracking.

**Key features:**
- Multiple providers: Anthropic, OpenAI, Google, OpenRouter, Ollama, local
- Per-agent and per-job model overrides
- Thinking levels: off, minimal, low, medium, high
- Automatic failover on errors
- OAuth for Anthropic/OpenAI

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Cost Optimization** | Default to cheap model, cron jobs use Opus for quality |
| **Reliability** | Auto-failover → primary down → switch to backup provider |
| **Task-Appropriate Models** | Quick reply → Sonnet; code review → Opus; bulk processing → Gemini Flash |
| **Budget Control** | Token usage tracking per agent/model |

---

## 14. Security & Sandboxing

**What it is:** Per-agent sandboxing (Docker containers), tool allow/deny lists, DM policies, group allowlists, elevated permissions framework.

**Key features:**
- Per-agent Docker sandboxing
- Tool allow/deny per agent
- DM pairing/allowlist/open policies
- Group allowlists per channel
- Elevated permissions (sender-based, global)
- Security audit CLI

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Untrusted Agent Sandboxing** | Community agent runs in Docker → can't access host files |
| **Least Privilege** | Support agent: read + exec only. Admin agent: full tools |
| **Access Control** | DM allowlist → only approved team members can talk to agent |
| **Audit Trail** | `openclaw security audit` → verify DM/group policies |

---

## 15. Lobster (Workflow Runtime)

**What it is:** Multi-step tool pipeline runtime with deterministic execution and explicit approval gates. Runs as a local subprocess.

**Key features:**
- Deterministic multi-step workflows
- Human approval checkpoints
- Resumable runs (pause/resume)
- JSON envelope output

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Approval Workflows** | Expense report → agent prepares → human approves → agent submits |
| **Multi-Step Deployments** | Build → test → stage → approve → deploy (with human gates) |
| **Compliance Processes** | Data export → anonymize → review → approve → send (audit trail) |

---

## 16. Nodes (Mobile Companions)

**What it is:** iOS and Android companion apps that pair with the Gateway. Provide device commands, camera, screen recording, location, voice, contacts, calendar, photos, SMS, notifications, and motion data.

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Field Agent** | Android node → agent gets location, camera, notifications → field reporting |
| **Personal Assistant** | iOS node → agent accesses calendar, contacts, photos → proactive suggestions |
| **Device Commands** | Agent can trigger device actions remotely via node pairing |

---

## 17. Skills Ecosystem (Skill Creator)

**What it is:** Self-service skill creation and management. Skills can be created, edited, audited, and shared across agents.

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Team Knowledge Capture** | Turn SOPs into skills → new hires just ask the agent |
| **Process Automation** | Any repeatable workflow → create a skill → cron triggers it |
| **Institutional Memory** | Skills encode tribal knowledge in executable, versioned Markdown |

---

## 18. Mission Control Integration

**What it is:** Web dashboard for monitoring agents, tasks, projects, activity, approvals, and feedback. Built on Supabase + Vercel.

### Team OS Use Cases

| Use Case | How |
|----------|-----|
| **Team Dashboard** | Real-time view of all agent activity, tasks, and project status |
| **Approval Queue** | Human approval requests surface in dashboard for quick action |
| **Feedback Loop** | Team members submit feedback → tracked through status pipeline |
| **Activity Audit** | Full log of what agents did, when, and what the outcome was |

---

## Master Capability-to-Use-Case Matrix

| Capability Stack | Use Case | Example |
|-----------------|----------|---------|
| Cron + Skills + Announce | Automated daily reports | 9am cron → standup-report skill → Telegram |
| Heartbeat + Skills + Memory | Ambient monitoring | 30min heartbeat → gmail-triage + calendar check → alert if urgent |
| Multi-Agent + Bindings | Departmental AI | Discord #eng → eng agent; WhatsApp sales → sales agent |
| Sub-Agents + Cron | Parallel batch processing | Cron → spawn 5 sub-agents → process queue → collect results |
| Memory + Skills | Institutional knowledge agent | Agent recalls project history, encoding SOPs as skills |
| Gateway API + Webhook Cron | Integration hub | Cron → agent processes → webhook POST → Zapier → downstream systems |
| Nodes + Heartbeat | Mobile-aware assistant | Android node reports location → heartbeat adjusts behavior |
| Sandbox + Multi-Agent | Multi-tenant platform | Each client gets sandboxed agent with restricted tools |
| Lobster + Cron | Scheduled approval workflows | Monday cron → Lobster pipeline → human gate → execute |
| Google Workspace + Cron | Executive assistant | Morning: meeting-prep. Evening: standup-report. Weekly: digest |
| DM Scope + Identity Links | Unified personal AI | Same person on WhatsApp/Telegram → one session, one brain |
| Model Failover + Per-Agent | Cost-optimized reliability | Cheap model default, failover to backup, Opus for quality jobs |
| Skills Creator + Memory | Self-improving team brain | Team creates skills from repeated patterns, memory captures context |
| Mission Control + Activities | Management oversight | Dashboard shows what 12 agents did today across all channels |
| Plugins + Hooks | Custom business logic | Before tool call → check compliance; after agent end → update CRM |

---

## Conclusion

OpenClaw's power as a team OS comes from **composability**: cron + skills + memory + multi-agent + channels form a stack where each layer amplifies the others. A single Gateway can:

- Run **12+ isolated agents** with different personas and permissions
- Schedule **hundreds of cron jobs** with precise timing and delivery
- Monitor **everything** via heartbeats in one cheap turn
- Search **months of institutional knowledge** via semantic memory
- Integrate with **20+ messaging platforms** simultaneously
- Spawn **parallel sub-agents** for bulk processing
- Run **approval-gated workflows** via Lobster
- Expose **all of this** via a programmable API

The result: an AI-native team operating system where agents are team members, skills are SOPs, memory is institutional knowledge, and cron is the clock that keeps everything running.

---

*Generated by Nova ⚡ — 2026-03-19*
