# Mission Control Architecture & Rules
* **DASHBOARD VERSION LOCK:** The ONLY approved version of the Mission Control dashboard is the "Gateway Control Plane" layout located directly at `https://mission-control-ovnaepjz5-openaibruks-projects.vercel.app/` (which matches commit `5cfdcc8`).
* **WORKSPACE LOCATION:** The UI code lives directly in the root of the workspace (`/home/ubuntu/.openclaw/workspace`).
* **NO SUBFOLDERS:** Never create or use an `apps/mission-control-ui` or `mission-control-ui` folder for the dashboard.
* **VERCEL BINDING:** Vercel is bound to the `main` branch of the workspace root. Any changes to the UI must be pushed directly to `main` and not be contained within subdirectories.
* **UI CHANGES PROHIBITED:** Do not redesign, change, or modify the dashboard layout without explicit, 100% confirmed, step-by-step instructions from Bruk. The current layout is finalized.