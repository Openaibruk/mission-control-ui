# Nova Chat UX Review Report

**Reviewer:** @Shuri  
**Date:** 2026-03-15  
**Target:** https://mission-control-ui-sand.vercel.app/ (Nova floating chat widget)

---

## ✅ What's Working Well
- Floating widget always accessible in bottom-right
- Dark/light mode support
- Typing indicator during API calls
- Streaming response animation
- Auto-scroll to latest message
- Responsive button sizing

---

## 🔴 Critical Issues

### 1. BROKEN HEIGHT STYLE (Line ~419 in page.tsx)
```tsx
style={{height:'380px md:420px'}}
```
**Problem:** Inline styles don't support Tailwind breakpoints. Height always renders as `380px` on ALL devices.
**Fix:** Use `className="h-[380px] md:h-[420px]"` instead

### 2. Mobile Width Too Narrow
- Fixed `w-[300px] md:w-[340px]` is cramped on modern phones (375px+ width)
- Long Nova responses will wrap awkwardly

### 3. No Way to Clear Chat
- Chat history persists with no "Clear" option
- Users can't start fresh

---

## 🟡 UX Improvements Needed

### 4. Missing User Avatar
- "Bruk" messages show only text label ("You")
- Inconsistent with Nova's avatar display

### 5. No Error Recovery
- Failed API calls show: "Sorry, something went wrong."
- No retry button or error details

### 6. Generic Placeholder
- "Talk to Nova..." doesn't suggest capabilities
- Could show example prompts

### 7. No Message Timestamps
- Can't tell when messages were sent

### 8. No Copy Message Option
- Users can't copy useful Nova responses

---

## 📱 Mobile Concerns
- Small input field (`py-2.5`) - hard to tap
- No keyboard adjustment handling
- Floating button may conflict with other bottom-right elements

---

## Recommended Fixes (Priority Order)

| Priority | Issue | Fix |
|----------|-------|-----|
| P0 | Broken height | Use Tailwind class: `h-[380px] md:h-[420px]` |
| P1 | Mobile width | `w-[85vw] md:w-[340px] max-w-[400px]` |
| P1 | No clear chat | Add clear button in chat header |
| P2 | Add user avatar | Show avatar next to "You" |
| P2 | Error retry | Add "Try again" on failure |
| P3 | Better placeholder | "Ask Nova anything..." |
| P3 | Timestamps | Add time below messages |

---

## Files Reviewed
- `mission-control-ui/src/app/page.tsx` - Main dashboard with Nova chat widget
- `mission-control-ui/src/app/api/chat/route.ts` - Chat API endpoint