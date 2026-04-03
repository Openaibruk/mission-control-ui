# Dynamic Modals Implementation Specification

## 1. Objective
Replace legacy static popup implementations with a unified, dynamic modal system that supports contextual triggers, smooth animations, state-driven rendering, and enterprise-grade accessibility. The new system will improve user experience, reduce layout disruption, and provide a maintainable, configuration-driven architecture.

## 2. Core Requirements
- **Contextual Activation**: Modals trigger based on user behavior, page state, scroll position, or time-based rules.
- **Animated Transitions**: Hardware-accelerated enter/exit animations with motion preferences respected.
- **Focus & State Management**: Automatic focus trapping, escape-key handling, and background scroll lock.
- **Configuration-Driven**: Modal content, behavior, and styling defined via JSON/config objects rather than hardcoded DOM.
- **Framework-Agnostic Core**: Vanilla JS/TS foundation with adapters for React, Vue, Angular, or Web Components.
- **Analytics & Telemetry**: Built-in event tracking for impressions, interactions, and dismissal rates.

## 3. Architecture & Component Design

### 3.1 System Components
| Component | Responsibility |
|-----------|----------------|
| `ModalRegistry` | Stores registered modal configs, handles lifecycle (mount/unmount), manages stacking order. |
| `ContextRouter` | Evaluates trigger conditions (events, state, timers) and dispatches modal open/close commands. |
| `ModalBase` | Core UI component rendering the overlay, container, header, body, footer, and close controls. |
| `AnimationEngine` | Applies CSS/JS transitions, respects `prefers-reduced-motion`, cleans up DOM post-animation. |
| `FocusTrapService` | Manages keyboard navigation, locks background scroll, restores focus on close. |

### 3.2 Data Flow
```
User Action / System Event 
       ↓
ContextRouter evaluates trigger rules
       ↓
ModalRegistry resolves config & queue
       ↓
ModalBase renders with animation
       ↓
FocusTrapService + Accessibility hooks activate
       ↓
User interaction → callback → teardown & state update
```

## 4. Implementation Reference

### 4.1 HTML Structure (Semantic & Accessible)
```html
<div class="modal-overlay" role="presentation" aria-hidden="true">
  <div 
    class="modal-container" 
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="modal-title" 
    aria-describedby="modal-desc"
    tabindex="-1"
  >
    <header class="modal-header">
      <h2 id="modal-title">Dynamic Confirmation</h2>
      <button class="modal-close" aria-label="Close dialog">&times;</button>
    </header>
    <div class="modal-body" id="modal-desc">
      <p>Contextual content injected at runtime.</p>
    </div>
    <footer class="modal-footer">
      <button class="btn-secondary" data-action="cancel">Cancel</button>
      <button class="btn-primary" data-action="confirm">Confirm</button>
    </footer>
  </div>
</div>
```

### 4.2 CSS Animations & Performance
```css
:root {
  --modal-enter-duration: 250ms;
  --modal-exit-duration: 200ms;
  --modal-easing: cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--modal-exit-duration) var(--modal-easing),
              visibility var(--modal-exit-duration) var(--modal-easing);
  will-change: opacity;
  z-index: 9999;
}

.modal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%) scale(0.95);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: transform var(--modal-enter-duration) var(--modal-easing),
              opacity var(--modal-enter-duration) var(--modal-easing);
  will-change: transform, opacity;
}

.modal-overlay[aria-hidden="false"] {
  opacity: 1;
  visibility: visible;
}

.modal-overlay[aria-hidden="false"] .modal-container {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .modal-overlay,
  .modal-container {
    transition: none !important;
    animation: none !important;
  }
}
```

### 4.3 JavaScript/TypeScript Core
```ts
interface ModalConfig {
  id: string;
  trigger: 'click' | 'scroll' | 'timer' | 'state';
  condition?: (context: Record<string, any>) => boolean;
  content: string | (() => HTMLElement);
  animation?: { enter: string; exit: string };
  zIndex?: number;
}

class DynamicModalSystem {
  private registry = new Map<string, ModalConfig>();
  private activeModals: string[] = [];
  private focusTrap: FocusTrap | null = null;

  register(config: ModalConfig) {
    this.registry.set(config.id, config);
  }

  async open(id: string, context: Record<string, any> = {}) {
    const config = this.registry.get(id);
    if (!config) throw new Error(`Modal ${id} not registered`);
    if (config.condition && !config.condition(context)) return;

    const overlay = this.createOverlay(config);
    document.body.appendChild(overlay);
    this.activeModals.push(id);
    this.lockScroll(true);

    await this.animateIn(overlay);
    this.setupAccessibility(overlay, config);
  }

  async close(id: string) {
    const overlay = document.querySelector(`[data-modal-id="${id}"]`);
    if (!overlay) return;

    await this.animateOut(overlay as HTMLElement);
    overlay.remove();
    this.activeModals = this.activeModals.filter(mid => mid !== id);
    this.lockScroll(false);
    this.restoreFocus();
  }

  // ... (animateIn/Out, createOverlay, setupAccessibility, lockScroll, etc.)
}
```

## 5. Contextual Trigger System

### 5.1 Rule Configuration
```json
{
  "triggers": [
    {
      "modalId": "welcome-back",
      "type": "state",
      "condition": "user.lastLogin > 7d && !hasSeenWelcome",
      "priority": 2
    },
    {
      "modalId": "cart-upgrade",
      "type": "scroll",
      "condition": "scrollDepth > 75% && cart.items.length > 0",
      "cooldown": 3600000
    }
  ]
}
```

### 5.2 Execution Flow
- Triggers are evaluated on relevant DOM events or state changes.
- Priority queue ensures only one high-priority modal shows at a time.
- Cooldown & deduplication prevent modal fatigue.
- Context object passed to condition evaluators and modal templates.

## 6. Accessibility & Compliance
- **ARIA Compliance**: `role="dialog"`, `aria-modal="true"`, dynamic `aria-labelledby`/`aria-describedby`.
- **Keyboard Navigation**: `Escape` closes modal, `Tab` trapped within modal, focus returns to trigger element.
- **Screen Readers**: Live region announcements for state changes, proper heading hierarchy.
- **Motion Preferences**: Respects `prefers-reduced-motion` with instant show/hide fallback.
- **Color & Contrast**: Meets WCAG 2.1 AA standards for text, buttons, and focus indicators.

## 7. Performance Optimization
- **Hardware Acceleration**: Uses `transform` and `opacity` only for animations.
- **Lazy Content Injection**: Heavy content (images, forms) deferred until open.
- **Event Delegation**: Single listener for overlay clicks, close buttons, and keyboard events.
- **Debounced Triggers**: Scroll and resize events throttled to 60fps.
- **Bundle Splitting**: Modal core and optional plugins (analytics, rich content) loaded on demand.

## 8. Testing Strategy
| Test Type | Tools | Coverage Goals |
|-----------|-------|----------------|
| Unit | Jest/Vitest | Config resolution, queue management, condition evaluation |
| Component | Testing Library | Render, state updates, animation classes, cleanup |
| Integration | Cypress/Playwright | Trigger flow, focus trapping, scroll lock, multi-modal stacking |
| Accessibility | axe-core, Lighthouse | ARIA roles, keyboard nav, contrast, reduced motion |
| Performance | WebPageTest, Chrome DevTools | FPS > 58 during animation, < 50ms open/close latency |

## 9. Migration & Rollout Plan
1. **Audit**: Inventory existing static popups, map to new modal IDs.
2. **Adapter Layer**: Wrap legacy popup calls to redirect to `DynamicModalSystem.open()`.
3. **Phased Rollout**: Deploy to 10% → 50% → 100% traffic with feature flag.
4. **Monitoring**: Track `modal_open_rate`, `dismiss_time`, `error_rate`, and `layout_shift`.
5. **Deprecation**: Remove legacy popup DOM/CSS after 30-day stability period.

## 10. Deliverables Checklist
- [ ] `DynamicModalSystem` core library (TypeScript)
- [ ] CSS animation module with reduced-motion fallback
- [ ] Context router & trigger evaluator
- [ ] Accessibility & focus management utilities
- [ ] Configuration schema & validation
- [ ] Unit & integration test suites
- [ ] Migration adapter for legacy popups
- [ ] Documentation (API reference, usage examples, accessibility guide)
- [ ] Analytics event schema & tracking hooks