# Epic: Driver Onboarding Tracker

## Overview
- **Epic ID:** EPIC-001
- **Related PRD:** prd-driver-onboarding-tracker.md
- **Author:** @Nova
- **Priority:** Medium

## Epic Goal
Enable operations team to digitally track driver onboarding pipeline with visual progress, statistics, and bottleneck detection.

## Stories

### STORY-001: Add New Driver to Pipeline
**As an** operations manager,  
**I want** to add a new driver with name and phone number,  
**So that** I can start tracking their onboarding progress.

**Story Points:** 3  
**Assignee:** @Henok  
**Status:** inbox

**Acceptance Criteria:**
- [ ] Form with name (required), phone (required), email (optional)
- [ ] New driver starts in "registration" stage
- [ ] Success notification after adding
- [ ] Data persists in Supabase

**Technical Notes:**
- New Supabase table: `driver_onboarding`
- AddDriverModal component with shadcn form
- POST to Supabase via client lib

---

### STORY-002: Progress Driver Through Stages
**As an** operations manager,  
**I want** to move a driver from one stage to the next,  
**So that** I can track their progress.

**Story Points:** 3  
**Assignee:** @Henok  
**Status:** inbox

**Acceptance Criteria:**
- [ ] Stages: Registration → Documents → Training → Background Check → Active
- [ ] One-click advancement
- [ ] Timestamps recorded
- [ ] Sequential only (no skipping)

**Technical Notes:**
- Update current_stage + append to stage_history JSONB
- Validate sequential progression

---

### STORY-003: Kanban Pipeline View
**As an** operations manager,  
**I want** to see all drivers grouped by stage,  
**So that** I can identify bottlenecks.

**Story Points:** 5  
**Assignee:** @Henok  
**Status:** inbox

**Acceptance Criteria:**
- [ ] Kanban board with 5 columns (one per stage)
- [ ] Driver cards show name, phone, days in stage
- [ ] Stalled drivers (>3 days) highlighted
- [ ] Responsive layout

**Technical Notes:**
- CSS grid/flex Kanban layout
- Color coding per stage
- Stalled detection logic

---

### STORY-004: Pipeline Statistics Bar
**As a** business owner,  
**I want** to see onboarding metrics,  
**So that** I can measure efficiency.

**Story Points:** 2  
**Assignee:** @Henok  
**Status:** inbox

**Acceptance Criteria:**
- [ ] Total drivers count
- [ ] Completion rate %
- [ ] Average time per stage
- [ ] Bottleneck indicator

**Technical Notes:**
- Computed from stage_history timestamps
- Stats bar at top of page

---

## Epic Summary
- **Total Stories:** 4
- **Total Points:** 13
- **Estimated Sprints:** 1 (single sprint)
