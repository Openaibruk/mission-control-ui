# BMAD-METHOD Research Report

**Project:** BMAD-METHOD Integration  
**Date:** 2026-03-16  
**Author:** Nova (Research Lead)

---

## Executive Summary

**BMAD-METHOD** (Breakthrough Method for Agile AI Driven Development) is an open-source AI development framework that adds structured agile workflows and 12+ specialized AI agents to coding tools like Claude Code, Cursor, and Codex CLI. It's free, MIT-licensed, and designed to turn AI assistants into a full development team.

**Verdict:** Promising concept, but **not ready for production adoption yet** due to installation issues and unclear maturity.

---

## What Is BMAD-METHOD?

An npm package (`bmad-method`) that installs into any project and provides:

| Component | Description |
|-----------|-------------|
| **12+ AI Agents** | PM, Architect, Developer, UX Designer, Scrum Master, QA, DevOps, etc. |
| **34+ Workflows** | Structured agile processes from brainstorming → deployment |
| **Scale-Adaptive** | Adjusts complexity from bug fixes to enterprise architecture |
| **Party Mode** | Multi-agent collaboration in a single session |
| **Modules** | BMM (core), BMB (builder), TEA (test architecture), BMGD (game dev), CIS (creative) |

---

## Architecture

```
npx bmad-method install
    ↓
.bmad/ directory created in project
    ↓
Agents + Workflows + Skills added to AI IDE context
    ↓
AI coding tool (Claude Code, Cursor, etc.) uses BMAD agents as system prompts
    ↓
Developer interacts through structured workflow prompts
```

**How it works technically:**
- Installs a `.bmad/` folder with agent definitions (YAML/markdown), workflow configs, and CLI tools
- Each agent is a specialized system prompt with domain expertise
- Workflows chain agents together (e.g., PM → Architect → Dev → QA)
- The `bmad-help` skill provides on-demand guidance
- No server needed — it's all context/config injected into your AI tool

---

## Use Cases for Our Dev Department

### 1. 🔥 Architecture-First Development
**Problem:** We jump straight into coding without proper architecture planning.  
**BMAD approach:** Architect agent creates system design before any code is written.  
**Value:** Fewer rewrites, cleaner codebase, better scalability.

### 2. 🔥 Sprint Planning Automation
**Problem:** Manual task breakdown is time-consuming and inconsistent.  
**BMAD approach:** PM agent + Scrum Master agent auto-generate user stories with acceptance criteria.  
**Value:** Consistent sprint structure, better estimation.

### 3. 🔥 Code Review Standardization
**Problem:** Code review quality varies by reviewer.  
**BMAD approach:** QA agent follows structured review checklist.  
**Value:** Consistent review quality, fewer bugs shipped.

### 4. 🟡 New Feature Development
**Problem:** Features go from idea to code without intermediate planning.  
**BMAD approach:** Full lifecycle: PM analysis → Architecture → Sprint → Implementation → Review.  
**Value:** Better feature quality, clearer requirements.

### 5. 🟡 Bug Triage & Analysis
**Problem:** Bugs get fixed ad-hoc without root cause analysis.  
**BMAD approach:** Structured bug analysis workflow with severity classification.  
**Value:** Fewer recurring bugs, better prioritization.

---

## Installation Attempt — Result: FAILED ⚠️

```bash
npx bmad-method install --modules bmm --tools claude-code --yes
```

**Error:** `MODULE_NOT_FOUND` — `xmlbuilder` module missing in their `xml2js` dependency chain.

**Root cause:** BMAD-METHOD v6.2.0 has a broken dependency. The `xmlbuilder` package is not bundled correctly in their npm package.

**Disk space was also an issue** (87% usage on our 6.8GB VPS) — had to clean caches before attempting install.

**Impact:** Cannot install on our infrastructure without either:
1. Waiting for them to fix the dependency bug
2. Manual workaround (install xmlbuilder separately)
3. Using a different machine with more disk space

---

## Comparison: BMAD vs Our Current Stack

| Aspect | BMAD-METHOD | Mission Control (Current) |
|--------|-------------|--------------------------|
| **Agent system** | 12+ specialized personas | 8 agents (Nova, Henok, Yonas, etc.) |
| **Task tracking** | File-based (.bmad/) | Supabase + Dashboard |
| **UI** | None (CLI + AI IDE only) | Web dashboard on Vercel |
| **Workflows** | 34+ predefined | Manual via Nova chat |
| **Installation** | npm package (broken) | Custom built |
| **Data persistence** | Markdown files | PostgreSQL (Supabase) |
| **Real-time** | No | Yes (realtime subscriptions) |
| **Cost tracking** | No | Yes (token tracker) |

---

## Recommendation

### Short-term (Next 2 weeks)
- **Don't adopt yet** — installation is broken, v6 is very new
- **Monitor** their GitHub for bug fixes
- **Extract ideas** — their agent role definitions and workflow patterns are excellent reference material

### Medium-term (1-2 months)
- **Borrow their workflow structure** — implement similar structured workflows in Mission Control
- **Create agent personas** inspired by BMAD's 12 roles (we already have 8)
- **Build workflow templates** that chain agents together

### Long-term (If BMAD matures)
- **Consider integration** — BMAD as the "development methodology engine" behind Mission Control
- **Use BMAD Builder** to create custom ChipChip-specific agents and workflows

---

## Key Links

- GitHub: https://github.com/bmad-code-org/BMAD-METHOD
- Docs: https://docs.bmad-method.org
- Discord: https://discord.gg/gk8jAdXWmj
- NPM: https://www.npmjs.com/package/bmad-method
- YouTube: https://www.youtube.com/@BMadCode

---

## Files Created

- `chipchip/drivers/onboarding-checklist.md` — Phase-by-phase driver registration
- `chipchip/drivers/training-template.md` — 7-module training manual
- `chipchip/drivers/welcome-materials.md` — Welcome kit & ID templates
- `chipchip/drivers/ux-review.md` — UX friction analysis (8 items)
- `chipchip/drivers/sops.md` — 6 standard operating procedures

---

*Report complete. Task 1 (Research) ✅ done. Tasks 2-6 pending further direction.*
