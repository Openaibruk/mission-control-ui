# Architecture Document: Driver Onboarding Tracker

## Overview
- **Feature/Project:** Driver Onboarding Tracker
- **Author:** @Kiro
- **Date:** 2026-03-16
- **Status:** Approved

## Context
From PRD: ChipChip needs digital tracking for driver onboarding pipeline. Currently using static markdown docs. This feature adds a live pipeline tracker to Mission Control dashboard.

## Technical Stack
| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | Next.js (App Router) | 14.x | Existing Mission Control UI |
| UI Components | shadcn/ui + Tailwind | | Existing |
| Backend | Supabase REST API | v2 | Existing instance |
| Database | PostgreSQL | via Supabase | New table |

## System Architecture

### Data Model
```sql
CREATE TABLE driver_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  current_stage TEXT NOT NULL DEFAULT 'registration',
  -- stages: registration, documents, training, background_check, active
  stage_history JSONB DEFAULT '[]'::jsonb,
  -- [{stage: 'registration', entered_at: '...', exited_at: '...'}]
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_driver_stage ON driver_onboarding(current_stage);
```

### API Design (via Supabase client)
| Operation | Method | Table | Notes |
|-----------|--------|-------|-------|
| List drivers | SELECT | driver_onboarding | Filter by stage optional |
| Add driver | INSERT | driver_onboarding | Default stage: registration |
| Advance stage | UPDATE | driver_onboarding | Update current_stage + stage_history |
| Stats | RPC/SELECT | driver_onboarding | Count by stage, avg times |

### Component Structure
```
mission-control-ui/
├── src/
│   ├── app/
│   │   └── onboarding/
│   │       └── page.tsx              # Main onboarding page
│   ├── components/
│   │   └── onboarding/
│   │       ├── OnboardingDashboard.tsx  # Stats bar + Kanban
│   │       ├── DriverKanban.tsx         # Pipeline board
│   │       ├── DriverCard.tsx           # Individual driver card
│   │       ├── AddDriverModal.tsx       # Add new driver form
│   │       └── StageProgress.tsx        # Stage indicator
│   └── lib/
│       └── onboarding.ts              # Supabase queries + types
```

## Architecture Decision Records

### ADR-001: Kanban vs Table View
- **Status:** Accepted
- **Context:** Need to display drivers across stages
- **Options Considered:**
  1. Kanban board — Visual, intuitive, great for pipeline view
  2. Table/list — Dense, sortable, but less visual
- **Decision:** Kanban board (matches existing dashboard aesthetic, better for pipeline visualization)
- **Consequences:** Slightly more component complexity, but better UX

### ADR-002: Stage History as JSONB vs Separate Table
- **Status:** Accepted
- **Context:** Need to track when drivers enter/exit each stage
- **Options Considered:**
  1. JSONB column — Simple, no joins, good for <1000 drivers
  2. Separate stage_history table — Normalized, better for analytics
- **Decision:** JSONB column. Volume is low (<100 drivers/month), simpler queries.
- **Consequences:** If volume grows significantly, migrate to separate table later.

### ADR-003: Stage Enforcement
- **Status:** Accepted
- **Context:** Should stages be enforced in order?
- **Decision:** Yes — sequential stages only. Frontend enforces, backend validates.
- **Consequences:** Simpler logic, matches real-world onboarding flow.

## Security Considerations
- No auth yet on Mission Control (single-user for now)
- Supabase anon key is sufficient for current usage
- When multi-user: add RLS policies for org-level access

## Dependencies & Risks
| Dependency | Risk | Mitigation |
|-----------|------|------------|
| Supabase availability | Medium | Existing dependency, already in use |
| Mission Control UI | Low | Building within existing framework |

---
_Template based on BMAD-METHOD Architecture workflow_
