# ArsContexta Research Report
## For Tasklyn Dashboard

**Analyst:** Shuri  
**Date:** 2026-03-15  
**Repo:** https://github.com/agenticnotetaking/arscontexta

---

## What the Project Does

ArsContexta is a **Claude Code plugin** that generates personalized "second brain" knowledge systems for AI agents through conversation. Instead of using templates, it derives a complete cognitive architecture—folder structure, context files, processing pipelines, hooks, navigation maps, and templates—tailored to your domain, backed by 249 research claims.

**Core value:** Most AI tools start every session blank. ArsContexta gives agents persistent memory and structure.

---

## Key Features We Should Adopt for Tasklyn

### 1. Three-Space Architecture
| Space | Purpose | Growth Pattern |
|-------|---------|----------------|
| **self/** | Identity, methodology, goals | Slow (tens of files) |
| **notes/** | Knowledge graph | Steady (10-50/week) |
| **ops/** | Operational coordination, queue state | Fluctuating |

**Tasklyn relevance:** HIGH — We could organize dashboard data this way (user identity / task knowledge / operational state).

### 2. The 6 Rs Processing Pipeline
Inspired by Cornell Note-Taking, adapted for task workflows:
- **Record** → zero-friction capture
- **Reduce** → extract insights
- **Reflect** → find connections, update MOCs
- **Reweave** → update older items with new context
- **Verify** → quality checks
- **Rethink** → challenge assumptions

**Tasklyn relevance:** HIGH — Maps directly to task lifecycle: Create → Process → Connect → Update → Validate → Review.

### 3. Hook System for Automation
Four event-driven hooks:
- `SessionStart` — injects context on load
- `PostToolUse` (Write) — validates on every write
- `PostToolUse` (Write, async) — auto-commits to git
- `Stop` — persists session state

**Tasklyn relevance:** MEDIUM-HIGH — Could power real-time task updates, auto-save, validation on task edits.

### 4. Maps of Content (MOCs)
Hierarchical navigation: hub → domain → topic levels. Traversable knowledge graph via wiki links.

**Tasklyn relevance:** MEDIUM — Could replace flat task lists with rich navigation (Projects → Areas → Tasks).

### 5. Conversational Onboarding (`/arscontexta:setup`)
Six-phase setup via conversation:
1. Detection → 2. Understanding → 3. Derivation → 4. Proposal → 5. Generation → 6. Validation

**Tasklyn relevance:** LOW-MEDIUM — Interesting for first-run UX, but probably overkill for task management.

### 6. Research-Backed Design
249 interconnected research claims (Zettelkasten, Cornell, PARA, GTD, cognitive science). Every decision traces to evidence.

**Tasklyn relevance:** HIGH for credibility — We're building on solid foundations; documenting our rationale similarly adds trust.

---

## Actionable Recommendations (Ranked)

### 🔴 P0 — Must Have
1. **Adopt 6 Rs for task lifecycle UI**
   - Create clear pipeline stages in dashboard: Record → Reduce → Reflect → Reweave → Verify → Rethink
   - Visualize tasks through these phases

2. **Implement event hooks for reactivity**
   - `onTaskCreate`, `onTaskUpdate`, `onSessionEnd`
   - Auto-save, validation, notifications

### 🟠 P1 — Should Have
3. **Three-space data organization**
   - Separate identity (self), content (notes), operations (ops) in data model
   - Makes system extensible for future features

4. **MOC-style navigation**
   - Hub → Project → Area → Task hierarchy
   - Replace flat lists with connected views

### 🟡 P2 — Nice to Have
5. **Research-backed feature doc**
   - Publish "Why we built it this way" with citations
   - Builds user trust

6. **Subagent spawning for heavy tasks**
   - Offload complex operations to fresh context windows
   - Prevents context degradation

---

## Summary

ArsContexta is a sophisticated knowledge management system for AI agents. For Tasklyn, the **6 Rs pipeline** and **hook system** are the strongest inspirations—directly applicable to task lifecycle and real-time UI. The three-space architecture provides a solid organizational principle, while MOCs offer better navigation than flat lists.

**Bottom line:** Borrow the pipeline (6 Rs) and hooks; adapt the structure (three spaces); consider MOCs for navigation.