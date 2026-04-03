# SupplierLeaderboard N+1 Query Refactor

## 📋 Overview
Refactor the supplier leaderboard data retrieval to eliminate the N+1 query anti-pattern by consolidating per-supplier metric lookups into a single aggregated `GROUP BY` query. This change reduces database round trips, lowers latency, and improves application scalability.

## 🚨 Current State (Problem)
- **Pattern:** N+1 query anti-pattern
- **Behavior:** Application fetches a list of `N` active suppliers, then executes an individual query per supplier to calculate leaderboard metrics (e.g., total revenue, order count, average rating).
- **Impact:** 
  - `N + 1` database round trips (e.g., 51 queries for 50 suppliers)
  - High network latency and connection pool exhaustion under concurrent load
  - Unnecessary CPU/memory overhead on the database server
  - Linear performance degradation as the supplier base grows

## ✅ Target State (Solution)
- **Pattern:** Single aggregated query
- **Behavior:** Retrieve all supplier metrics in one execution using `JOIN`, `GROUP BY`, and aggregate functions (`SUM`, `COUNT`, `AVG`).
- **Impact:** 
  - Exactly `1` database round trip
  - Predictable, constant-time DB call complexity regardless of supplier count
  - Reduced connection pool contention and faster response times

## 💻 Implementation Details

### Before (N+1 Pattern)
```sql
-- Query 1: Fetch supplier list
SELECT id, name FROM suppliers WHERE is_active = true;

-- Query N: Executed in a loop per supplier
SELECT 
  COUNT(o.id) AS total_orders,
  SUM(o.amount) AS total_revenue,
  AVG(r.score) AS avg_rating
FROM orders o
LEFT JOIN reviews r ON r.order_id = o.id
WHERE o.supplier_id = ?; -- Parameterized per supplier iteration
```

### After (Single Aggregated Query)
```sql
SELECT 
  s.id AS supplier_id,
  s.name AS supplier_name,
  COUNT(DISTINCT o.id) AS total_orders,
  COALESCE(SUM(o.amount), 0) AS total_revenue,
  COALESCE(AVG(r.score), 0) AS avg_rating
FROM suppliers s
LEFT JOIN orders o ON o.supplier_id = s.id
LEFT JOIN reviews r ON r.order_id = o.id
WHERE s.is_active = true
GROUP BY s.id, s.name
ORDER BY total_revenue DESC;
```

### Backend Integration Example (Pseudocode)
```python
# Before
suppliers = db.query("SELECT id, name FROM suppliers WHERE is_active = true")
leaderboard = []
for supplier in suppliers:
    metrics = db.query("SELECT COUNT(*), SUM(amount), AVG(rating) FROM orders WHERE supplier_id = ?", supplier.id)
    leaderboard.append({**supplier, **metrics})

# After
leaderboard = db.query("""
    SELECT s.id, s.name, COUNT(DISTINCT o.id) as orders, 
           COALESCE(SUM(o.amount), 0) as revenue, 
           COALESCE(AVG(r.score), 0) as rating
    FROM suppliers s
    LEFT JOIN orders o ON o.supplier_id = s.id
    LEFT JOIN reviews r ON r.order_id = o.id
    WHERE s.is_active = true
    GROUP BY s.id, s.name
    ORDER BY revenue DESC;
""")
# Data is already shaped for direct mapping to leaderboard response
```

## 📈 Expected Performance Impact
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| DB Round Trips | `N + 1` (e.g., 51) | `1` | ~98% reduction |
| Query Execution Time | `~10-50ms × N` | `~15-30ms total` | ~80-90% faster |
| Connection Pool Usage | High (spikes under load) | Low/Consistent | Eliminates contention |
| Scalability | Degrades linearly with `N` | Constant DB call complexity | O(N) → O(1) DB calls |

## 🧪 Testing & Validation Plan
- [ ] **Data Parity Test:** Compare aggregated query results against the sum of individual N+1 queries on a staging dataset.
- [ ] **Edge Cases:** Verify correct handling of suppliers with zero orders, null ratings, or newly activated status.
- [ ] **Query Plan Analysis:** Run `EXPLAIN ANALYZE` to confirm index usage on `supplier_id`, `is_active`, and join keys. Ensure no full table scans or temporary tables.
- [ ] **Load Testing:** Simulate 50–500 concurrent requests to verify connection pool stability and p95 latency < 100ms.
- [ ] **API Contract Validation:** Ensure response payload structure, data types, and sorting order remain unchanged for frontend consumers.

## 🚀 Deployment & Rollback Strategy
- **Deployment:**
  1. Introduce new query method behind a feature flag or parallel execution path.
  2. Validate against staging with production-like data volume.
  3. Enable via config toggle; monitor DB slow-query log, CPU, and app latency.
  4. Remove legacy N+1 code path after 48 hours of stable metrics.
- **Rollback:**
  - Revert feature flag to re-enable legacy logic.
  - Zero schema changes required; rollback is instantaneous and risk-free.

## ✅ Acceptance Criteria
- [ ] All supplier leaderboard metrics are fetched in exactly 1 database query.
- [ ] Response payload is functionally identical to the previous implementation.
- [ ] `EXPLAIN` output confirms efficient index usage and no row multiplication artifacts.
- [ ] Load testing confirms stable connection pool and < 100ms p95 latency.
- [ ] Code review approved, tests pass, and branch merged to main.