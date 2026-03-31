# ChipChip HR Handover Analysis & Agent Proposal
**Date:** 2026-03-31  
**Prepared by:** Nebila (outgoing HR)  
**Analyst:** Nova (OpenClaw)

---

## ⚠️ IMMEDIATE ACTION: CREDENTIALS EXPOSED
The handover doc contains a plaintext password (Ethiojobs: `12345678`). **BRUK: Change all passwords immediately** — this message has been in your Telegram history.

---

## 1. What's Being Handed Over — 6 Pillars

| Pillar | Complexity | Criticality | Links/Resources |
|--------|-----------|------------|----------------|
| **Recruitment** | Medium | High | 5 links (Ethiojobs ATS, job descriptions, applicant DB, app forms, interview notes) |
| **Payroll Processing** | High | CRITICAL | 10+ spreadsheets across 4 departments, monthly timeline 27th-8th |
| **Admin & Facilities** | Medium | High | 3 lease agreements, 10+ vendor contacts, CCTV access management |
| **Employee Relations** | High | High | Clearance process, warnings, experience letters, meeting minutes |
| **Onboarding/Offboarding** | Medium | High | Policy doc, offer letter templates, exit clearance |
| **Undone Works** | Low | Medium | 4 pending items (resignations, loan, asset return) |

---

## 2. Process Mapping — What the HR Agent Can Automate

### ✅ IMMEDIATE AUTOMATION (Week 1-2)
| Process | Current State | Agent Solution |
|--------|-------------|---------------|
| **Payroll Data Collection** | Manual follow-up with 4 departments | Cron reminders at 27th (data collection), 2nd (finalization), 5th (payment check) |
| **Contract Expiry Tracking** | Manual check of physical files | Auto alerts 90/60/30 days before: Office (Nov 2026), Avenir (Dec 2026) |
| **Pending Tasks** | 4 items sitting unresolved | Tracked on Mission Control dashboard, auto-escalated if >7 days stale |
| **Document Reminders** | Memory-based | HR agent stores all 35+ Google links and can retrieve on demand |

### ⚡ MEDIUM AUTOMATION (Week 3-4)
| Process | Current State | Agent Solution |
|--------|-------------|---------------|
| **Clearance Workflows** | Manual spreadsheet | Digital clearance template with auto-notifications to Finance + department heads |
| **New Hire Onboarding** | Manual per person | Template-based onboarding checklist, auto-sends offer letters, tracks completion |
| **Recruitment Pipeline** | Ethiojobs ATS + Telegram | Aggregate applicant DB, weekly vacancy posting reminders, candidate status tracking |

### 🔮 FUTURE AUTOMATION (Month 2+)
| Process | Current State | Agent Solution |
|--------|-------------|---------------|
| **Payroll Consolidation** | Manual compilation of 4 department sheets | Agent pulls data from all sheets, generates consolidated report for Finance |
| **Performance Reviews** | Department-managed | Quarterly check-in reminders, template-based review forms |
| **Org Chart & Capacity** | Implicit | Living org chart with headcount, salary costs per department |

---

## 3. Pending Actions — Priority List

| Priority | Item | Owner | Status | Deadline |
|----------|------|-------|--------|---------|
| 🔴 Urgent | **Saba Resignation** | HR | Clearance needed | ASAP |
| 🔴 Urgent | **Nahom Resignation** | HR | Clearance needed | ASAP |
| 🟠 High | **Eyob Loan** | Finance/HR | Outstanding balance | Check with Finance |
| 🟡 Medium | **Aman CASA Return** | Finance/HR | Birr return pending | Within 30 days |

---

## 4. Critical Dates & Deadlines

| Date | Event | Action Required |
|------|-------|----------------|
| **May 20, 2026** | ChipChip Office rent due | 20 days from now — initiate renewal |
| **June 9, 2026** | Avenir Dubai Mall rent due | ~70 days — start negotiation |
| **Nov 2026** | ChipChip Office lease expiry | ~230 days — begin renewal process |
| **Dec 2026** | Avenir Dubai Mall lease expiry | ~250 days — renewal planning |

---

## 5. Vendor Contact Directory (10 contacts)

| Vendor | Contact | Service |
|--------|---------|---------|
| Habtam (Ground Floor Coffee) | 0965098205 | Weekly office lunches |
| Ada Café | 0960226714 | Cake & special orders |
| Sisay | 0911185412 | Printer & ink |
| Generator Service | 0913049442 | Generator maintenance |
| Furniture/Metal Work | 0936135356 | Furniture repairs |
| Tamralech | — | Laundry (2mo) |
| Zebider | 0938181382 | External laundry service |
| Zion Electronics (Seyfe) | 0913436563 | CCTV maintenance |
| Ethiojobs ATS | ats.ethiojobs.net | Recruitment platform |
| Afriwork Employer (Telegram) | +251944110604 | Job postings |

---

## 6. HR Agent Architecture — What I'm Proposing

### Agent Name: **HR Assistant (ChipChip)**
**Model:** qwen3.6-plus-preview:free (cost-effective, good for administrative tasks)  
**Frequency:** Scheduled checks + on-demand responses

### Capabilities:
1. **Payroll Reminder Engine** — Auto-reminds departments at 27th, 2nd, 5th
2. **Contract Expiry Monitor** — Alerts for 3 lease agreements
3. **Pending Task Tracker** — Tracks the 4 unresolved items
4. **Document Retrieval** — All 35+ links indexed, available on-demand
5. **Clearance Process Manager** — Guides through resignation/termination workflow
6. **Recruitment Pipeline** — Manages job posting schedule across Ethiojobs + Telegram

### Dashboard:
A new "HR Operations" card in your Mission Control dashboard showing:
- Upcoming payroll deadlines
- Contract expiry countdowns
- Open resignations
- Recruitment status
- Headcount per department

### What CANNOT Be Automated:
- Final approvals for hires/fires (must be Bruk)
- Sensitive employee relations (warnings, disputes)
- Physical document management
- Finance final salary calculations

---

## 7. Recommended Next Steps

1. **Immediate:** Change all passwords that were shared in plaintext
2. **Today:** Create the HR agent in Mission Control with cron reminders
3. **This week:** Resolve the 4 pending actions (Saba, Nahom, Eyob, Aman)
4. **Next week:** Set up payroll automation and contract monitoring
5. **Month 2:** Implement digital clearance workflows

---

*End of analysis. Proceeding with HR agent creation and cron job setup.*
