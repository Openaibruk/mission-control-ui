# Durable Facts

Only store stable truths that will matter later.
_Compacted: 2026-03-29 (from 30 daily log files, Mar 15–27)_

## Bruk (The Human)
- **Name:** Bruk
- **Username:** Brukg1111 (Telegram ID: 365585982)
- **Location:** Addis Ababa, Ethiopia (GMT+3 / Africa/Addis_Ababa)
- **Background:** Banking professional at Wegagen Bank S.C. (operations, compliance, finance)
- **Career Goals:** Business Analyst, Fintech Operations Manager, Compliance Consultant
- **Key Preferences:** Concise updates, automation over manual steps, "note it and move on" mindset
- **Communicates via:** Telegram (primary)

## ChipChip
- ChipChip operates a digital commerce and supply chain model in Ethiopia.
- Super Leaders can act as pickup points / smart souks.
- B2B and B2C models have distinct operational flows.
- Website: chipchip.social
- Supabase: vgrdeznxllkdolvrhlnm.supabase.co
- Delivery fee strategy: 3 Birr home delivery, free Super Leader pickup
- B2B Analytics: Connected DataHub MCP server (`https://actfsareesjtcjsckmht.supabase.co/functions/v1/mcp-analytics-server`)
- Margin tracking: CP1 (Gross Margin = Sales - COGS) and CP2 (Net Margin = Sales - COGS - Warehouse - Delivery)
- Content: Digital mall vibe, white/red/black, curves, Montserrat font

## Mission Control Dashboard
- **Live URL:** https://mission-control-ui-sand.vercel.app
- **GitHub:** Openaibruk/mission-control-ui (auto-deploys on push)
- **Vercel Project:** prj_IA8A1aXQOGrVTCgY7JIV54byNGig (NEVER create new projects)
- **Stack:** Next.js on Vercel, Supabase backend
- **Views:** Dashboard, Office, Projects, Agents, Tasks, IPMR, Activity, Approvals, Feedback, Org Chart, Chat, Settings
- **Deployment rule:** Always push to GitHub first (Vercel auto-deploys). If auto-deploy broken, use `vercel deploy --prod --yes` from CLI.
- **CRITICAL:** The `sand` alias always points to production. Never create new Vercel projects.

## OpenClaw Infrastructure
- **Host:** AWS EC2 (ip-172-31-1-131, public 16.170.169.167)
- **OS:** Linux 6.17.0-1009-aws (x64), Node v22.22.1
- **Disk:** 15GB root (expanded from 6.8GB on ~Mar 17)
- **Gateway:** Running on localhost:18789 (systemd)
- **Primary Model:** openrouter/xiaomi/mimo-v2-pro (free, $0/token)
- **Fallbacks:** meta-llama/llama-3.3-70b-instruct:free
- **Timezone:** Africa/Addis_Ababa (UTC+3)

## Paperclip
- **Server:** localhost:3100 (systemd service)
- **Database:** Embedded PostgreSQL on port 54329
- **Company:** ChipChip (12 agents with full org hierarchy)
- **Auth key:** stored in chipchip/paperclip-auth.txt
- **Gateway adapter:** Configured to connect to OpenClaw ws://127.0.0.1:18789
- **Status:** Running with embedded PostgreSQL

## Agent Roles (Squad)
- **Nova** — Orchestrator/PM (main agent)
- **Henok** — Dev + DevOps
- **Cinder** — QA + Reviewer
- **Kiro** — Architect
- **Onyx** — Security
- **Yonas** — QA (under Cinder)
- **Nahom** — Marketing Strategy (inactive)
- **Bini** — Content (inactive)
- **Lidya** — Design (inactive)
- **Amen** — Analytics (inactive)
- **Forge** — DevOps (legacy name, now Henok)
- **Vision** — (inactive)
- Agent contracts in `squad/`: orchestrator.md, builder.md, researcher.md, reviewer.md, analyst.md
- Inactive agents in `squad/inactive/`

## Automated Routines (Cron Jobs)
- **Daily B2B Snapshot:** 8:00 AM EAT — MCP metrics + Ethiopian news + Telegram summary
- **Daily Morning Standup (GWS):** 8:30 AM EAT — Google Calendar + Gmail brief
- **Weekly Postiz Social Media:** Monday 9:00 AM EAT — 7-day content calendar CSV
- **Weekly Log Rotation:** Sunday 2:00 AM — memory compaction
- **Feedback Review:** 10 AM & 6 PM EAT — auto-review pending feedback
- Background crons use `isolated` mode with `llama-3.3-70b-instruct:free` (NO_REPLY if idle, $0 cost)

## Workspace Architecture (Mar 25 Reorganization)
- `memory/` — facts.md, user.md, decisions/, handoffs/, daily-log/
- `domains/` — long-lived context (chipchip/, mission-control/, sysadmin/)
- `apps/` — codebases (mission-control-ui)
- `projects/` — active deliverables
- `squad/` — strict agent contracts
- `skills/` — tool registry (skills/registry.yaml)
- Root: AGENTS.md, approvals.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md
- Orchestrator owns durable memory; specialists return bounded outputs only

## Skills Installed
- **pptx-generator** — PPTX creation via PptxGenJS (from MiniMax-AI/skills)
- **minimax-docx, xlsx, pdf** — Native document generators
- **agentmail** — Email via novamars@agentmail.to
- **datahub-analytics** — B2B analytics MCP
- **b2b-analytics** — Alternative analytics MCP
- **github** — gh CLI operations
- **weather** — wttr.in / Open-Meteo
- **skill-creator** — Create/edit AgentSkills

## Google Workspace
- **Auth:** `gws` CLI — needs `gws auth login` (was not configured as of Mar 17)
- **gcloud:** Broken (Python 3.13 collections module missing)
- **Drive:** Used for workspace backups and report uploads
- Bruk needs to run `gws auth login` to unlock Drive operations

## Key Operational Rules
1. **NEVER create new Vercel projects** — always deploy to prj_IA8A1aXQOGrVTCgY7JIV54byNGig
2. **GitHub CI/CD is mandatory** — push to GitHub, let Vercel auto-deploy
3. **One dashboard, one URL** — everything in Mission Control (sand)
4. **Instant Project Kickoff** — new projects get immediate task breakdown + agent assignment
5. **Auto-Update Task Status** — sub-agents must mark tasks done in Supabase
6. **Task Architect Protocol** — "take the wheel" = present Options A/B/C before executing
7. **Disk cleanup can be destructive** — always check rm -rf targets first
8. **Low-token background ops** — use isolated sessions with free models

## Known Issues & Open Items
- **GitHub token compromised** — token REDACTED_GITHUB_TOKEN needs rotation
- **ClickHouse DB down** — 64.227.129.135:8443 refuses connections (DataHub paused)
- **GitHub auto-deploy** — Vercel ESLint strictness can cause silent deploy failures
- **Feedback image upload** — needs Supabase storage bucket (not set up)
- **Postiz channels** — in backlog (deprioritized)
- **Ollama setup** — in backlog (deprioritized)

## Historical Token Costs (as of Mar 20)
- Total: $68.59 | 3,701 calls | 11 models
- Top: gemini-3.1-pro-preview ($63.18), claude-opus-4.6 ($4.99)
- Switched to free models (mimo-v2-pro) after OpenRouter credits depleted

## Explorations
- **Zarely.co** — Shopify AI automation architecture designed (customer support, inventory, blog)
- **Ethiopian Kids Animation** — YouTube channel plan at exploration/kids-animation-ethiopia/
- **Autoscientist** — Research agent at exploration/autoscientist/ (karpathy/autoresearch)
- **Virtual Office** — SVG floor plan with live agent avatars in Mission Control /virtual-office
