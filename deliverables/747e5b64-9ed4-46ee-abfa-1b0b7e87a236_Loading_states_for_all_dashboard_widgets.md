# Loading States Implementation for Dashboard Widgets

## 1. Overview
This deliverable provides a standardized, production-ready implementation for adding `isLoading` states and skeleton/spinner UI across six dashboard widgets:
- `TodaySummary`
- `PriceCharts`
- `ActiveCycles`
- `WinnerFeed`
- `SupplierLeaderboard`
- `LiveTicker`

The implementation follows a component-driven architecture with reusable loading primitives, consistent conditional rendering, and accessible fallback states.

---

## 2. Shared Loading Primitives

### 2.1 `WidgetSkeleton.tsx`
A flexible skeleton component that adapts to different widget layouts using CSS/Tailwind placeholders.

```tsx
// components/WidgetSkeleton.tsx
import React from 'react';

interface WidgetSkeletonProps {
  variant: 'summary' | 'chart' | 'list' | 'feed' | 'ticker';
  className?: string;
}

const SkeletonBlock: React.FC<{ width?: string; height?: string; rounded?: string }> = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-md',
}) => (
  <div className={`${width} ${height} ${rounded} bg-gray-200 animate-pulse`} />
);

export const WidgetSkeleton: React.FC<WidgetSkeletonProps> = ({ variant, className = '' }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'summary':
        return (
          <div className="space-y-4 p-4">
            <SkeletonBlock height="h-6" width="w-1/3" />
            <div className="flex gap-4">
              <SkeletonBlock height="h-12" width="w-1/4" />
              <SkeletonBlock height="h-12" width="w-1/4" />
              <SkeletonBlock height="h-12" width="w-1/4" />
            </div>
          </div>
        );
      case 'chart':
        return (
          <div className="space-y-3 p-4">
            <SkeletonBlock height="h-6" width="w-1/2" />
            <div className="h-48 w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="flex gap-2">
              <SkeletonBlock width="w-1/5" />
              <SkeletonBlock width="w-1/5" />
              <SkeletonBlock width="w-1/5" />
            </div>
          </div>
        );
      case 'list':
      case 'feed':
        return (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock width="w-10" height="h-10" rounded="rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock />
                  <SkeletonBlock width="w-2/3" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'ticker':
        return (
          <div className="flex gap-4 overflow-hidden p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} width="w-32" height="h-8" />
            ))}
          </div>
        );
      default:
        return <SkeletonBlock height="h-32" />;
    }
  };

  return (
    <div className={`w-full rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {renderSkeleton()}
    </div>
  );
};
```

### 2.2 `LoadingSpinner.tsx` (Fallback/Overlay)
```tsx
// components/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center p-6">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`} />
    </div>
  );
};
```

---

## 3. Universal Widget Pattern

Wrap each widget with a consistent `isLoading` gate. This pattern should be applied to all six components.

```tsx
// Example: components/WidgetWrapper.tsx
import React from 'react';
import { WidgetSkeleton } from './WidgetSkeleton';
import { LoadingSpinner } from './LoadingSpinner';

interface WidgetWrapperProps {
  isLoading: boolean;
  variant: 'summary' | 'chart' | 'list' | 'feed' | 'ticker';
  children: React.ReactNode;
  className?: string;
  spinnerFallback?: boolean;
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  isLoading,
  variant,
  children,
  className = '',
  spinnerFallback = false,
}) => {
  if (isLoading) {
    return spinnerFallback ? <LoadingSpinner /> : <WidgetSkeleton variant={variant} className={className} />;
  }

  return <>{children}</>;
};
```

---

## 4. Per-Widget Integration Guide

| Widget | Variant | `isLoading` Source | Implementation Snippet |
|--------|---------|-------------------|------------------------|
| `TodaySummary` | `summary` | Data fetch hook (e.g., `useTodayMetrics()`) | `<WidgetWrapper isLoading={isLoading} variant="summary"><TodaySummaryContent data={data} /></WidgetWrapper>` |
| `PriceCharts` | `chart` | Chart data query (e.g., `usePriceHistory()`) | `<WidgetWrapper isLoading={isLoading} variant="chart"><PriceChartsContent data={data} /></WidgetWrapper>` |
| `ActiveCycles` | `list` | Cycles query (e.g., `useActiveCycles()`) | `<WidgetWrapper isLoading={isLoading} variant="list"><ActiveCyclesContent data={data} /></WidgetWrapper>` |
| `WinnerFeed` | `feed` | Feed stream/query (e.g., `useWinnerFeed()`) | `<WidgetWrapper isLoading={isLoading} variant="feed"><WinnerFeedContent data={data} /></WidgetWrapper>` |
| `SupplierLeaderboard` | `list` | Leaderboard query (e.g., `useLeaderboard()`) | `<WidgetWrapper isLoading={isLoading} variant="list"><SupplierLeaderboardContent data={data} /></WidgetWrapper>` |
| `LiveTicker` | `ticker` | Ticker subscription/query (e.g., `useLiveTicker()`) | `<WidgetWrapper isLoading={isLoading} variant="ticker"><LiveTickerContent data={data} /></WidgetWrapper>` |

### Example Implementation: `TodaySummary.tsx`
```tsx
import React from 'react';
import { WidgetWrapper } from './WidgetWrapper';
import { useTodayMetrics } from '@/hooks/useTodayMetrics';

export const TodaySummary: React.FC = () => {
  const { data, isLoading } = useTodayMetrics();

  return (
    <WidgetWrapper isLoading={isLoading} variant="summary">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Today's Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          {data?.metrics.map((m, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">{m.label}</p>
              <p className="text-xl font-bold">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </WidgetWrapper>
  );
};
```

---

## 5. Data Fetching & State Management Integration

Ensure `isLoading` accurately reflects data lifecycle states. Recommended pattern using React Query / SWR:

```tsx
// hooks/useWidgetData.ts
import { useQuery } from '@tanstack/react-query';

export const useWidgetData = (key: string, fetcher: () => Promise<any>) => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [key],
    queryFn: fetcher,
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    data,
    // Combine initial load + background refetch states
    isLoading: isLoading || isFetching,
    error,
  };
};
```

**State Mapping Rules:**
- `isLoading = true` → Show skeleton
- `isLoading = false && data` → Show content
- `isLoading = false && error` → Show error banner (optional extension)
- `isLoading = false && !data` → Show empty state component

---

## 6. Testing & QA Checklist

| Test Case | Expected Behavior | Tool/Method |
|-----------|------------------|-------------|
| Initial mount with slow network | Skeleton renders immediately, no layout shift | Cypress / Playwright + network throttling |
| Data resolves | Skeleton smoothly transitions to content | Unit test with `@testing-library/react` + mocked delay |
| Refetch triggered | Optional inline spinner or maintained skeleton (based on UX spec) | Manual QA + React DevTools |
| Error state | Skeleton unmounts, error UI displays | Mock API failure in test suite |
| Accessibility | `aria-busy="true"` on skeleton container, screen readers announce loading | axe DevTools / NVDA / VoiceOver |

### Accessibility Enhancement (Recommended)
Add to `WidgetWrapper`:
```tsx
<div role="status" aria-busy={isLoading} aria-live="polite" className={className}>
  {isLoading ? <WidgetSkeleton variant={variant} /> : children}
  <span className="sr-only">{isLoading ? 'Loading widget data...' : 'Data loaded'}</span>
</div>
```

---

## 7. Deployment Notes
1. Ensure skeleton styles match your design system's spacing, border radius, and animation speed.
2. If using CSS modules instead of Tailwind, replace utility classes with equivalent scoped CSS.
3. For server-side rendering (Next.js/Remix), ensure skeletons render on initial paint to prevent hydration mismatches.
4. Monitor bundle size: skeleton components are lightweight, but avoid importing heavy chart libraries during loading states.