# Layout Background Cleanup: Unify Background Styling

## Decision & Rationale
- **Single Source of Truth:** `layout.tsx`
- **Chosen Background:** `bg-slate-50`
- **Rationale:** 
  - Layouts are intended to provide consistent base styling across the entire application.
  - Defining the background at the layout level eliminates CSS specificity battles, reduces duplication, and ensures predictable rendering across all routes.
  - `bg-slate-50` offers subtle contrast for UI components, improves visual hierarchy, and is easier on the eyes than pure `bg-white`.

## Implementation Steps
1. Remove `bg-white` from `page.tsx` (and any other route files that may inherit this override).
2. Confirm `bg-slate-50` is applied to the root container in `layout.tsx`.
3. Clear build cache and verify visual consistency across development and production builds.

## Code Changes

### `app/layout.tsx`
```tsx
// ✅ No changes required. This file remains the authoritative source.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
```

### `app/page.tsx`
```tsx
// ❌ BEFORE
export default function HomePage() {
  return (
    <main className="bg-white min-h-screen p-6 md:p-10">
      <h1>Welcome</h1>
      {/* Page content */}
    </main>
  );
}

// ✅ AFTER
export default function HomePage() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <h1>Welcome</h1>
      {/* Page content */}
    </main>
  );
}
```

## Verification Checklist
- [ ] Start dev server and navigate to the homepage
- [ ] Use browser DevTools → Elements/Styles to confirm `bg-slate-50` is applied to `<body>` or layout wrapper
- [ ] Confirm `bg-white` is no longer present in the computed styles for the page container
- [ ] Test 2–3 additional routes to verify they inherit the correct background
- [ ] Run `npm run lint` (or equivalent) to ensure no unused Tailwind class warnings
- [ ] Validate responsive behavior and ensure no layout shift or contrast issues

## Notes & Best Practices
- **Route-Specific Backgrounds:** If a future route requires a different background (e.g., a dashboard with `bg-gray-900`), apply it to a route-specific wrapper or use Tailwind's `dark:`/custom classes rather than overriding the layout.
- **Theme Consistency:** Consider extracting the background value to `tailwind.config.ts` or CSS variables if the project scales: `--bg-primary: theme('colors.slate.50')`
- **Avoid Layout Overrides:** Page components should focus on content structure and data fetching, leaving global styling to the layout layer.