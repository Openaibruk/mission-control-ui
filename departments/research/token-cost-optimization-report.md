# Token & Cost Optimization Report

**Researcher:** @Shuri  
**Date:** 2026-03-15  
**Context:** AI workspace with 8+ agents, cron-based heartbeats, mixed model deployment

---

## Current State

| Model | Input $/1M | Output $/1M | Context |
|-------|-----------|-------------|---------|
| MiniMax M2.5 | $0.27 | $0.95 | 196K |
| Gemini 2.5 Flash | ~$0.10 | ~$0.10 | 1M |
| Gemini 3.1 Pro | $2.00 | $12.00 | 1M |

**Cost ratio:** MiniMax is ~10x cheaper than Gemini 3.1 Pro. Current main agent already uses MiniMax as primary.

---

## Ranked Recommendations

### 1. Model Routing/Tiering Strategy
**Savings:** HIGH | **Difficulty:** EASY | **Owner:** @Forge

**Current issue:** All 9 cron workers run `gemini-2.5-flash` but could use `minimax-m2.5` for 90% of tasks.

| Task Type | Recommended Model | Rationale |
|-----------|------------------|-----------|
| Simple status checks (HEARTBEAT_OK) | minimax-m2.5 | Near-free, good enough |
| File reading + summary | minimax-m2.5 | Fast, cheap |
| Complex reasoning/research | gemini-2.5-flash | Speed + cost balance |
| Code generation | minimax-m2.5 | Solid on coding |
| User-facing high-quality | gemini-3.1-pro | Only when needed |

**Action:** Update cron job payloads to use `minimax-m2.5` by default, promote to flash/gemini only when reasoning is explicitly needed.

---

### 2. Context Window Optimization
**Savings:** MEDIUM | **Difficulty:** MEDIUM | **Owner:** @Nova

**Current issue:** Every cron run loads `squad/*.md` + `mission-control.md` (~5KB each), repeatedly.

| File | Lines | Tokens (est) | Load Frequency |
|------|-------|--------------|----------------|
| AGENTS.md | 212 | ~4,000 | Every session |
| SOUL.md | 36 | ~700 | Every session |
| HEARTBEAT.md | 21 | ~400 | Every heartbeat |
| squad/*.md | Variable | ~2,000-5,000 | Every cron run |
| mission-control.md | Variable | ~1,500 | Every cron run |

**Optimizations:**
- Move static squad descriptions to a single `squad/index.md` loaded once
- Strip HEARTBEAT.md to max 10 lines — most content is redundant
- Create a "lightweight heartbeat" mode that skips loading non-essential files

**Savings estimate:** ~3,000 tokens/heartbeat × 9 jobs × 12 runs/hour = ~324K tokens/hour avoided

---

### 3. Prompt Compression
**Savings:** MEDIUM | **Difficulty:** EASY | **Owner:** @Nova

**Biggest sinks identified:**
1. **AGENTS.md** (212 lines) — loaded every session, full of examples
2. **HEARTBEAT.md** (21 lines) — too verbose for what it does
3. **Cron messages** — repetitive, duplicated across 9 jobs

**Actions:**
- Compact HEARTBEAT.md to 10 lines max (just the checklist, no explanation)
- Create cron job message templates instead of 200-line messages
- Use `<!-- optional -->` sections in AGENTS.md that get stripped before injection

**Savings estimate:** ~2,000 tokens/session × 20 sessions/day = 40K tokens/day

---

### 4. Agent Spawn Efficiency
**Savings:** MEDIUM | **Difficulty:** HARD | **Owner:** @Cipher

**Current issue:** 9 cron jobs run every 5-10 minutes, many return HEARTBEAT_OK (wasted API calls).

| Job | Runs/Hour | Avg Duration | Likely HEARTBEAT_OK |
|-----|-----------|--------------|---------------------|
| Forge 5m | 12 | 13s | ~70% |
| Shuri 5m | 12 | 27s | ~60% |
| Cipher 5m | 12 | 20s | ~60% |
| Maven 10m | 6 | 38s | ~50% |
| Others 10m | 6 each | ~25s | ~50% |

**Optimizations:**
- Reduce heartbeat frequency to 15-30 min for low-activity agents
- Add a "pre-flight" check: if no tasks in mission-control/supabase, skip agent spawn entirely
- Batch all agent checks into ONE cron job that routes internally

**Savings estimate:** ~50% reduction in cron job API calls = ~$2-3/day saved

---

### 5. Caching & Deduplication
**Savings:** LOW-MEDIUM | **Difficulty:** MEDIUM | **Owner:** @Maven

**Opportunities:**
- Cache `mission-control.md` state — if unchanged, skip loading
- Cache squad file checks — use etag/last-modified header
- Deduplicate web searches: same query within 1 hour → return cached result

**Implementation:** Add a simple `~/.openclaw/cache/` layer with TTL for common files.

---

### 6. Use Gemini 2.5 Flash for All Cron Workers
**Savings:** HIGH | **Difficulty:** EASY | **Owner:** @Forge

**Current:** Cron workers already use `gemini-2.5-flash` — this is correct!

**But:** Could use `minimax-m2.5` for simple heartbeat checks (HEARTBEAT_OK responses). Flash is ~$0.10/1M both directions, MiniMax is ~$0.27/$0.95. Actually Flash is cheaper for output!

**Better approach:** Keep flash for cron workers, it's already optimal.

---

### 7. Alternative Model Mix
**Savings:** MEDIUM | **Difficulty:** MEDIUM | **Owner:** @Forge

**Recommended tiered setup:**

| Use Case | Model | $/1M (in/out) |
|----------|-------|---------------|
| Heartbeats/simple checks | minimax-m2.5 | $0.27/$0.95 |
| Code/routine tasks | gemini-2.5-flash | ~$0.10/~$0.10 |
| Complex reasoning | gemini-3.1-pro | $2.00/$12.00 |

**Total potential savings:** 60-80% reduction in token costs by routing correctly.

---

## Priority Action List

| # | Action | Owner | Difficulty | Impact |
|---|--------|-------|------------|--------|
| 1 | Compact HEARTBEAT.md to 10 lines | @Nova | Easy | High |
| 2 | Update cron jobs to use minimax for simple checks | @Forge | Easy | High |
| 3 | Reduce cron frequency to 15-30 min | @Forge | Easy | Medium |
| 4 | Add pre-flight task check before spawn | @Cipher | Medium | High |
| 5 | Create lightweight heartbeat mode | @Nova | Medium | Medium |
| 6 | Implement file caching layer | @Maven | Medium | Low-Med |
| 7 | Strip optional sections from AGENTS.md | @Nova | Easy | Low |

---

## Estimated Total Savings

| Category | Current (est.) | Optimized | Savings |
|----------|----------------|-----------|---------|
| Daily tokens | ~1M | ~300K | 70% |
| Daily cost | $5-10 | $1-2 | 70-80% |
| Monthly cost | ~$200 | ~$40-60 | ~$150/mo |

---

*End of Report*
