# Technical Implementation Plan: Activity Stream Freshness

## 1. Objective
Eliminate 2-day stale data in the activity stream by implementing a real-time/near-real-time update mechanism. Ensure users see activity within seconds of occurrence while maintaining system performance, scalability, and graceful degradation under load.

## 2. Root Cause Analysis (Typical)
- **Excessive Cache TTL:** Activity endpoints cached for 24–48 hours, delaying visibility of new events.
- **Polling-Only Architecture:** Frontend relies on long-interval HTTP polling or page refreshes.
- **Lack of Event Propagation:** Activity creation does not trigger immediate downstream notifications or cache invalidation.
- **Inefficient Query Patterns:** Lack of time-based pagination or incremental fetching forces full dataset reloads.

## 3. Proposed Architecture
Adopt a **hybrid real-time strategy**:
- **Primary:** WebSocket or Server-Sent Events (SSE) for push-based live updates.
- **Fallback:** Short-interval HTTP polling with incremental `?since=<timestamp>` parameter for environments with WebSocket restrictions.
- **Cache Layer:** Drastically reduce TTL (5–15 minutes) + implement publish/subscribe cache invalidation on activity creation.
- **Database:** Optimize time-series indexing and support efficient range queries for incremental fetches.

## 4. Implementation Steps

### 4.1 Backend Changes
| Component | Action |
|-----------|--------|
| **API Endpoints** | Add `GET /api/activity?since=<unix_timestamp>&limit=50` for incremental fetching |
| **Caching** | Reduce Redis/CDN TTL to `300s`. Implement cache invalidation via pub/sub on insert |
| **Event Bus** | Publish `activity.created` / `activity.updated` events to Redis Pub/Sub, Kafka, or AWS EventBridge |
| **Real-Time Gateway** | Spin up WebSocket/SSE server broadcasting subscribed events to authenticated clients |
| **Rate Limiting** | Apply per-user connection limits (e.g., 3 concurrent streams) and message throttling |

### 4.2 Frontend Changes
| Component | Action |
|-----------|--------|
| **Connection Manager** | Initialize WebSocket/SSE on component mount. Implement exponential backoff reconnect |
| **State Sync** | Merge incoming real-time payloads with local state. Deduplicate by `event_id` |
| **Optimistic UI** | Append new items immediately, then reconcile with backend on confirmation |
| **Fallback Strategy** | Detect connection failure → switch to incremental polling every 15–30s |
| **Performance Guard** | Virtualize list, debounce rapid updates, cap visible DOM nodes |

### 4.3 Caching & Data Strategy
- **Write-Through/Cache-Aside Hybrid:** On new activity, write to DB → publish event → invalidate relevant cache keys.
- **Time-Bucketed Keys:** `activity:stream:{user_id}:{YYYY-MM-DD}` to allow granular invalidation.
- **Stale-While-Revalidate:** Serve cached data for ≤5s while fetching fresh data in background to prevent UI flicker.

## 5. Code Examples

### Backend: Redis Pub/Sub + WebSocket Broadcast (Node.js)
```javascript
const redis = require('redis');
const { WebSocketServer } = require('ws');

const pubClient = redis.createClient();
const subClient = pubClient.duplicate();
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('close', () => subClient.unsubscribe('activity:stream'));
  subClient.subscribe('activity:stream');
});

subClient.on('message', (channel, message) => {
  const event = JSON.parse(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'activity_new', payload: event }));
    }
  });
});

// Triggered on activity creation in DB handler
async function broadcastActivity(activity) {
  await pubClient.publish('activity:stream', JSON.stringify({
    id: activity.id,
    user_id: activity.user_id,
    action: activity.action,
    timestamp: Date.now()
  }));
}
```

### Frontend: React WebSocket Hook with Fallback
```javascript
import { useEffect, useState, useCallback } from 'react';

export function useActivityStream(initialData) {
  const [activities, setActivities] = useState(initialData);
  const [wsReady, setWsReady] = useState(false);

  useEffect(() => {
    if (!wsReady) return;
    const ws = new WebSocket(`${process.env.REALTIME_URL}/activity`);
    
    ws.onmessage = (e) => {
      const { type, payload } = JSON.parse(e.data);
      if (type === 'activity_new') {
        setActivities(prev => {
          if (prev.find(a => a.id === payload.id)) return prev;
          return [payload, ...prev].slice(0, 100); // Keep last 100
        });
      }
    };

    ws.onclose = () => setWsReady(false);
    return () => ws.close();
  }, [wsReady]);

  // Fallback polling hook omitted for brevity
  return { activities, wsReady, setWsReady };
}
```

## 6. Performance & Reliability Considerations
- **Message Volume Control:** Batch high-frequency events (e.g., 500ms window) before broadcasting.
- **Connection Pooling:** Use reverse proxy (Nginx/Envoy) or managed service (Pusher, Ably, AWS API Gateway WS) for horizontal scaling.
- **Memory Management:** Evict inactive subscriptions after 15s of inactivity. Implement heartbeat/ping-pong.
- **Security:** Validate JWT/session on WebSocket upgrade. Sanitize payloads. Enforce CORS/origin checks.
- **Database Load:** Avoid full table scans. Use composite index: `(user_id, created_at DESC)`.

## 7. Testing Strategy
| Test Type | Scope | Success Metric |
|-----------|-------|----------------|
| **Unit** | Event serialization, cache key generation, deduplication logic | 100% branch coverage |
| **Integration** | DB insert → pub/sub → WebSocket delivery → frontend state update | < 2s end-to-end latency |
| **Load** | 1k concurrent connections, 50 events/sec | CPU < 70%, memory stable, 0 dropped messages |
| **E2E** | Real user flow: trigger activity → verify UI update without refresh | Visible within 3s on 3G+ |
| **Failure** | Network drop, Redis outage, invalid payload | Graceful fallback to polling, no crash |

## 8. Deployment & Monitoring
- **Feature Flag:** `activity_stream_realtime_enabled` (0% → 10% → 50% → 100%)
- **Metrics to Track:**
  - Message delivery latency (p50, p95, p99)
  - WebSocket connection success/failure rate
  - Cache hit ratio & invalidation frequency
  - Fallback polling activation count
- **Alerts:**
  - Delivery latency > 5s for 5m
  - Connection drop rate > 3%
  - Error rate on `/api/activity?since=` endpoint > 1%

## 9. Acceptance Criteria
- [ ] Activity appears in the stream within **≤3 seconds** of creation under normal load.
- [ ] No data remains visible that is older than **24 hours** without explicit user request for history.
- [ ] Cache TTL reduced to **≤5 minutes** with pub/sub invalidation on writes.
- [ ] Frontend gracefully falls back to incremental polling when real-time connection fails.
- [ ] System sustains **≥1,000 concurrent stream connections** without degradation.
- [ ] All integration and load tests pass with p95 latency < 2s.
- [ ] Real-time toggle deployed behind feature flag with monitoring dashboards active.