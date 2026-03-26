# Analytics & Token Cost Tracking

## Token Usage Breakdown (Current Session)

### Main Session (Nova)
- **Input tokens:** ~360,000
- **Output tokens:** ~5,600
- **Total tokens (main):** ~365,600

### Subagent Sessions
Estimated based on 8 subagent runs:

| Agent | Runs | Est. Tokens/Run | Est. Total |
|-------|------|-----------------|------------|
| Shuri | 3 | 80k | ~240k |
| Forge | 2 | 95k | ~190k |
| Cipher | 1 | 60k | ~60k |
| Others | 2 | 70k | ~140k |
| **Subtotal** | 8 | — | **~630k** |

### Grand Total
- **Estimated total tokens:** ~995,000 (~1M)
- **Estimated cost:** $5-10 USD

---

## Cost Estimation Methodology

### OpenClaw Native Tracking
OpenClaw already tracks detailed token usage in session logs at `~/.openclaw/agents/<agentId>/sessions/<sessionId>.jsonl`:

```json
{
  "usage": {
    "input": 23511,
    "output": 404,
    "cacheRead": 1328,
    "cacheWrite": 0,
    "totalTokens": 25243,
    "cost": {
      "input": 0.00634797,
      "output": 0.0003838,
      "cacheRead": 0.00003984,
      "total": 0.00677161
    }
  }
}
```

### Model Pricing (OpenRouter)
| Model | Input $/1M | Output $/1M |
|-------|-----------|-------------|
| Claude Opus 4.6 | $15.00 | $75.00 |
| Gemini 3.1 Pro | $1.00 | $5.00 |
| MiniMax M2.5 | ~$0.20 | ~$0.20 |

### Calculating Real Costs
1. **Parse session logs** - Extract all `usage` entries from `.jsonl` files
2. **Sum by model** - Group by provider/model to apply correct pricing
3. **Factor in cache** - cacheRead is cheaper, cacheWrite costs money
4. **Real-time aggregation** - Can query at runtime with `/usage cost`

---

## Real-Time Token Tracking Approach

### Option 1: OpenClaw Native Commands
```bash
# Per-session usage display
/usage full

# Cost summary from logs
/usage cost

# CLI status with usage
openclaw status --usage
```

### Option 2: Parse Session Logs (Recommended for Supabase)
```bash
# Extract all usage data from current session
grep -o '"usage"[^}]*}' ~/.openclaw/agents/main/sessions/*.jsonl | \
  jq -s 'map(.usage) | map(
    {
      input: .input // 0,
      output: .output // 0,
      cacheRead: .cacheRead // 0,
      cacheWrite: .cacheWrite // 0,
      total: .totalTokens // 0,
      cost: .cost.total // 0
    }
  ) | add'
```

### Option 3: Webhook/Event-Based (Advanced)
- Set up OpenClaw webhooks to capture usage events in real-time
- Stream to Supabase via Edge Function
- Requires: `hooks.internal.entries` configuration

### Recommended Supabase Schema
```sql
CREATE TABLE token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  input_tokens BIGINT,
  output_tokens BIGINT,
  cache_read_tokens BIGINT,
  cache_write_tokens BIGINT,
  total_tokens BIGINT,
  cost_usd DECIMAL(10, 6),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aggregate view for dashboards
CREATE MATERIALIZED VIEW daily_token_stats AS
SELECT 
  DATE(recorded_at) as date,
  agent_id,
  model,
  SUM(input_tokens) as total_input,
  SUM(output_tokens) as total_output,
  SUM(total_tokens) as total_tokens,
  SUM(cost_usd) as total_cost
FROM token_usage
GROUP BY 1, 2, 3;
```

---

## Next Steps for Real Data

1. **Parse existing logs** - Run grep command above to extract real token counts
2. **Update model pricing** - Ensure `openclaw.json` has correct cost config
3. **Set up cron job** - Periodically aggregate logs to Supabase
4. **Consider ClawDeck** - Open-source dashboard built for OpenClaw (see research-dashboards.md)

---

## Commands to Get Current Data
```bash
# Get session usage summary
grep -o '"usage"[^}]*}' ~/.openclaw/agents/main/sessions/*.jsonl | \
  jq -s 'map(.usage.cost.total) | add'

# Get token counts
grep -o '"usage"[^}]*}' ~/.openclaw/agents/main/sessions/*.jsonl | \
  jq -s 'map(.usage.totalTokens) | add'
```