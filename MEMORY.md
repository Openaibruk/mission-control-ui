# MEMORY.md - Long-term Knowledge Base

_Last updated: 2026-03-16_

## About This File

This is the curated long-term memory for the assistant. Key facts, preferences, and important context live here.

## The Human

- **Name:** Bruk
- **Location:** Addis Ababa, Ethiopia
- **Timezone:** Africa/Addis_Ababa (EAT, UTC+3)
- **Background:** Banking professional at Wegagen Bank S.C. (operations, compliance, finance)
- **Career Goals:** Business Analyst, Fintech Operations Manager, Compliance Consultant
- **Skills:** Banking (Expert), Business Analysis (Developing), Technology (Growing)
- **Gaps:** SQL, Agile/Scrum, wireframing tools, multi-jurisdiction compliance

## Preferences & Patterns

- Prefers concise updates over long explanations
- Wants automation — things should update themselves, not require manual steps
- Catches mislabeling — keep project scope clear
- "Note it and move on" = don't overthink, document and proceed

## Active Projects

### ChipChip
- Logistics/delivery platform
- Driver onboarding system in progress (docs done, digital tracker built)
- Website: chipchip.social
- Supabase: vgrdeznxllkdolvrhlnm.supabase.co

### Mission Control
- Dashboard: Next.js on Vercel (mission-control-ui)
- Supabase backend for tasks, projects, agents
- Dashboard at Vercel deployment URL

## Job Finder Agent (ACTIVE)

### Overview
- **Location:** `job-finder/` directory
- **Purpose:** Help Bruk find and track job opportunities
- **Status:** Built and ready, needs Gateway restart for cron
- **Built:** 2026-03-18

### Scripts
- `daily-job-search.js` - Searches LinkedIn, Indeed, RemoteOK, WeWorkRemotely, EthioJobs
- `apply-to-job.js` - Creates application tracker and updates master tracker
- `research-company.js` - Generates company research with news search
- `follow-up-tracker.js` - Application status and follow-up reminders

### Target Roles
1. Business Analyst
2. Operations Manager - Banking/Fintech
3. Compliance Consultant
4. Project Manager - Financial Services

### Cron Schedule
- Daily search: 9:00 AM EAT
- Follow-up check: 10:00 AM EAT  
- Weekly report: Monday 8:00 AM EAT

### Key Files
- `job-finder/profile/myProfile.md` - Professional profile
- `job-finder/profile/mySkills.md` - Skills matrix with gap analysis
- `job-finder/tracker/master-tracker.md` - All applications overview
- `job-finder/templates/` - Job, interview prep, company research templates

## Obsidian Vault

- **Location:** `/Users/bruk/Desktop/Personal/Computers & Tech/My Personal Folder/Obsidian Vault/`
- **Files:** 81 across 17 directories
- **Job Search Folder:** Existing with active applications (Augustine University, Awash Bank)
- **Connection:** Via Obsidian REST API MCP tools

## MCP Servers Available

- **Working:** Obsidian, Tavily, MasterGo, GitHub MCP, Context7, Sequential Thinking, SQLite, YouTube Transcripts, Discord, Filesystem
- **Need Keys:** Meta Ads (token expired), Ollama (no LLM loaded), Browser (Chrome needs restart)

## Development Workflow (ADOPTED 2026-03-16)

**Source:** BMAD-METHOD framework analysis → adapted for our team

### Track Selection (DECISION TREE)
- Bug? → **Bug Fix Track** (Cinder analyze → Forge fix → Cinder verify)
- Tech decision? → **ADR Track** (Kiro research → Kiro decide)
- 1-3 points? → **Quick Flow** (Nova spec → Forge dev → Cinder review)
- 5+ points? → **Full Feature** (Nova PRD → Kiro arch → Nova stories → Forge dev → Cinder review)

### Agent Roles
| Agent | Role |
|-------|------|
| Nova | PM, Analyst, Scrum Master — planning & orchestration |
| Henok | Dev + DevOps — building & deploying |
| Cinder | QA + Reviewer — quality gates |
| Kiro | Architect — system design, ADRs |
| Onyx | Security — compliance, security review |

### Templates
All at `chipchip/workflows/templates/`:
- `prd-template.md` — Product Requirements
- `architecture-template.md` — Architecture + ADRs
- `tech-spec-template.md` — Quick flow
- `epic-template.md` — Epic + stories
- `sprint-status.yaml` — Sprint tracking

### Playbook
Full playbook: `chipchip/workflows/dev-team-playbook.md`

### Key Rules
1. Pick the right track for task size — don't use Full Feature for 1-point tasks
2. Nova does NOT do architecture — that's Kiro
3. Nova does NOT do code review — that's Cinder
4. Auto-update task status when sub-agents finish work (don't leave tasks stuck)
5. All docs go in `chipchip/workflows/` with templates in `templates/`

## Core Operational Rules

### Instant Project Kickoff (ACTIVE — ALL SESSIONS)
When a new project is created (via dashboard, verbally, or Supabase):
1. Break into 3-5 concrete tasks immediately
2. Assign to right agents per department mapping
3. Spawn sub-agents — execute now, not later
4. Update Supabase task counts
5. Report to Bruk what's being done and by who
**Rule:** Speed over perfection. Rough plan executing > perfect plan waiting.

## Key Decisions

### 2026-03-16: Instant Project Kickoff Rule
- **Decision:** Every new project must trigger immediate task breakdown, assignment, and agent execution
- **Reason:** Projects were being created but not picked up automatically — wasted time waiting for heartbeat
- **Outcome:** HEARTBEAT.md updated with CORE RULE, AGENTS.md updated, applies to all sessions

### 2026-03-16: BMAD-METHOD Adoption
- **Decision:** Adopt BMAD workflow patterns WITHOUT installing their package
- **Reason:** Package broken (xmlbuilder bug), don't need it — just borrow methodology
- **Outcome:** 4 workflow templates, agent role mapping, playbook created

### 2026-03-16: Task Status Automation
- **Decision:** Sub-agents must auto-update Supabase task status on completion
- **Reason:** Tasks were getting stuck "in_progress" because sub-agents don't call the API
- **Fix:** HEARTBEAT.md updated with auto-update rule, spawn instructions include status update

## Job Search Status

- **Job Finder Agent:** Built 2026-03-18, ready for daily use
- **Target Roles:** Business Analyst, Fintech Ops, Compliance Consultant
- **Obsidian Vault:** Connected, has existing job applications
- **Daily Search:** Automated via cron (9 AM EAT)
- **Profile:** Banking background mapped with skills gap analysis

## Useful Context

- Mission Control Supabase anon key is in `.env` and `mission-control-ui/.env.local`
- MCP tools available: tasks CRUD, projects, agents, messages, documents, activities, notifications
- Sub-agents use `sessions_spawn` with task descriptions
- Disk space: 15GB VPS, 43% used (8.4GB free) — expanded by Bruk (~95% used, 388MB free)
- Model changed to **mimo-v2-pro** (free on OpenRouter, $0/token) — depleted OpenRouter credits with paid models
- Paperclip installed: AI company orchestrator on port 3100, ChipChip company with 12 agents

---
_Note: This file is for long-term, curated knowledge. Daily logs go in memory/YYYY-MM-DD.md_
