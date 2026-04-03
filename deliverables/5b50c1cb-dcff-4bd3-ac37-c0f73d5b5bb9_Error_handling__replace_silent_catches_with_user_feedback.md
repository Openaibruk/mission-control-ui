# Error Handling Implementation: Replacing Silent Catches with User Feedback

## 1. Objective
Eliminate silent error swallowing across all application components by implementing:
- Contextual inline error messages for recoverable failures
- Centralized fallback via `ErrorBoundary` for critical/unrecoverable errors
- Automated retry logic with configurable backoff for transient failures
- Consistent error logging for observability and debugging

## 2. Error Classification & Routing Strategy
| Error Type | User Feedback | Handling Mechanism | Retry? |
|------------|---------------|-------------------|--------|
| **Network/Transient** (5xx, timeout, rate limit) | Inline banner with retry button | Catch → Retry Utility → Fallback to inline error | ✅ Yes (exponential backoff) |
| **Validation/Business** (4xx, missing data) | Inline form/field messages | Catch → Map to UI state | ❌ No |
| **Rendering/Critical** (JS exceptions, missing dependencies) | Full-component fallback | Propagate to `ErrorBoundary` | ❌ No |
| **Unexpected/Unknown** | Generic fallback + support link | Catch → Log → Propagate to `ErrorBoundary` | ❌ No |

## 3. Implementation Patterns

### 3.1 Inline Error State Pattern
- Use component-level `error` and `retry` state
- Render a reusable `ErrorBanner` or `ErrorMessage` component
- Keep loading, success, and error states mutually exclusive

### 3.2 ErrorBoundary Integration
- Wrap feature modules, routes, and complex component trees
- Capture render-phase errors via `getDerivedStateFromError`
- Log via `componentDidCatch` to telemetry service (e.g., Sentry, Datadog)
- Provide a graceful fallback UI with clear recovery steps

### 3.3 Retry Utility
- Configurable max attempts, delay multiplier, and jitter
- Distinguishes retryable vs. non-retryable errors
- Supports abort signals for cleanup

## 4. Code Examples

### 4.1 Retry Utility with Error Classification
```javascript
// utils/errorHandling.js
export class RetryableError extends Error {
  constructor(message, retryAfter = null) {
    super(message);
    this.name = 'RetryableError';
    this.retryAfter = retryAfter;
  }
}

export async function withRetry(fn, options = {}) {
  const { maxRetries = 3, baseDelay = 1000, isRetryable = () => true } = options;
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries && isRetryable(error)) {
        const delay = baseDelay * Math.pow(2, attempt) * (0.5 + Math.random());
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}
```

### 4.2 Component with Inline Error & Retry
```jsx
// components/DataFetcher.jsx
import { useState, useCallback } from 'react';
import { withRetry, RetryableError } from '../utils/errorHandling';

export function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await withRetry(
        () => fetch(url).then(res => {
          if (!res.ok) throw new RetryableError(`HTTP ${res.status}`, res.headers.get('Retry-After'));
          return res.json();
        }),
        { maxRetries: 3 }
      );
      setData(result);
    } catch (err) {
      setError(err.message || 'Unable to load content.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  if (error) {
    return (
      <div className="error-container" role="alert">
        <p>{error}</p>
        <button onClick={fetchData} disabled={loading}>Retry</button>
      </div>
    );
  }

  if (loading) return <div className="skeleton-loader" aria-label="Loading" />;
  return <div className="data-display">{/* render data */}</div>;
}
```

### 4.3 Centralized ErrorBoundary
```jsx
// components/ErrorBoundary.jsx
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Replace with your telemetry provider
    console.error('[ErrorBoundary]', error, errorInfo.componentStack);
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="global-fallback" role="alert">
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred. Please refresh or contact support.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## 5. Best Practices
- **Never leave empty `catch` blocks** → Always handle, log, or rethrow
- **User messages > stack traces** → Show actionable, non-technical copy
- **Graceful degradation** → Show cached data or partial UI when possible
- **Consistent error components** → Standardize `ErrorBanner`, `ErrorFallback`, and `RetryButton`
- **Accessibility** → Use `role="alert"`, `aria-live="polite"`, and focus management on error appearance
- **Telemetry** → Log all caught errors with context (component, action, user ID, request ID)

## 6. Testing & Validation Checklist
- [ ] Mock 5xx/timeout responses → verify retry triggers and eventual inline error
- [ ] Mock 4xx/validation errors → verify immediate inline feedback without retry
- [ ] Throw inside render → verify `ErrorBoundary` catches and renders fallback
- [ ] Verify error logs appear in monitoring dashboard with correct metadata
- [ ] Test keyboard navigation & screen reader announcements on error states
- [ ] Confirm loading/error/success states never render simultaneously

## 7. Rollout Plan
1. **Phase 1:** Deploy `withRetry`, `ErrorBoundary`, and shared error UI components
2. **Phase 2:** Refactor high-traffic data-fetching components (API calls, auth, forms)
3. **Phase 3:** Sweep remaining components, replace all `catch (e) {}` or silent logs
4. **Phase 4:** Enable telemetry alerts, monitor error rates, tune retry thresholds
5. **Phase 5:** Document error handling standards in team wiki & PR templates