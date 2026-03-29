# Mission Control v3: Data-Driven Scalable OS

## 🎯 OBJECTIVE
Transform the current dashboard from a partially static UI into a dynamic, real-time Mission Control system with deep visibility, editing capabilities, and structured data flow across all modules.

## 🧩 CORE PRINCIPLE
- Remove hardcoded UI behavior
- Ensure all components are powered by live data sources (Supabase / APIs / Agent runtime)
- Replace shallow interactions (popups) with full detail views
- Design for scalability (multi-agent, multi-project, multi-workspace)

## 🔧 REQUIRED IMPROVEMENTS

### Phase 1: Overview & Foundation
- **Fix visibility issues in Light Mode:** Ethiopian Calendar card & News & Updates card not readable.
- **Project Card overhaul:** Remove edit popup. Add full Project Overview Page (description, subtasks, status, activity logs, edit button with extended fields).
- **Activity Stream:** Capture agent executions, task completions, errors, system events. Add filtering (type, project, agent).

### Phase 2: Agents & Live Metrics
- **Agents Page:** Fetch/display ALL workspace agents dynamically. Click -> Agent Detail View (config, soul.md editor, tools, skills, AI model selectable, runtime status).
- **Live Agent Page:** Real-time metrics (Tokens used, Cost estimation, Active tasks, streaming execution logs).

### Phase 3: Projects & Skills
- **Projects Page:** Enhance table with Domain/category, Total time spent, Tokens used, Status. Add sort/filter.
- **Skills Page:** Categorize skills. Add Skill Detail View (description, usage, linked agents). Enable Add/Edit/Delete.

### Phase 4: Data & Analytics
- **Analytics Page:** Connect real data sources (B2C ClickHouse, B2B MCP Server). Toggle B2C/B2B view. Token usage trends, agent performance, project efficiency.
- **Settings Page:** Audit fields, replace hardcoded with real backend data (API keys, workspace configs, agent defaults).

### Phase 5: File & Workspace Management (New Pages)
- **Files Page:** Centralized file system for agent outputs (list, search, preview, download).
- **Workspace Management:** Visual folder tree view, file explorer, basic operations (create/delete/rename), sync with server filesystem.

## 🚀 STATUS
- **Status:** Initiated
- **Assigned Subagents:** [Pending Allocation]
