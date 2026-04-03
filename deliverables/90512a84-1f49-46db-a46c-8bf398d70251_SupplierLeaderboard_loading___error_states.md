# SupplierLeaderboard: Loading & Error States Implementation

## 📋 Overview
Resolves the issue where the `SupplierLeaderboard` incorrectly displays "No supplier data" during asynchronous data fetching. This deliverable implements distinct, mutually exclusive UI states for **Loading**, **Error**, and **Empty/No Data**, ensuring accurate user feedback throughout the request lifecycle.

## 🔄 State Definitions & Rendering Priority
| State | Trigger Condition | UI Behavior |
|-------|-------------------|-------------|
| `loading` | Initial fetch or retry in progress | Display skeleton/spinner, disable interactions |
| `error` | Network failure, timeout, or API 4xx/5xx | Display error message + retry action |
| `empty` | Successful fetch, `data.length === 0` | Display "No supplier data" placeholder |
| `success` | Successful fetch, `data.length > 0` | Render leaderboard table/grid |

*Rendering Order:* `error` → `loading` → `empty` → `success` (prevents race conditions and ensures correct state precedence).

## 💻 Implementation (React/TypeScript)
```tsx
import React, { useState, useEffect } from 'react';
import { Spinner, ErrorMessage, EmptyState, LeaderboardTable, SkeletonGrid } from './ui-components';
import { fetchSupplierData } from './api';

export const SupplierLeaderboard: React.FC = () => {
  const [data, setData] = useState<Supplier[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchSupplierData();
      setData(response.suppliers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load supplier data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Error State (Highest Priority)
  if (error) {
    return (
      <div className="leaderboard-container" aria-live="polite">
        <ErrorMessage 
          message={error} 
          onRetry={loadData} 
        />
      </div>
    );
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="leaderboard-container" aria-busy="true">
        <span className="sr-only">Loading supplier leaderboard...</span>
        <SkeletonGrid rows={5} />
      </div>
    );
  }

  // 3. Empty State (Only shown after loading completes)
  if (!data || data.length === 0) {
    return (
      <div className="leaderboard-container" aria-live="polite">
        <EmptyState message="No supplier data available." />
      </div>
    );
  }

  // 4. Success State
  return (
    <div className="leaderboard-container">
      <LeaderboardTable suppliers={data} />
    </div>
  );
};
```

## 🛠 State Handling Logic
- **Fetch Lifecycle:** `isLoading` is explicitly set to `true` on mount/retry and reset in the `finally` block to guarantee cleanup regardless of outcome.
- **Error Boundary:** Wrap component in a project-level Error Boundary to catch unhandled JavaScript runtime errors separate from API failures.
- **Retry Mechanism:** `onRetry` resets `error` and `isLoading`, then re-triggers `loadData()` to prevent stale UI states.
- **Evaluation Order:** Strict conditional rendering prevents the previous bug where `data === null` during fetch incorrectly triggered the empty state.

## ✅ Testing & Validation Checklist
- [ ] **Loading State:** Verify skeleton/spinner appears immediately on mount and during manual refresh. Confirm no layout shift (CLS < 0.1).
- [ ] **Error State:** Simulate network failure (DevTools offline mode or mock `500` response). Confirm error UI renders with functional retry button.
- [ ] **Empty State:** Mock successful response with `[]`. Confirm "No supplier data" displays **only** after `isLoading` becomes `false`.
- [ ] **Success State:** Mock valid data array. Confirm leaderboard renders without flickering or state flash.
- [ ] **Accessibility:** Verify `aria-live="polite"` containers announce state changes to screen readers. Ensure focus management after retry.

## 🎨 UX & Accessibility Guidelines
- **Loading:** Use `aria-busy="true"` on the container. Include a visually hidden text label (`sr-only`) for screen readers.
- **Error:** Use semantic `<p role="alert">` for error messages. Ensure text meets WCAG AA contrast ratios. Avoid red-only indicators.
- **Empty State:** Provide contextual guidance if applicable (e.g., `"Check back later or adjust your filters."`).
- **Performance:** Prefer skeleton screens over spinners to maintain layout stability and improve perceived performance.

## 📦 Integration Notes
- Requires `Spinner`, `ErrorMessage`, `EmptyState`, and `SkeletonGrid` from the shared UI library.
- API client (`fetchSupplierData`) must throw on non-`2xx` responses to correctly trigger the `catch` block.
- *Scalability Note:* If the project adopts React Query, SWR, or RTK Query, this manual state management can be replaced with built-in `isLoading`, `isError`, and `data` properties for automatic caching, retries, and background refetching.