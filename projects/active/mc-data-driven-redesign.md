# Project: Mission Control Data-Driven Redesign

## 🎯 Objective
Transform the current dashboard from a partially static UI into a dynamic, real-time Mission Control system with deep visibility, editing capabilities, and structured data flow across all modules.

## 📌 Status
**approval_needed**

## 🧩 Core Principle
* Remove hardcoded UI behavior.
* Ensure all components are powered by live data sources (Supabase / APIs / Agent runtime).
* Replace shallow interactions (popups) with full detail views.
* Design for scalability (multi-agent, multi-project, multi-workspace).

## 📋 Task Breakdown

### Phase 1: Overview & Aesthetics (Sub-agent: UI Specialist)
* Fix visibility issues in Light Mode (Ethiopian Calendar card, News & Updates card).
* Replace Project Card popup behavior with a full Project Overview Page (description, subtasks, status, activity logs).
* Add "Edit Project" button inside the overview page with extended editable fields.
* Improve Activity Stream to capture meaningful events (executions, task completions, errors, system events) with filtering.
* Apply clean Mission Control aesthetic and dense, readable data layout across pages.

### Phase 2: Agent & Project Management (Sub-agent: React/Data Integration)
* **Agents Page:** Fetch and display ALL agents dynamically. On click, open Agent Detail View (config, soul.md editor, assigned tools/skills, model selection, runtime status).
* **Live Agent Page:** Add real-time metrics (tokens used, cost estimation, active tasks, streaming execution logs).
* **Projects Page:** Enhance project table with Domain/category, Total time spent, Tokens used, Status. Make columns sortable & filterable.
* **Skills Page:** Redesign for clarity/scalability. Categorize skills, add Skill Detail View. Enable adding, editing, and deleting skills.

### Phase 3: Analytics & Settings (Sub-agent: Data & Config)
* **Analytics Page:** Connect real data sources (B2C Data → ClickHouse, B2B Data → MCP Server). Add toggle between B2C/B2B views. Display token usage trends, agent performance, project efficiency.
* **Settings Page:** Audit all fields, replace hardcoded values with real backend data. Ensure correct fetching/updating of API keys, Workspace configs, and Agent defaults.

### Phase 4: New Modules (Sub-agent: File System / OS Integration)
* **Files Page:** Centralized file system for agent outputs. Features: File list, search, filter, preview (text, JSON, markdown), and download.
* **Workspace Management Page:** Visual representation of VPS workspace structure. Features: Folder tree view, file explorer, basic file operations (Create/Delete/Rename), sync with actual server filesystem.

## 🚀 Final Expectation
A fully operational AI Mission Control Dashboard providing complete visibility into agents, projects, and system activity with real-time insights, full editing/configuration capabilities, and scalable architecture.
