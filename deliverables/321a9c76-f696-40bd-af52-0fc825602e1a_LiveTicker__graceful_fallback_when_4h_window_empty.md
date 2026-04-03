# LiveTicker: Graceful Fallback Implementation

## 1. Overview
This deliverable outlines the implementation of a graceful fallback mechanism for the LiveTicker component. The goal is to prevent an empty UI bar when no bids exist within the default 4-hour window by dynamically extending the query range to 24 hours, and finally falling back to the most recently available bids if necessary.

## 2. Fallback Logic Flow
1. **Primary Query**: Fetch bids within the last `4 hours`.
2. **First Fallback**: If result count is `0`, query bids within the last `24 hours`.
3. **Second Fallback**: If 24h result is also `0`, fetch the `N` most recent bids regardless of timestamp.
4. **State Resolution**: Attach a contextual label to the response to inform the UI which timeframe is active.
5. **Cache & Refresh**: Cache the result for a short duration (e.g., 30s) to prevent redundant queries during rapid component re-renders.

## 3. Implementation Reference (TypeScript)
```typescript
interface Bid {
  id: string;
  amount: number;
  currency: string;
  timestamp: number; // Unix timestamp (ms)
}

interface TickerResponse {
  bids: Bid[];
  timeframeLabel: string;
  isFallback: boolean;
}

interface TickerQueryConfig {
  primaryWindowMs: number;
  extendedWindowMs: number;
  maxHistoricalBids: number;
}

const DEFAULT_CONFIG: TickerQueryConfig = {
  primaryWindowMs: 4 * 60 * 60 * 1000,
  extendedWindowMs: 24 * 60 * 60 * 1000,
  maxHistoricalBids: 10
};

async function fetchLiveTickerBids(config: TickerQueryConfig = DEFAULT_CONFIG): Promise<TickerResponse> {
  const now = Date.now();

  // 1. Primary 4h window
  let bids = await api.getBids({ since: now - config.primaryWindowMs, limit: 50 });
  if (bids.length > 0) {
    return { bids, timeframeLabel: 'Live (Last 4h)', isFallback: false };
  }

  // 2. Extended 24h window
  bids = await api.getBids({ since: now - config.extendedWindowMs, limit: 50 });
  if (bids.length > 0) {
    return { bids, timeframeLabel: 'Recent (Last 24h)', isFallback: true };
  }

  // 3. Ultimate fallback: last available bids
  bids = await api.getBids({ orderBy: 'timestamp_desc', limit: config.maxHistoricalBids });
  return { bids, timeframeLabel: 'Last Available Bids', isFallback: true };
}
```

## 4. UI/UX Integration Guidelines
- **Dynamic Badge**: Render a subtle, non-intrusive badge next to the ticker title:
  - `✅ Live` (4h)
  - `📅 Recent` (24h)
  - `🕒 Historical` (Last available)
- **Tooltip Context**: On hover, display: `"No activity in the last 4 hours. Showing expanded timeframe."`
- **Visual Consistency**: Maintain newest-first sorting across all states. Use identical card layouts to prevent layout shift.
- **Empty State Handling**: If the database contains zero bids ever, render a dedicated placeholder: `"Awaiting first bids..."` instead of triggering fallbacks.

## 5. Edge Cases & Mitigations
| Edge Case | Mitigation |
|-----------|------------|
| **Client/Server Clock Skew** | Always use server-generated timestamps for `since` calculations. Sync via `Date` header or NTP if critical. |
| **High Latency / API Failures** | Implement exponential backoff (1s, 2s, 4s) with a max retry count of 2. Fallback to cached UI state on failure. |
| **Stale Data Display** | Attach `fetchedAt` metadata. Expire client cache after 45s. Show `"Updated Xs ago"` indicator. |
| **Excessive Fallback Triggering** | If fallback activates >70% of requests over 1h, trigger a backend health alert (indicates ingestion pipeline stall). |

## 6. Testing Strategy
- **Unit Tests**: Mock API responses for each tier (4h empty → 24h populated → 24h empty → historical populated). Assert correct `timeframeLabel` and `isFallback` values.
- **Integration Tests**: Verify end-to-end rendering in the component tree. Ensure no layout thrashing when switching states.
- **Performance Tests**: Confirm fallback queries respect `limit` caps and do not trigger full table scans. Validate sub-300ms response times.
- **Accessibility**: Ensure screen readers announce the timeframe badge (`aria-live="polite"`). Verify color contrast meets WCAG 2.1 AA.

## 7. Deployment & Monitoring
- **Feature Flag**: Gate behind `enable_ticker_fallback` for phased rollout (10% → 50% → 100%).
- **Telemetry**: Emit structured logs/metrics:
  - `ticker.fallback.triggered` (count)
  - `ticker.fallback.window_used` (`4h` | `24h` | `historical`)
  - `ticker.empty.render_count` (should drop to ~0 post-deploy)
- **Dashboard**: Add a panel tracking fallback activation rate by region/timezone to identify data pipeline gaps.
- **Rollback Plan**: Disable feature flag → revert to strict 4h query → show empty state with standard loading skeleton.