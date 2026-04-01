# MEMORY.md — Long-Term Memory Index

_Curated: 2026-04-01 · Follows markdown.engineering auto-memory pattern (index + topic files)_

> **How this works:** This file is the index loaded every session. Individual topics live in `memory/facts/` and `memory/topics/`. The system prompt loads this file in full; topic files are loaded on-demand when relevant.

---

## Quick Index

| Topic | File | Type | Key Facts |
|---|---|---|---|
| Who Bruk Is | `memory/facts/user.md` | user | Banking ops, fintech goals, Addis Ababa, GMT+3 |
| Durable Facts | `memory/facts/facts.md` | reference | ChipChip, MC, Paperclip, agents, costs, known issues |
| Agent Squad | `squad/` | reference | Nova (orchestrator), Henok (dev), Cinder (QA), Kiro (arch) |
| Workspace Rules | `AGENTS.md` | feedback | Core red lines, group chat rules, skill system |
| Infrastructure | `memory/facts/facts.md#openclaw` | project | AWS EC2, Node 22, paperclip localhost:3100 |
| ChipChip Biz | `memory/facts/facts.md#chipchip` | project | B2B/B2C, Super Leaders, 3 Birr delivery |
| Mission Control | `memory/facts/facts.md#mission-control` | project | Vercel project prj_IA8A…V54byNGig, Supabase |
| Cron Jobs | `memory/facts/facts.md#automated-routines` | reference | 6 automated routines (standup, B2B, social, feedback) |
| Open Items | `memory/facts/facts.md#open-items` | project | GitHub token, ClickHouse down, Postiz backlog |

---

## Active Projects

### ChipChip Analytics & Platform
- Live B2B analytics via Supabase MCP
- Margin tracking: CP1 (gross) and CP2 (net)
- DataHub analytics server (MCP-connected)
- ClickHouse DB currently down

### Mission Control Dashboard
- Single dashboard: mission-control-ui-sand.vercel.app
- Vercel project prj_IA8A1aXQOGrVTCgY7JIV54byNGig (ONLY project)
- 12 views including Virtual Office
- GitHub CI/CD auto-deploy (ESLint issues can block)

### Paperclip (Agent Platform)
- Server: localhost:3100 with embedded Postgres
- 12 agents with org hierarchy
- Connected to OpenClaw gateway

---

## Operating Principles

1. **NEVER create new Vercel projects** — always use prj_IA8A1aXQOGrVTCgY7JIV54byNGig
2. **GitHub CI/CD is mandatory** — push first, then deploy
3. **Instant Project Kickoff** — new projects get immediate task breakdown + agent assignment
4. **Auto-Update Task Status** — sub-agents mark tasks done in Supabase
5. **Low-token background ops** — isolated sessions with free models
6. **Disk cleanup can be destructive** — verify rm -rf targets before running

---

## Recent Activity

- **2026-04-01**: Explored markdown.engineering — analyzed 50-lesson Claude Code source course
- **2026-03-31**: HEARTBEAT.md restructured, workspace maintenance
- **2026-03-30/29**: Memory compaction, daily logs consolidated

---

## Markdown Engineering Principles (Adopted 2026-04-01)

_Source: [markdown.engineering/learn-claude-code](https://www.markdown.engineering/learn-claude-code) — 50-lesson architecture course from 1,902 leaked Claude Code source files_

**Core Thesis:** The code is generated. The markdown is engineered. Skills and rules compound over time — day 90 is genuinely better than day 1 because the markdown layer accumulated knowledge.

### Skill Design Rules (from source analysis)
- **SKILL.md = frontmatter + body** — YAML frontmatter controls all metadata; markdown body is the prompt
- **description is the selector signal** — Claude's relevance model reads only this one line to decide when to trigger the skill. Keep it as a precise, one-line summary
- **when_to_use prevents wrong activation** — explicit "use when X, examples: Y, NOT when Z" instructions
- **arguments + allowed-tools = safer skills** — narrow patterns (`Bash(gh:*)`) not broad (`Bash`)
- **context: fork** = isolated sub-agent with its own token budget; inline = same conversation context
- **paths = conditional activation** — skill only appears when matching files are opened (great for domain-specific workflows)
- **MCP skills** — can never execute inline shell (security boundary in source)
- **Priority order:** Managed → User → Personal → Project → Bundled

### Memory Architecture (3-layer model)
1. **Auto Memory** (`memory/facts/`) — persistent facts about Bruk, ChipChip, infrastructure. Type taxonomy: user, feedback, project, reference
2. **Session Memory** — in-session notes for context compaction (survives past context window)
3. **Daily Logs** (`memory/YYYY-MM-DD.md`) — raw daily notes, periodically compacted into facts.md
- Feedback memories should capture BOTH corrections AND confirmations (prevent drift)
- Team memory: delta push with SHA-256 checksums, deletions don't propagate
- `MEMORY.md` is the index (index-only, topic files loaded on-demand)

### Context Management Principles
- **Microcompact** — instant pruning of old tool results before they fill context
- **Session memory compaction** — avoids expensive LLM summarization calls by using pre-written session notes
- **Keep MEMORY.md lean** — it loads every session; details in topic files pulled when relevant
- Write `description` fields as query-matching signals: a selector model uses them for relevance scoring

### Operating Patterns
- Skills persist between sessions and compound — invest time in them upfront
- Test skills end-to-end before committing
- Version skills when behavior changes
- Use `references/` subdirectories for supporting docs, keep SKILL.md focused
- Create `skills/registry.yaml` for fast skill discovery (Claude doesn't walk directories)
- What NOT to save in memory: code patterns, git history, debugging solutions, anything already in AGENTS.md

### Applied Improvements (implemented)
- Enhanced frontmatter on: task-completer, pptx-generator, agentmail
- Created `skills/registry.yaml` (55+ skills indexed)
- Created `skills/vendor/_templates/SKILL-MD-SPEC.md` (skill reference template)
- Restructured MEMORY.md with index + topic file pattern
- Added `what NOT to save` section for guidance

---

## What NOT to Save Here

> Per markdown.engineering source analysis:
> - Code patterns, conventions, architecture → read the project
> - Git history → git log is authoritative  
> - Debugging solutions → fix is in the code/commit msg
> - Anything already in AGENTS.md or SOUL.md
> - Ephemeral task details → daily logs in `memory/`
