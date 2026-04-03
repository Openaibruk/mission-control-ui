# LanguageContext: Hydration Mismatch Fix

## 📋 Overview
Resolves React hydration mismatch warnings and eliminates the locale flash for users with saved language preferences. The fix aligns client-side state initialization with SSR constraints by leveraging React's lazy `useState` initializer pattern.

## 🐛 Problem Analysis
- **SSR Limitation:** `localStorage` is unavailable during server-side rendering, forcing the server to render a fallback locale (e.g., `en`).
- **Hydration Mismatch:** The client previously computed the locale eagerly or via `useEffect`, causing a DOM tree mismatch during hydration. React warns: `Text content did not match. Server: "en" Client: "fr"`.
- **Visual Flash:** Users with non-default preferences experienced a brief flash of the fallback language before the context updated.

## ✅ Solution
Pass the `getLang` function reference directly to `useState` instead of invoking it. This ensures lazy, single-execution initialization that aligns with React's hydration lifecycle.

### 📄 Code Changes

#### ❌ Before (Problematic)
```tsx
import { createContext, useState } from 'react';
import { getLang } from '@/utils/locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Eager invocation or useEffect sync causes mismatch & flash
  const [lang, setLang] = useState('en');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

#### ✅ After (Fixed)
```tsx
import { createContext, useState } from 'react';
import { getLang } from '@/utils/locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer: defers execution to first render & prevents double invocation
  const [lang, setLang] = useState(getLang);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

## 🔍 Implementation Details
1. **Lazy Initialization:** `useState(getLang)` passes a function reference. React guarantees it runs exactly once during the initial render, avoiding double-execution in Strict Mode.
2. **Hydration Consistency:** The initializer runs synchronously during the first client render. When `getLang()` is implemented correctly (see below), it returns the same value the server used, preventing hydration warnings.
3. **Flash Elimination:** Because the initial state is resolved before paint, the correct locale renders immediately without a fallback flash.

### 🔑 Prerequisite: SSR-Safe `getLang()`
Ensure the utility safely bridges SSR/CSR boundaries:
```ts
// utils/locale.ts
export function getLang(): string {
  if (typeof window === 'undefined') {
    return 'en'; // Must match server-side fallback
  }
  return localStorage.getItem('preferred-lang') || 'en';
}
```

## 🧪 Verification Checklist
- [ ] Clear `localStorage` → Reload → Verify no hydration warnings in console.
- [ ] Set `localStorage.setItem('preferred-lang', 'es')` → Reload → Verify `es` renders immediately without flash.
- [ ] Run `next dev` / `vite dev` with React Strict Mode enabled → Confirm zero `Hydration failed` warnings.
- [ ] Verify type-checking and linting pass without regressions.

## 📌 Notes
- Do not wrap `getLang` in a `useEffect` for initial state; it will always cause a render flash.
- If locale detection ever expands to include URL pathname, cookies, or `navigator.language`, update `getLang()` to maintain SSR parity. The `useState` initializer pattern remains unchanged.
- This approach is officially documented by React for safely initializing state from external storage without breaking hydration.