# ChipChip HR Agent — System Design Document

**Version:** 1.0  
**Date:** 2026-03-31  
**Prepared by:** Nova (Business Analyst)  
**For:** Bruk T. / ChipChip Share Co.  
**Context:** HR transition — Nebila departing, operational continuity required

---

## Executive Summary

ChipChip is losing its dedicated HR person (Nebila). This document designs an autonomous HR Agent — built on OpenClaw — that absorbs the critical functions: payroll coordination, contract tracking, recruitment pipeline management, clearance workflows, and administrative oversight. The system blends **immediate automations** (cron jobs, reminders, dashboards) with **gradual human-in-the-loop workflows** over 12 months.

**Design philosophy:** Automate coordination, not decisions. The agent orchestrates, reminds, tracks, and escalates — Bruk approves, intervenes, and decides.

---

## 1. Automation Readiness Matrix

### ✅ Automate NOW (Week 1-2) — Zero new infrastructure needed

| Capability | How It Works | Owner | Frequency |
|-----------|-------------|-------|-----------|
| **Payroll reminders** | Cron at 27th (collect data), 2nd (submit to Finance), 5th (verify payment) across 4 departments: CS, Logistics, Warehouse, Admin | Agent → notifies Bruk/Dept Heads | Monthly |
| **Contract expiry alerts** | Countdown monitors: Office rent (May 20), Avenir (Jun 9), Office lease (Nov), Avenir lease (Dec). Alerts at 90/60/30/7 days | Agent → notifies Bruk | Scheduled |
| **Pending task tracker** | 4 unresolved items (Saba, Nahom, Eyob, Aman) with auto-escalation every 7 days stale | Agent → Mission Control dashboard | Continuous |
| **Document retrieval** | Agent indexed with all 25+ Google Docs/Sheets links; responds to voice/text queries like "Show me Saba's clearance" | Agent → on-demand | On-demand |
| **Vendor directory** | 10 vendor contacts stored and retrievable: "Call lunch vendor" → returns Habtam's number | Agent → on-demand | On-demand |
| **CCTV credential storage** | Secure retrieval of Zion Electronics credentials for authorised people | Agent → on-demand, authenticated | On-demand |

### ⚡ Automate SOON (Week 3-4) — Light development needed

| Capability | How It Works | Owner | Frequency |
|-----------|-------------|-------|-----------|
| **Digital clearance workflow** | Agent presents structured clearance form (assets, finance sign-off, experience letter); tracks completion per person | Agent guides, Bruk/Finance approves | Per resignation |
| **Employee directory** | Structured roster: name, department, role, start date, contract end, phone, salary band. Stored as JSON/Sheet | Agent maintains, Bruk validates | Updated on hire/exit |
| **Recruitment pipeline tracker** | Agent tracks active postings (34 posts on Ethiojobs), candidate stages, interview dates; weekly status report | Agent tracks, Bruk decides | Weekly |
| **Attendance consolidation** | Agent reads 3 department attendance sheets, flags anomalies (absences >3 days, OT spikes), compiles monthly summary | Agent reads + summarizes | Monthly |
| **Onboarding checklist** | For each new hire: agent issues checklist (offer letter, orientation, asset assignment, account creation), tracks completion | Agent orchestrates | Per new hire |

### 🔮 Automate LATER (Month 2-12) — Requires integration work

| Capability | How It Works | Owner | Timeline |
|-----------|-------------|-------|----------|
| **Payroll consolidation engine** | Agent pulls data from all 4 department sheets, generates the monthly employee summary sheet automatically | Agent generates, Finance reviews | Month 2-3 |
| **Performance review cycle** | Quarterly reminders with template-based review forms; tracks completion per department | Agent orchestrates | Month 3-4 |
| **Org chart & capacity planning** | Living org chart with headcount, salary cost per department, hiring recommendations | Agent generates from directory | Month 4-6 |
| **Automated offer letter generation** | Pre-filled offer letters from template with candidate name, role, salary | Agent drafts, Bruk approves | Month 4-6 |
| **Leave tracking** | Employee leave balances, request approvals, conflict detection | Agent tracks | Month 6-8 |
| **Ethiojobs API integration** | Direct API posting to Ethiojobs ATS for job postings | Agent posts with approval | Month 6-9 |
| **Employee self-service portal** | Simple web view for employees to request documents (experience letters, salary certs) | Portal + Agent backend | Month 9-12 |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 MISSION CONTROL DASHBOARD               │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ HR Card     │ │ Payroll Card │ │ Recruitment Card │  │
│  │ • Open items│ │ • Next payroll│ │ • Active posts  │  │
│  │ • Escalations│ │ • Dept status │ │ • Pipeline stats│  │
│  │ • Contracts │ │ • Days to pay │ │ • Candidate count│ │
│  └─────────────┘ └──────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ reads/writes
┌─────────────────────────────────────────────────────────┐
│                   HR AGENT (OpenClaw)                    │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Cron     │ │ Reminder │ │ Tracker  │ │ Document  │  │
│  │ Engine   │ │ Engine   │ │ Engine   │ │ Retriever │  │
│  │          │ │          │ │          │ │           │  │
│  │ •Monthly │ │ •Payroll │ │ •Pending │ │ •25+ links│  │
│  │ •Lease   │ │ •Lease   │ │ •Resign  │ │ •Google   │  │
│  │ •Review  │ │ •Review  │ │ •Recruit │ │   Drive   │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              KNOWLEDGE LAYER                       │  │
│  │  • hr-knowledge-base.md (25+ resource links)      │  │
│  │  • hr-pending-actions-tracker.md (live state)     │  │
│  │  • Employee directory (JSON/Sheet)                │  │
│  │  • Vendor directory (JSON)                        │  │
│  │  • Clearance workflow templates                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────┐        ┌──────────────┐
   │ Telegram │        │  Bruk    │        │  Google       │
   │ (alerts) │        │(approves)│        │  Sheets/Docs  │
   └──────────┘        └──────────┘        └──────────────┘
```

### 2.2 Cron Job Schedule

| Cron Expression | Trigger (EAT) | Action | Output |
|----------------|---------------|--------|--------|
| `0 9 27 * *` | 27th monthly, 9:00 AM | Payroll month: "Data collection starts. Departments, submit attendance." | Telegram → Bruk + dept heads |
| `0 9 2 * *` | 2nd monthly, 9:00 AM | Payroll: "Submit final employee data to Finance today." | Telegram → Bruk |
| `0 9 5 * *` | 5th monthly, 9:00 AM | Payroll: "Verify salary payments processed." | Telegram → Bruk |
| `0 9 1 * *` | 1st monthly, 9:00 AM | Lease check: "Scan contract expiry calendar" | Dashboard + Telegram if <90 days |
| `0 9 * * 1` | Every Monday, 9:00 AM | Pending tasks: "Review stale items" | Dashboard update + Telegram if >7 days |
| `0 17 * * 5` | Every Friday, 5:00 PM | Weekly HR digest: summary of the week | Telegram → Bruk |

### 2.3 Notification Patterns

**Escalation ladder for every tracked item:**

| Stage | Trigger | Action | Channel |
|-------|---------|--------|---------|
| L1: Reminder | Scheduled date reached | Gentle reminder with action link | Telegram |
| L2: Nudge | 3 days no action | Firmer reminder, flags to Bruk | Telegram |
| L3: Escalation | 7 days no action | Dashboard flag 🔴, urgent Telegram | Telegram + Dashboard |
| L4: Bruk Alert | 14 days no action | Direct alert: "Requires your intervention" | Telegram direct + email |

**Urgency overrides:** Contract expiry <30 days, payroll <2 days to deadline, or resignation clearance incomplete after 30 days → immediate L3 escalation.

### 2.4 Mission Control Dashboard Integration

A new **HR Operations** widget on the dashboard, structured as:

```
┌──────────────────────────────────────────────────────┐
│ 🧑‍💼 HR OPERATIONS                        [LAST: Today 9:00]  │
├──────────────────────────────────────────────────────┤
│  PAYROLL STATUS                                      │
│  ┃ Next collection: Apr 27 (27 days)                 │
│  ┃ Last payment: Mar 8 ✅                            │
│  ┃ Departments: CS ✅  Logistics ✅  Warehouse ⏳    │
├──────────────────────────────────────────────────────┤
│  CONTRACTS & LEASES                                  │
│  ┃ 🔴 Office rent: May 20 (50 days)                  │
│  ┃ 🟡 Avenir rent: Jun 9 (70 days)                   │
│  ┃ 🟢 Office lease: Nov 2026                         │
│  ┃ 🟢 Avenir lease: Dec 2026                         │
├──────────────────────────────────────────────────────┤
│  OPEN RESIGNATIONS                                   │
│  ┃ 🔴 Saba — Clearance incomplete (Day 5)            │
│  ┃ 🟡 Nahom — Asset return pending (Day 3)           │
├──────────────────────────────────────────────────────┤
│  RECRUITMENT                                         │
│  ┃ Active posts: 34 remaining on Ethiojobs           │
│  ┃ Pipeline: [TBD — awaiting data]                   │
├──────────────────────────────────────────────────────┤
│  FINANCIAL ITEMS                                     │
│  ┃ Eyob loan: Balance TBD ✅ pending                 │
│  ┃ Aman CASA return: Amount TBD ✅ pending           │
├──────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                       │
│  ┃ [View Full Tracker] [Start Clearance] [Add Item]  │
└──────────────────────────────────────────────────────┘
```

---

## 3. Specific Process Designs

### 3.1 Payroll Reminder Engine

**Problem:** Manual follow-up across 4 departments is time-consuming and error-prone.

**Agent Workflow:**
```
Day 27 (Collection):
  └→ Telegram to each dept head: "Submit March attendance + OT by Mar 30"
  └→ Read attendance sheets to verify submission
  └→ Day 30: If not submitted → escalate to Bruk

Day 2 (Finalization):
  └→ Check all 3 department sheets + monthly summary
  └→ Compile anomalies: missing entries, unusual OT
  └→ Alert Bruk: "Review before sending to Finance"

Day 5 (Payment Verification):
  └→ Ask Bruk/Finance: "Were salaries paid?"
  └→ Log confirmation
  └→ If delayed → daily follow-up until confirmed

Day 8:
  └→ If OT was not included: flag for separate payment within 5 days
```

### 3.2 Contract Expiry Monitor

**Tracked leases with countdown:**

| Property | Paid Until | Lease Expiry | Action Required |
|----------|-----------|-------------|----------------|
| ChipChip Office | May 20, 2026 | Nov 2026 | Renewal negotiation starts Sep 2026 |
| Avenir Dubai Mall | June 9, 2026 | Dec 2026 | Renewal discussion starts Oct 2026 |
| ChipChip Warehouse | Unknown | Unknown | **Agent: check box file, update calendar** |

**Alert schedule:** 90 days → gentle planning reminder. 60 days → start market research on rates. 30 days → draft renewal terms. 7 days → urgent: negotiate or prepare exit plan.

### 3.3 Pending Task Escalation

From the pending actions tracker, the agent maintains a live queue:

```
Saba resignation → Day counter increases daily
                    Day 7: Nudge to Finance for sign-off
                    Day 14: Escalate to Bruk
                    Day 30: Alert: "Experience letter overdue"
                    
Nahom resignation → Same escalation ladder

Eyob loan balance → Flag until Finance confirms
                    Day 14: "Loan status still unknown"
                    
Aman CASA return → 30-day deadline set
                    Day 15: Reminder
                    Day 30: "Overdue — escalation needed"
```

### 3.4 Clearance Workflow (Digital)

When a resignation is initiated:

```
1. Agent creates clearance record: [Employee Name] → [Status: Initiated]
2. Steps checklist:
   ☐ Asset audit (check asset tracking sheet)
   ☐ Finance sign-off (final dues, loans)
   ☐ Department handover (work files, passwords)
   ☐ CCTV access removal
   ☐ Experience letter drafted
   ☐ Exit interview conducted
   ☐ Final clearance signed
3. Each step: Agent notifies responsible person, tracks completion
4. When all ✅: Agent archives record, updates employee directory
```

---

## 4. 12-Month Roadmap

### Phase 1: Foundation (Month 1 — April 2026)
| Week | Deliverable | Effort | Owner |
|------|-----------|--------|-------|
| W1 | Change all passwords, resolve 4 pending items, confirm office rent | 4 hours | Bruk |
| W1-2 | Payroll cron jobs live, document retrieval working | 2 hours | Agent |
| W2 | Employee directory created (JSON + Sheet) | 1 hour | Bruk + Agent |
| W2 | Contract calendar live with countdown alerts | 30 min | Agent |
| W3 | Digital clearance workflow implemented | 2 hours | Agent |
| W3 | Recruitment pipeline tracker active | 1 hour | Agent |
| W4 | Full system test, documentation finalized | 2 hours | Bruk + Agent |

**End of Month 1 state:** All critical HR coordination fully automated. Dashboard shows real-time status. Bruk has complete visibility without HR person.

### Phase 2: Consolidation (Month 2-3 — May to June 2026)
| Deliverable | Description | Effort |
|-----------|-----------|--------|
| Payroll consolidation engine | Auto-reads department sheets, generates summary | 4 hours |
| Performance review cycle setup | Q2 review reminders + templates | 2 hours |
| Office lease renewal action | Initiate renewal for ChipChip office (May 20 deadline) | Bruk time |
| Warehouse lease audit | Unknown status → check box file, add to calendar | 1 hour |

### Phase 3: Enhancement (Month 4-6 — July to Sept 2026)
| Deliverable | Description | Effort |
|-----------|-----------|--------|
| Org dashboard with salary analytics | Headcount, cost per dept, hiring projections | 6 hours |
| Automated offer letter generator | Pre-filled from templates | 3 hours |
| Leave tracking module | Balance tracking, request approvals | 4 hours |
| Avenir lease renewal prep | Start discussions before Dec 2026 expiry | Bruk time |

### Phase 4: Maturity (Month 7-9 — Oct to Dec 2026)
| Deliverable | Description | Effort |
|-----------|-----------|--------|
| Ethiojobs API integration | Direct job posting from agent | 8 hours |
| Employee self-service portal | Request documents, view payslips (simple web) | 12 hours |
| Automated compliance calendar | Ethiopian Labour Proclamation milestones | 3 hours |
| Quarterly HR audit report | Agent generates compliance + cost summary | 1 hour/quarter |

### Phase 5: Optimization (Month 10-12 — Jan to Mar 2027)
| Deliverable | Description | Effort |
|-----------|-----------|--------|
| Predictive attrition alerts | Pattern-based warning signs | 6 hours |
| Full payroll automation | End-to-end from collection to payment verification | 8 hours |
| Integration with Ethiopian tax system | Automatic pension (7%), income tax calculations | 10 hours |
| Annual HR strategy document | Agent generates yearly report from data | 2 hours |

---

## 5. Cost Estimate

### Compute (OpenClaw Platform)

| Component | Current Cost | Description |
|-----------|-------------|-------------|
| **HR Agent (qwen3.6-plus-preview:free)** | $0/month | Free model, sufficient for text-heavy admin tasks |
| **Cron jobs (6 scheduled)** | $0/month | Included in OpenClaw subscription |
| **Dashboard hosting (Vercel)** | $0/month | Free tier (generous for internal tool) |
| **Storage (workspace files)** | $0/month | Text files + links, negligible |
| **Telegram notifications** | $0/month | Bot API is free |
| **Subtotal — Compute** | **$0/month** | Using free/open-source stack |

### Third-Party Services (If Upgraded)

| Service | Cost/Month | When Needed | Description |
|---------|-----------|-------------|-------------|
| **OpenClaw Pro** (if needed for more agents) | ~$20-40 | Month 3+ | If adding more specialized agents (Finance Agent, Legal Agent) |
| **Google Workspace** (per user) | $6/user | Already existing | No changes needed; agent reads existing sheets |
| **Ethiojobs API access** | TBA | Month 6-9 | If API is available; currently manual upload only |
| **Vercel Pro** (if dashboard gets heavy traffic) | $20 | Month 6-9 | Unlikely needed for internal tool |
| **Custom domain + SSL** | $15/year | Optional | hr.chipchip.com or similar |
| **Total (upgraded)** | **~$41-65/month** | Month 3+ | Optional enhancements |

### Cost Summary

| Period | Monthly Cost | Annual Run Rate |
|--------|-------------|----------------|
| **Month 1** (Foundation) | $0 | $0 |
| **Month 2-3** (Consolidation) | $0 | $0 |
| **Month 4-6** (Enhancement) | $0 (or $20 if OpenClaw Pro) | $0-$240 |
| **Month 7-9** (Maturity) | $20 (if upgraded) | $240 |
| **Month 10-12** (Optimization) | $20 | $240 |
| **12-Month Total** | **$0 - $720** | **Negligible** |

**Bottom line:** ChipChip can run a fully functional autonomous HR Agent on **exactly $0 per month** using the existing OpenClaw free setup, Google Sheets, and Telegram. The only real cost is Bruk's time for initial setup (~8 hours in Week 1).

---

## 6. What the Agent CANNOT Do (Human-Required)

| Function | Why | Who Does It |
|----------|-----|-------------|
| **Hire/fire decisions** | Legal + ethical judgment | Bruk (CEO) |
| **Employee dispute resolution** | Requires empathy, presence | Bruk or trusted senior |
| **Physical document handling** | Box files, signed forms | Someone on-site in Addis |
| **Final salary calculations** | Financial liability | Finance team |
| **Negotiating lease terms** | Commercial judgment | Bruk |
| **Handling employee grievances** | Sensitivity required | Bruk or designated person |
| **CCTV access decisions** | Security discretion | Bruk/Yasin (Warehouse) |

---

## 7. Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Google Sheet access revoked | Low | High | Service account or shared drive; backup exports monthly |
| Agent misses a deadline | Low | High | Redundant L3/L4 escalation; weekly digest as net |
| Password not changed (Ethiojobs) | Medium | High | **Week 1 absolute priority** |
| No one physically present for HR tasks | Medium | Medium | Designate interim point person (Tesfa? Addis?) |
| Ethiopian labour law changes | Low | High | Agent monitors for news; quarterly legal review |
| Agent downtime (OpenClaw offline) | Low | Medium | Manual checklist backup printed for Bruk |
| Data privacy/employee information exposure | Low | High | Access-limited dashboard; agent doesn't share externally |

---

*End of System Design. Next step: execute Month 1 plan per the Immediate Actions document.*
