# Seed Script: Active Bidding Cycle & Recent Bids

## Overview
This SQL seed script populates the database with demo data required for the `TodaySummary` and `LiveTicker` UI components. It ensures:
- At least one `active` bidding cycle exists
- ~20 recent bids are distributed across the last 4 hours
- Data is safely wrapped in a transaction for atomic execution

## Schema Assumptions
The script assumes the following table structures. Adjust column names/types if your actual schema differs:
- `dc_bidding_cycle`: `id`, `name`, `status`, `start_time`, `end_time`, `created_at`, `updated_at`
- `dc_bids`: `id`, `bidding_cycle_id`, `user_id`, `amount`, `created_at`, `status`

## SQL Seed Script
```sql
BEGIN;

-- 1. Create/Update Active Bidding Cycle
INSERT INTO dc_bidding_cycle (
    id, name, status, start_time, end_time, created_at, updated_at
) VALUES (
    1,
    'Demo Live Cycle - Today',
    'active',
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '22 hours',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    status = 'active',
    start_time = NOW() - INTERVAL '2 hours',
    end_time = NOW() + INTERVAL '22 hours',
    updated_at = NOW();

-- 2. Insert ~20 Recent Bids (distributed across the last 4 hours)
INSERT INTO dc_bids (
    bidding_cycle_id, user_id, amount, created_at, status
) VALUES
    (1, 101, 150.00, NOW() - INTERVAL '3 hours 50 minutes', 'accepted'),
    (1, 102, 155.50, NOW() - INTERVAL '3 hours 30 minutes', 'accepted'),
    (1, 103, 160.00, NOW() - INTERVAL '3 hours 10 minutes', 'accepted'),
    (1, 101, 165.25, NOW() - INTERVAL '2 hours 50 minutes', 'accepted'),
    (1, 104, 170.00, NOW() - INTERVAL '2 hours 30 minutes', 'accepted'),
    (1, 102, 175.75, NOW() - INTERVAL '2 hours 10 minutes', 'accepted'),
    (1, 105, 180.00, NOW() - INTERVAL '1 hour 50 minutes', 'accepted'),
    (1, 103, 185.50, NOW() - INTERVAL '1 hour 30 minutes', 'accepted'),
    (1, 106, 190.00, NOW() - INTERVAL '1 hour 10 minutes', 'accepted'),
    (1, 101, 195.25, NOW() - INTERVAL '55 minutes', 'accepted'),
    (1, 107, 200.00, NOW() - INTERVAL '45 minutes', 'accepted'),
    (1, 102, 205.50, NOW() - INTERVAL '35 minutes', 'accepted'),
    (1, 108, 210.00, NOW() - INTERVAL '25 minutes', 'accepted'),
    (1, 104, 215.75, NOW() - INTERVAL '15 minutes', 'accepted'),
    (1, 109, 220.00, NOW() - INTERVAL '10 minutes', 'accepted'),
    (1, 103, 225.00, NOW() - INTERVAL '8 minutes', 'accepted'),
    (1, 110, 230.50, NOW() - INTERVAL '6 minutes', 'accepted'),
    (1, 105, 235.00, NOW() - INTERVAL '4 minutes', 'accepted'),
    (1, 101, 240.25, NOW() - INTERVAL '2 minutes', 'accepted'),
    (1, 111, 245.00, NOW() - INTERVAL '30 seconds', 'accepted');

COMMIT;
```

## Execution Instructions
1. Connect to your target environment database (PostgreSQL or compatible)
2. Execute the script exactly as provided to maintain transactional safety
3. If using MySQL/MariaDB, replace `NOW() - INTERVAL 'X'` with `DATE_SUB(NOW(), INTERVAL X)`
4. Clear application caches or trigger a hard refresh to reflect new data in `TodaySummary` and `LiveTicker`

## Verification Queries
```sql
-- Confirm active cycle exists
SELECT id, name, status, start_time, end_time 
FROM dc_bidding_cycle 
WHERE status = 'active';

-- Confirm bid count & time distribution (last 4 hours)
SELECT 
    COUNT(*) AS total_bids,
    MIN(created_at) AS oldest_bid,
    MAX(created_at) AS newest_bid
FROM dc_bids 
WHERE bidding_cycle_id = 1 
  AND created_at >= NOW() - INTERVAL '4 hours';
```

## Notes
- **Idempotency:** The `ON CONFLICT` clause ensures the cycle remains active and timestamps update safely if the seed is run multiple times
- **Foreign Keys:** Placeholder `user_id` values (101–111) are used. Replace with valid records if strict referential integrity is enforced in your environment
- **Demo Refresh:** Re-running the script automatically shifts all timestamps relative to `NOW()`, keeping the "last 4 hours" window accurate for repeated demo sessions