# Empty States Redesign: Icons & Copy Specification

## 📋 Overview
This document defines the standardized empty state design for all data-driven components. Each empty state now follows a consistent three-part structure: **Icon**, **Title**, and **Subtext**. The goal is to improve user orientation, reduce cognitive load, and provide actionable guidance when no data is available.

---

## 🎨 Design System Guidelines

| Element | Specification |
|---------|---------------|
| **Layout** | Centered vertically & horizontally within the component container |
| **Container Padding** | `32px` (desktop), `24px` (mobile) |
| **Icon** | `48×48px`, line-style, `var(--color-icon-secondary)` |
| **Title** | `font-size: 16px`, `font-weight: 600`, `var(--color-text-primary)` |
| **Subtext** | `font-size: 14px`, `font-weight: 400`, `var(--color-text-secondary)`, max 2 lines |
| **Spacing** | `16px` between icon, title, and subtext |
| **Accessibility** | `role="status"`, `aria-live="polite"`, semantic `<section>` wrapper, sufficient contrast (≥ 4.5:1) |

---

## 📦 Component Specifications

### 1. `PriceCharts`
- **Icon:** `ChartLineEmpty` (dashed line chart with placeholder axes)
- **Title:** No Price Data Available
- **Subtext:** Price history will appear here once tracking begins. Add a product to start monitoring market trends.

### 2. `ActiveCycles`
- **Icon:** `CycleEmpty` (circular arrows with a subtle pause/dash indicator)
- **Title:** No Active Cycles
- **Subtext:** Create or join a bidding cycle to see real-time activity and deadlines here.

### 3. `SupplierLeaderboard`
- **Icon:** `PodiumEmpty` (three-tier podium with muted/outline styling)
- **Title:** Leaderboard Unavailable
- **Subtext:** Supplier rankings will populate once performance metrics and bid data are collected.

### 4. `WinnerFeed`
- **Icon:** `AwardEmpty` (star or checkmark badge in outline style)
- **Title:** No Recent Winners
- **Subtext:** Winning bids and award announcements will appear here as they are finalized.

---

## 💻 Reusable Implementation (React/TypeScript)

```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ReactNode | LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <section
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-4 text-gray-400">
        {typeof Icon === 'function' ? <Icon size={48} strokeWidth={1.5} /> : Icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
      <p className="max-w-xs text-sm text-gray-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </section>
  );
};
```

### Usage Example
```tsx
import { ChartBar, EmptyState } from '@/components';

// Inside PriceCharts.tsx
{hasData ? <ChartComponent /> : (
  <EmptyState
    icon={ChartBar}
    title="No Price Data Available"
    description="Price history will appear here once tracking begins. Add a product to start monitoring market trends."
  />
)}
```

---

## ✅ Implementation Checklist

- [ ] Replace all inline empty-state logic with the shared `<EmptyState />` component
- [ ] Verify icon assets match the outlined style (outline/line, 48px, secondary color)
- [ ] Confirm copy matches exact strings for localization/i18n pipeline
- [ ] Test empty state rendering on mobile, tablet, and desktop breakpoints
- [ ] Validate `aria-live` and screen reader output for dynamic data loads
- [ ] Ensure loading skeletons are visually distinct from empty states
- [ ] Add unit tests for empty state rendering per component

---

## 📝 Notes for Handoff
- Icons should be sourced from the approved design library (e.g., Lucide, Feather, or custom SVG set).
- Copy strings are ready for i18n key mapping (e.g., `emptyState.priceCharts.title`).
- If an actionable CTA is needed in the future, the `action` prop is pre-supported in the reusable component.