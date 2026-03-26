# Product Requirements Document (PRD)

## Overview
- **Feature:** Driver Onboarding Tracker
- **Author:** @Nova
- **Date:** 2026-03-16
- **Priority:** Medium
- **Track:** BMAD Method (full lifecycle pilot sprint)

## Problem Statement
ChipChip driver onboarding currently lives in static markdown documents (`chipchip/drivers/`). There's no way to track which drivers are in which stage, see completion rates, or manage the pipeline. Operations team has no visibility into onboarding progress.

## Goals
1. Digital tracker for driver onboarding pipeline
2. Visual progress tracking per driver (which stage they're in)
3. Dashboard stats: total drivers, completion rate, bottleneck stages
4. Integration with existing Mission Control dashboard

## Non-Goals
- Full driver management system (that's a separate project)
- Payment/billing integration
- Driver mobile app
- Document upload/storage (use existing Google Drive workflow)

## User Stories

### Story 1: Add New Driver to Onboarding Pipeline
**As an** operations manager,  
**I want** to add a new driver with name and phone number,  
**So that** I can start tracking their onboarding progress.

**Acceptance Criteria:**
- [ ] Form with name (required), phone (required), email (optional)
- [ ] New driver starts in "Registration" stage automatically
- [ ] Success notification after adding

### Story 2: Progress Driver Through Onboarding Stages
**As an** operations manager,  
**I want** to move a driver from one stage to the next,  
**So that** I can track where each driver is in the process.

**Acceptance Criteria:**
- [ ] Stages: Registration → Documents → Training → Background Check → Active
- [ ] One-click stage advancement
- [ ] Timestamp recorded at each stage change
- [ ] Cannot skip stages (must go in order)

### Story 3: View Onboarding Pipeline Overview
**As an** operations manager,  
**I want** to see all drivers and their current stage,  
**So that** I can identify bottlenecks and follow up on stalled drivers.

**Acceptance Criteria:**
- [ ] Kanban-style view grouped by stage
- [ ] Each driver card shows name, phone, days in current stage
- [ ] Drivers stalled >3 days highlighted
- [ ] Stats bar: total, active, completed, stalled

### Story 4: Driver Onboarding Statistics
**As a** business owner,  
**I want** to see onboarding metrics,  
**So that** I can measure operational efficiency.

**Acceptance Criteria:**
- [ ] Total drivers in pipeline
- [ ] Completion rate (% that reach Active)
- [ ] Average time per stage
- [ ] Bottleneck detection (stage with longest avg time)

## Functional Requirements
- FR1: CRUD operations for drivers
- FR2: Stage progression with timestamp tracking
- FR3: Dashboard view with pipeline stats
- FR4: Data persisted in Supabase

## Non-Functional Requirements
- NFR1: Page load < 2 seconds
- NFR2: Works on mobile (responsive)
- NFR3: Integrates with existing Mission Control UI theme

## Technical Constraints
- Must use existing Supabase instance
- Must use existing Mission Control UI (Next.js + Tailwind + shadcn)
- No new external dependencies

## Success Metrics
- Can add a driver and progress them through stages in < 30 seconds
- Pipeline overview loads with live data
- Stats update in real-time

## Open Questions
- [ ] Should we add notes/comments per driver per stage?
- [ ] Email/SMS notification when driver completes onboarding?
- [ ] Should completed drivers be archived or stay visible?

---
_Template based on BMAD-METHOD PRD workflow_
