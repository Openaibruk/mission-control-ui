# Department to Google Drive Folder Mapping

This document maps specific AI agents to their designated Google Drive folders. This ensures agents only ingest relevant context for their roles, optimizing token usage and improving focus.

| Agent | Role | Assigned Google Drive Folder(s) |
|---|---|---|
| **@Vision** | Strategic Oversight | `01_STRATEGY_&_VISION`, `02_EXECUTION_PLANS` |
| **@Maven** | Marketing Strategist | `03_DEPARTMENTS/Marketing`, `ChipChip Sales & Marketing Plan` |
| **@Pixel** | Creative Director | `03_DEPARTMENTS/Marketing` |
| **@Echo** | Copywriter | `03_DEPARTMENTS/Marketing`, `10_COMMUNICATION AND DATA` |
| **@Pulse** | Growth Analyst | `05_REPORTING_&_KPIS`, `chipchip_account_summary.xlsm` |
| **@Shuri** | Product Analyst | `03_DEPARTMENTS/Product`, `10_COMMUNICATION AND DATA` |
| **@Forge** | Frontend Engineer | `04_PROJECTS`, `06_OPERATIONS_&_SOPS` |
| **@Cipher** | Backend Engineer | `04_PROJECTS`, `06_OPERATIONS_&_SOPS` |
| **@Loki** | Stealth Ops | `07_ARCHIVE`, `09_CONTRACTS` |
| **@Nova** | Lead Coordinator | *All folders (read-only for global context)* |

## Operating Procedure

When agents are assigned a task, they should first consult their assigned folders via the local `/knowledge/` sync before querying the web or asking for clarification. Final outputs should be pushed back to `04_PROJECTS` per the Write-Back SOP.
