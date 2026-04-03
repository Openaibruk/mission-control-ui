# ActiveCycles Date Handling: Support Date-Only Cycles Properly

## 📋 Problem Statement
Cycles stored as date-only strings (e.g., `"2024-05-15"`) are implicitly parsed as UTC midnight (`2024-05-15T00:00:00Z`). For users in timezones ahead of UTC (e.g., GMT+3), this causes the cycle to expire at `03:00` local time instead of the intended end-of-day boundary. This results in premature expiry, incorrect UI states, and potential business logic failures.

## 🔍 Root Cause Analysis
- **Implicit UTC Assumption:** Date-only strings lack timezone context. Most parsers default to `UTC+0` at `00:00:00`.
- **Boundary Mismatch:** Business logic expects "end of day" behavior but compares against UTC midnight.
- **Schema Limitation:** Storing as `DATE` or `VARCHAR` discards timezone intent, forcing runtime interpretation that varies across environments.

## 💡 Proposed Solutions

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **A. Store `timestamptz` (Recommended)** | Convert date-only inputs to explicit, timezone-aware timestamps before persistence. | Eliminates ambiguity, scales globally, aligns with ISO 8601 best practices. | Requires schema migration & backfill. |
| **B. Adjust Interpretation Logic** | Keep date-only storage but modify parsing/comparison to treat as `23:59:59` in the target timezone. | No DB changes, faster short-term fix. | Fragile across DST, requires consistent timezone resolution everywhere. |

**Recommendation:** Implement **Approach A** for long-term reliability, with a fallback compatibility layer during migration.

## 🛠 Implementation Details

### 1. Application Layer: Timezone-Aware Conversion
```typescript
// utils/date.ts
import { format, endOfDay, toZonedTime } from 'date-fns-tz';

/**
 * Converts a date-only string to a UTC timestamp representing 
 * the end of the day in the specified timezone.
 */
export function dateOnlyToUtcTimestamp(dateStr: string, timeZone: string = 'UTC'): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  const endOfLocalDay = endOfDay(toZonedTime(localDate, timeZone));
  // Return ISO 8601 UTC string for consistent storage
  return format(endOfLocalDay, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timeZone: 'UTC' });
}

// Usage:
// dateOnlyToUtcTimestamp('2024-05-15', 'Europe/Moscow') 
// → '2024-05-15T20:59:59.999Z' (GMT+3 end of day)
```

### 2. Database Schema Migration
```sql
-- PostgreSQL example
ALTER TABLE active_cycles 
  ALTER COLUMN expiry_date TYPE TIMESTAMPTZ 
  USING expiry_date::DATE + INTERVAL '23:59:59.999' AT TIME ZONE 'UTC';

-- Add index if frequently queried
CREATE INDEX idx_active_cycles_expiry_tz ON active_cycles (expiry_date);
```

### 3. Comparison & Expiry Logic Update
```typescript
function isCycleExpired(expiryTimestamp: string, now: Date = new Date()): boolean {
  const expiry = new Date(expiryTimestamp);
  // Ensure both are compared in UTC
  return now.getTime() >= expiry.getTime();
}
```

## 🔄 Migration & Backwards Compatibility Strategy
1. **Dual-Write Phase:** Write to both old `DATE`/`VARCHAR` and new `timestamptz` columns.
2. **Backfill Script:** Migrate historical records using application timezone defaults or user profile data.
3. **Feature Flag:** Route reads through the new logic via `ENABLE_TIMEZONE_AWARE_CYCLES`.
4. **Deprecation:** Drop legacy column after verification period (e.g., 2 release cycles).

## 🧪 Testing Plan
| Test Category | Cases |
|---------------|-------|
| **Unit** | - Date parsing for UTC, GMT+3, GMT-5<br>- DST boundary dates (spring forward/fall back)<br>- Leap year handling |
| **Integration** | - Cycle expiry triggers at correct local time<br>- API round-trip preserves timezone intent<br>- DB query filters work with `timestamptz` |
| **Edge Cases** | - `"2024-02-29"` validation<br>- Timezone format mismatches (`Europe/London` vs `GMT`)<br>- Null/invalid date strings |

## 📈 Impact & Benefits
- ✅ Eliminates premature expiry for non-UTC timezones
- ✅ Standardizes date handling across services & clients
- ✅ Simplifies future features (e.g., user-specific timezone preferences, scheduling)
- ✅ Reduces timezone-related production incidents

## 📋 Next Steps / Checklist
- [ ] Audit all services consuming `ActiveCycles` expiry dates
- [ ] Implement `dateOnlyToUtcTimestamp` utility & update parsing layer
- [ ] Draft & test DB migration script in staging
- [ ] Add timezone-aware unit & integration tests
- [ ] Deploy behind feature flag, monitor expiry metrics for 72h
- [ ] Remove legacy column & clean up compatibility code