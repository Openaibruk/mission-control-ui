# Token & Cost Optimization Strategy Report
**Author:** @Shuri  
**Date:** March 15, 2026  
**Task:** Research token & cost optimization strategies

---

## Executive Summary

After analyzing current LLM pricing landscape (March 2026) and optimization strategies, I've identified **ranked recommendations** to reduce token costs by up to **60-95%** while maintaining quality.

---

## 1. Model Pricing Analysis (March 2026)

### Current Stack Assessment
Based on runtime config: `model=openrouter/minimax/minimax-m2.5`

**Minimax M2.5 pricing** (via OpenRouter):
- ~$0.20/M input, ~$0.40/M output (estimated)
- Competitive mid-tier pricing

### Market Comparison (Blended Cost 1:1 ratio)

| Rank | Model | Input/M | Output/M | Blended/M | Best For |
|------|-------|---------|----------|-----------|----------|
| 1 | Mistral Nemo | $0.02 | $0.02 | $0.02 | Lightweight |
| 2 | Gemini 2.0 Flash-Lite | $0.075 | $0.30 | $0.19 | Cheapest quality |
| 3 | DeepSeek V3.2 | $0.28 | $0.42 | $0.35 | Best value |
| 4 | GPT-5 Mini | $0.25 | $2.00 | $1.13 | Fast/affordable |
| 5 | Claude Sonnet 4.6 | $3.00 | $15.00 | $9.00 | Complex reasoning |

---

## 2. Ranked Recommendations

### 🥇 Tier 1: Immediate High Impact (60-80% savings)

**A. Implement Semantic Caching**
- **Savings:** Up to 73% on repeated queries
- **How:** Cache similar requests using Redis or similar
- **Implementation:** Hash prompt + context → store response
- **Providers with native support:** DeepSeek (90% cache discount), Anthropic (90%), OpenAI (90%)

**B. Prompt Caching (Provider-Native)**
- **Savings:** Up to 90% on repeated context
- **How:** Use provider's caching API (Anthropic, OpenAI, DeepSeek)
- **Best for:** Multi-turn conversations, RAG pipelines

### 🥈 Tier 2: Architectural Changes (40-60% savings)

**C. Model Routing (Smart Tiering)**
| Task Type | Current Model | Recommended | Savings |
|-----------|---------------|-------------|---------|
| Simple Q&A | MiniMax M2.5 | Gemini 2.0 Flash-Lite | ~70% |
| Classification | MiniMax M2.5 | GPT-5 Nano | ~50% |
| Code generation | MiniMax M2.5 | Claude Sonnet 4.6 | +10% (quality) |
| Complex reasoning | MiniMax M2.5 | Keep or o4-mini | Varies |

**D. Context Truncation**
- Limit conversation history to last N turns
- Summarize older exchanges instead of full history
- Use 128K context only when needed

### 🥉 Tier 3: Prompt Optimization (20-40% savings)

**E. Prompt Engineering**
- Remove redundant instructions
- Use implicit over explicit instructions
- Leverage few-shot examples sparingly

**F. Output Token Limits**
- Set max_tokens explicitly to prevent over-generation
- Current system has no input limit (found in prior UX review)

---

## 3. Implementation Roadmap

### Week 1: Quick Wins
- [ ] Add semantic caching layer (Redis)
- [ ] Set output token limits in chat widget

### Week 2: Model Routing
- [ ] Implement router logic for task classification
- [ ] Route simple tasks to Gemini 2.0 Flash-Lite

### Week 3: Prompt Optimization
- [ ] Audit system prompts for bloat
- [ ] Implement conversation summarization

---

## 4. Estimated Monthly Savings

| Scenario | Current (est.) | Optimized | Savings |
|----------|----------------|-----------|---------|
| 10K users, 20 turns/day | ~$500/mo | ~$150/mo | 70% |
| 50K queries (RAG) | ~$250/mo | ~$75/mo | 70% |

---

## 5. Recommendation Summary (Ranked)

1. **Semantic Caching** — Highest ROI, ~73% savings
2. **Provider Prompt Caching** — ~90% on repeated context
3. **Model Routing** — 50-70% for simple tasks
4. **Context Truncation** — 20-40% on long conversations
5. **Prompt Optimization** — 10-20% ongoing

---

*Note: Current Supabase database has no token_usage table. Recommend adding instrumentation to track actual token consumption for data-driven optimization.*
