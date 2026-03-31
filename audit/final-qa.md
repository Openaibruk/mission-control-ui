# Final QA — Commits 41bb00e and a9980bc

## TypeScript Errors (from `tsc --noEmit`)

### Error 1: Missing `ExternalLink` import in TaskModal.tsx
**File:** `src/components/shared/TaskModal.tsx` — Lines ~197, ~213  
**Error:** `TS2552: Cannot find name 'ExternalLink'`  
**Cause:** `ExternalLink` is used in the done-task output preview but was not added to the lucide-react import.  
**Fix:**
```typescript
// Line 7
import { X, Save, Trash2, Eye, CheckCircle2, ExternalLink } from 'lucide-react';
```

### Error 2: Missing `FolderOpen` import in FilesView.tsx
**File:** `src/components/views/FilesView.tsx` — Line ~159  
**Error:** `TS2304: Cannot find name 'FolderOpen'`  
**Cause:** The new Deliverables section uses `<FolderOpen>` but it's not in the imports.  
**Fix:**
```typescript
// Line 1
import { Search, Download, FileText, FileJson, File, X, RefreshCw, Eye, HardDrive, Filter, Clock, ExternalLink, CheckCircle, FolderOpen } from 'lucide-react';
```

### Error 3: `next.config.ts` — `eslint` property on NextConfig
**File:** `next.config.ts` — Line 5  
**Error:** `TS2353: 'eslint' does not exist in type 'NextConfig'`  
**Cause:** The `eslint` config property was removed in recent Next.js versions.  
**Fix:** Remove or move the `eslint` block out of the NextConfig export (it's a lint config, not Next.js config).

### Error 4: Union type mismatch in `/api/deliverables/route.ts`
**File:** `src/app/api/deliverables/route.ts` — Lines 60, 67, 68, 72  
**Error:** `driveId` and `project` don't exist on all union members (some entries omit them)  
**Cause:** The `as const` creates a tuple union where some entries lack `driveId`. The `.filter()` and `.map()` operations narrow to potentially shorter arrays, breaking type inference.  
**Fix:** Define a proper interface and remove `as const`:
```typescript
interface DeliverableEntry {
  name: string;
  filename: string;
  type: string;
  size: string;
  driveId?: string;
  project: string;
}
const ALL_DELIVERABLES: DeliverableEntry[] = [ ... ];  // no `as const`
```

---

## API Route Response Issues

### `/api/model` POST — Always Returns Error
The POST handler now rejects all model-change requests with 503. This is **intentional** (can't write config or restart on Vercel serverless), but the response should still return `200` with a helpful message for the UI to display, rather than erroring. Currently returns `{ error: '...' }` — UI may treat this as failure.

### `/api/news-fetch` POST — No Persistence
Results are returned directly with no caching mechanism. The note in the response acknowledges this. Not broken, but means news won't persist between requests on serverless.

---

## JSX Syntax — ✅ No Issues Found

Manual review of all changed JSX files (AgentModal, ProjectDetailView, FilesView deliverables section, KanbanBoard, TaskModal, ErrorBoundary) shows no broken JSX.

---

## Summary: 4 Actionable Fixes

| # | File | Issue | Severity |
|---|------|-------|----------|
| 1 | `TaskModal.tsx` | Missing `ExternalLink` import | 🔴 Will break build |
| 2 | `FilesView.tsx` | Missing `FolderOpen` import | 🔴 Will break build |
| 3 | `next.config.ts` | `eslint` not on NextConfig type | 🟡 Type error, may not block build |
| 4 | `deliverables/route.ts` | Union type missing `driveId`/`project` | 🔴 Type error |
