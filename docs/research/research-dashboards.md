# Dashboard Research: AI Agent & Project Management

## Open-Source AI Agent Dashboards

### ClawDeck ⭐ RECOMMENDED
**URL:** https://clawdeck.io | **GitHub:** https://github.com/clawdeckio/clawdeck

- **Built specifically for OpenClaw** - Kanban-style task management
- **Features:**
  - Multiple Kanban boards
  - Agent task assignment and tracking
  - Real-time activity feed
  - REST API for integrations
  - GitHub OAuth auth
- **Tech Stack:** Ruby on Rails 8, PostgreSQL, Hotwire/Turbo
- **Deployment:** Self-hosted or hosted (clawdeck.io)
- **License:** MIT

**Features to Adopt:**
- Task assignment to agents
- Real-time activity streams
- API-first design for automation

---

### BuilderZ Labs Mission Control
**GitHub:** https://github.com/builderz-labs/mission-control

- **Description:** "The open-source dashboard for AI agent orchestration"
- **Features:**
  - Manage agent fleets
  - Track tasks
  - Monitor costs
  - Orchestrate workflows
  - CLI integration
  - GitHub sync
  - Real-time monitoring

**Status:** Alpha - under active development

---

### OpenClaw Mission Control (abhi1693)
**GitHub:** https://github.com/abhi1693/openclaw-mission-control

- Fork of mission-control for OpenClaw Gateway integration
- Multi-agent coordination
- Task assignment via OpenClaw

---

### crshdn/mission-control
**GitHub:** https://github.com/crshdn/mission-control

- Generic AI agent orchestration dashboard
- Works with OpenClaw Gateway
- Multi-agent collaboration support

---

## Project Management Dashboards (Open Source)

### Self-Hosted Options

| Tool | Best For | Tech | Self-Hosted |
|------|----------|------|-------------|
| **Plane** | Full PM suite | React/PostgreSQL | ✅ Docker |
| **Docmost** | Notion alternative | Node/PostgreSQL | ✅ Docker |
| **Supavisor** | pgBouncer alternative | Elixir | ✅ |
| **Appsmith** | Custom dashboards | React/Node | ✅ Docker |
| **ToolJet** | Low-code dashboards | Node/React | ✅ Docker |
| **Retool** | Internal tools | React | ❌ SaaS only |
| **Budibase** | Simple internal apps | Svelte | ✅ Docker |

### AI-Native Dashboards (2025-2026 Trends)

1. **LangChain/LangGraph Dashboard** - For agent workflow visualization
2. **AutoGen Studio** - Microsoft's agent orchestration UI
3. **CrewAI UI** - For multi-agent crew management
4. **Agno** - Agent framework with built-in monitoring

---

## Recommendations for OpenClaw

### Short-Term (Adopt Existing)
1. **Deploy ClawDeck** - Already built for OpenClaw, Kanban-style
2. Add cost tracking widget using OpenClaw `/usage cost` output

### Medium-Term (Build Custom)
1. **Metrics Dashboard:**
   - Token usage over time (charts)
   - Cost per agent/model breakdown
   - Session duration tracking
   - Agent productivity metrics

2. **Integration Points:**
   - Parse `~/.openclaw/agents/*/sessions/*.jsonl` for usage data
   - Expose via REST API for dashboard consumption
   - Webhook to stream events to Supabase

### Suggested Stack
- **Frontend:** React + Recharts (charts)
- **Backend:** Supabase (database) + Edge Functions
- **Real-time:** Supabase Realtime for live updates
- **Auth:** GitHub OAuth (existing ClawDeck pattern)

---

## Links Summary

| Resource | URL | Purpose |
|----------|-----|---------|
| ClawDeck | https://clawdeck.io | OpenClaw-native task dashboard |
| ClawDeck GitHub | https://github.com/clawdeckio/clawdeck | Self-host option |
| BuilderZ Mission Control | https://github.com/builderz-labs/mission-control | Agent fleet management |
| Plane | https://plane.so | Full PM (self-hosted) |
| Appsmith | https://appsmith.com | Custom dashboards |
| ToolJet | https://tooljet.com | Low-code internal tools |
| Supabase | https://supabase.com | Database + Realtime |

---

## Implementation Priority

1. **Now:** Parse OpenClaw session logs → write to Supabase (see analytics.md)
2. **Next:** Build simple Grafana/Metabase dashboard on Supabase
3. **Later:** Consider ClawDeck integration for task management