# Model Routing Guide

## Priority Order (Cost Optimization)
1. **google/gemini-2.5-flash** — FREE (Google API, daily limit) → use first for everything
2. **google/gemini-3.1-pro-preview** — FREE (Google API, daily limit) → fallback for complex tasks
3. **openrouter/minimax/minimax-m2.5** — CHEAP (paid) → when Google daily limit is hit
4. **openrouter/google/gemini-2.5-flash** — CHEAP (paid) → backup via OpenRouter
5. **openrouter/anthropic/claude-opus-4.6** — EXPENSIVE → only when explicitly requested

## Strategy: Free First, Paid as Fallback
- Exhaust free Google Gemini quota daily before any paid calls
- OpenClaw auto-falls back when primary model fails (rate limit = fallback trigger)

## Overview

This document explains how models are routed in OpenClaw and when to use each one.

## Default Model (Production)

- **Model:** `openrouter/minimax/minimax-m2.5`
- **Cost:** ~$0.20/million input tokens, ~$0.40/million output tokens
- **Use case:** Daily work, main agent, subagents, general tasks
- **Status:** Set as `agents.defaults.model.primary`

## Available Models

### 1. minimax-m2.5 (Default)
- **Provider:** OpenRouter
- **Cost:** Cheap
- **Best for:** Daily tasks, subagents, routine work
- **Config:** `agents.defaults.model.primary`

### 2. gemini-2.5-flash
- **Provider:** Google via OpenRouter
- **Cost:** Very cheap (free tier available)
- **Best for:** Cron workers, batch jobs, high-frequency tasks
- **Config:** Add to specific agent/cron config

### 3. claude-opus-4.6
- **Provider:** Anthropic via OpenRouter
- **Cost:** Expensive (~$15/million input, ~$75/million output)
- **Best for:** Complex reasoning, difficult problems, when other models fail
- **Config:** Manual override only — NOT default

### 4. gemini-3.1-pro-preview
- **Provider:** Google
- **Cost:** Moderate
- **Best for:** Fallback when minimax fails

## Cost Comparison

| Model | Input (per 1M) | Output (per 1M) | Use Frequency |
|-------|----------------|-----------------|---------------|
| minimax-m2.5 | $0.20 | $0.40 | Default |
| gemini-2.5-flash | ~$0 | ~$0 | Cron/batch |
| gemini-3.1-pro-preview | ~$1.25 | ~$5.00 | Fallback |
| claude-opus-4.6 | $15.00 | $75.00 | Rare/expensive |

## How to Override Per-Spawn

When spawning a subagent, you can override the model:

```javascript
// Use expensive model for complex task
await sessions_spawn({
  model: "openrouter/anthropic/claude-opus-4.6",
  // ... other options
});

// Use fast/cheap model for simple task
await sessions_spawn({
  model: "openrouter/google/gemini-2.5-flash",
  // ... other options
});
```

## Cron Workers

Cron workers should use `google/gemini-2.5-flash` for cost efficiency:

```json
{
  "model": {
    "primary": "google/gemini-2.5-flash"
  }
}
```

## Summary

- **Default:** minimax-m2.5 — use for everything
- **Cron/batch:** gemini-2.5-flash — free, fast
- **Expensive/rare:** claude-opus-4.6 — only when needed
- **Fallback:** gemini-3.1-pro-preview — if minimax fails
