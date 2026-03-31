# ChipChip HR — Immediate Action Plan (4 Weeks)

**Version:** 1.0  
**Date:** 2026-03-31  
**Prepared by:** Nova (Business Analyst)  
**For:** Bruk T. / ChipChip Share Co.  
**Context:** Nebila leaving; 4-week sprint to secure and automate HR operations

---

## Overview

This is a **battle plan** — not a wish list. Every item has a clear owner (Bruk or Agent), a deadline, and a risk if not done. The goal: by end of April 2026, ChipChip's HR operations run autonomously with Bruk's oversight.

---

## Week 1 (March 31 – April 6, 2026): Lock Down & Clean House ⚡

**Theme:** Security first, resolve debts, confirm office safety.

### 1. Change All Passwords 🔴 CRITICAL
**Owner:** BRUK  
**Deadline:** TODAY (March 31)  
**Why urgent:** Passwords were shared in plaintext in handover documents. Anyone with access to these files could log in.

| System | Action | Current State |
|--------|--------|---------------|
| Ethiojobs ATS (ats.ethiojobs.net) | Change password immediately | Exposed: `12345678` |
| Zion CCTV Admin | Change password; revoke for any departed employees | Exposed: `zion@123` |
| CCTV Warehouse (Tesfa) | Change password; update encryption key | Exposed: `zion@321` |
| Google Drive (shared HR folder) | Review sharing permissions; remove Nebila's access if already gone | TBD |
| Telegram groups (HR-related) | Remove Nebila from admin if needed | TBD |

**Agent role after passwords changed:** Store new passwords securely. Agent should NOT store passwords in plain text — use encrypted notes or password manager.

### 2. Resolve the 4 Pending Items 🔴 CRITICAL
**Owner:** BRUK (coordination), Agent (tracking)

| # | Item | Action Required | Deadline | Status Target |
|---|------|----------------|----------|---------------|
| 1 | **Saba Resignation** | Complete all 5 clearance steps (assets, finance, handover, experience letter, exit interview) | April 4 | ✅ Closed |
| 2 | **Nahom Resignation** | Same clearance process | April 6 | ✅ Closed |
| 3 | **Eyob Loan Balance** | Get current balance from Finance; document repayment plan | April 3 | 📋 Documented |
| 4 | **Aman CASA Return** | Confirm amount with Finance; set deadline for return | April 3 | 📋 Amount confirmed |

**Execution steps for Saba/Nahom clearance:**
1. Open the clearance form: [Clearance Sheet](https://docs.google.com/spreadsheets/d/1_wfhpr8ltrDZi30VrIpCKrTmNwZJjBxywETG0v8-kyE/edit)
2. Check asset tracking sheet: [Assets](https://docs.google.com/spreadsheets/d/1i7LoZ8yjwyVFr9w6zkANzpNkCajuY_jH6tsmV795VCg/edit)
3. Contact Finance for final dues calculation
4. Prepare experience letter using template: [Templates](https://drive.google.com/drive/folders/17yPdyKec2t50qlUfOk2eu6e1SY3oKKoM)
5. Schedule brief exit interview (15-20 mins, can be done by Bruk)
6. Remove CCTV access, revoke system access
7. Sign final clearance form

### 3. Confirm Office Rent Status 🟠 HIGH
**Owner:** BRUK  
**Deadline:** April 3

| Question | Action | Why |
|----------|--------|-----|
| ChipChip Office: Paid until May 20? | Check ChipChip box file for receipt/transfer confirmation | 20 days remaining — must initiate renewal process within Week 1 |
| Avenir Dubai Mall: Paid until June 9? | Check Avenir box file | ~70 days, but start relationship check with landlord |
| Warehouse lease: Unknown paid-until date | Find lease in box file, log expiry date into tracker | Gap in knowledge is a risk |

**Agent role:** Log exact dates into the contract calendar. Set reminders:
- Office rent: Alert April 15 (35 days before expiry)
- Avenir rent: Alert May 9 (30 days before expiry)

### 4. Document Recovery 🟠 HIGH
**Owner:** BRUK  
**Deadline:** April 5

- [ ] Locate the ChipChip physical box file (leases, contracts, legal docs)
- [ ] Locate the Avenir physical box file
- [ ] Take photos of all leases and store in Google Drive
- [ ] Verify all 25+ Google Drive links from the knowledge base are still accessible
- [ ] Create a "Master Index" Google Doc listing every important file and its location

### 5. Identify Interim HR Point Person 🟠 HIGH
**Owner:** BRUK  
**Deadline:** April 6

**Recommendation:** Someone already at ChipChip needs to be the physical HR contact — the person who handles:
- Physical document signing
- Employee face-to-face interactions (clearance, disputes)
- Coordinating with Finance in person
- Acting on agent reminders

**Candidates to consider:**
- **Tesfa** — Already has CCTV access, knows operations
- **Addis** — Familiar with admin tasks
- **Yasin** — Handles warehouse, could take on additional admin

**Agent role:** Once identified, agent sends reminders TO this person.

### Week 1 Success Criteria
- ✅ All passwords changed
- ✅ Saba & Nahom clearance completed or well-advanced
- ✅ Eyob loan balance confirmed
- ✅ Aman CASA amount confirmed
- ✅ All lease dates documented
- ✅ Interim HR point person appointed
- ✅ Agent cron jobs live (payroll reminders started)

**Risk if Week 1 fails:** Exposed credentials → account takeover. Unresolved resignations → legal risk under Ethiopian Labour Proclamation. Unconfirmed office rent → risk of non-payment.

---

## Week 2 (April 7 – April 13, 2026): Automate the Core 🛠️

**Theme:** Payroll automation, employee directory, document management.

### 1. Set Up Automated Payroll Reminders 🟠 HIGH
**Owner:** AGENT (setup), BRUK (validation)  
**Deadline:** April 10

| Cron Job | What It Does | Notification |
|----------|-------------|-------------|
| `27th monthly, 9AM EAT` | "Payroll data collection — departments submit attendance" | Telegram → Bruk + dept heads |
| `2nd monthly, 9AM EAT` | "Finalize and submit to Finance" | Telegram → Bruk |
| `5th monthly, 9AM EAT` | "Verify salaries were paid" | Telegram → Bruk |
| `8th monthly, 9AM EAT` | "Any OT pending separate payment?" | Telegram → Bruk |

**Setup steps:**
1. Create the 4 cron jobs in OpenClaw
2. Test all 4 with dry-run (fake notification)
3. Confirm Bruk receives them on Telegram
4. Verify the payroll calendar for April (27th is a Monday — good timing)

**April 2026 payroll calendar:**
- Data collection: April 27 – 30
- Submit to Finance: May 2
- Payment window: May 5 – 8
- OT settlement (if delayed): By May 13

### 2. Create Employee Directory 🟠 HIGH
**Owner:** BRUK (data), AGENT (format)  
**Deadline:** April 11

Create a structured employee roster stored as a Google Sheet AND as JSON in the workspace:

**Fields per employee:**
```
- Full name
- Department (CS / Logistics / Warehouse / Admin / Management)
- Role / Title
- Start date
- Contract end date (if fixed-term)
- Phone number
- Email
- Salary band (not exact amount — for dashboard privacy)
- Emergency contact
- Status (Active / On Leave / Resigned)
```

**Estimated headcount:** ~30-50 employees across departments (to be confirmed from attendance sheets).

**Agent role:** Auto-generate the JSON file from Bruk's input. Monthly reconciliation — compare directory to attendance sheets to catch discrepancies.

### 3. Organize Document Management 🟡 MEDIUM
**Owner:** BRUK + AGENT  
**Deadline:** April 13

| Task | Description |
|------|------------|
| Index all Google Drive links | Agent creates an organized index by category |
| Create "HR Quick Reference" | One-page doc with all essential links (for Bruk) |
| Set up monthly backup reminder | Agent reminds: "Export critical sheets to backup" |
| Organize employee records folder | Ensure all employee files are properly named and sorted |

### 4. Verify Department Attendance Systems 🟡 MEDIUM
**Owner:** BRUK  
**Deadline:** April 10

- [ ] Confirm Customer Service attendance sheet is actively maintained
- [ ] Confirm Logistics attendance sheet is current
- [ ] Confirm Warehouse attendance sheet is current
- [ ] Identify who maintains each sheet (backup person needed)
- [ ] Check for any gaps or anomalies in recent data

### Week 2 Success Criteria
- ✅ Payroll cron jobs tested and live
- ✅ Employee directory created (Sheet + JSON)
- ✅ All documents indexed and accessible
- ✅ Department attendance systems verified
- ✅ Bruk has a "HR Quick Reference" one-pager

**Risk if Week 2 fails:** Missed April payroll cycle → employee dissatisfaction. No employee directory → inability to do headcount planning. Unverified attendance → payroll errors.

---

## Week 3 (April 14 – April 20, 2026): Build Workflows 🔧

**Theme:** Digital clearance, recruitment pipeline, contract monitoring.

### 1. Implement Digital Clearance Workflow 🟠 HIGH
**Owner:** AGENT (build), BRUK (validate)  
**Deadline:** April 17

**Workflow design:**

When someone resigns, Bruk types to the agent: *"Start clearance for [Name]"*

Agent then:
1. Creates a clearance record with today's date
2. Generates a checklist:

```
📋 CLEANCE — [Employee Name]

☐ Step 1: Asset Return (Due: Day 3)
   - Check asset tracking sheet
   - Return laptop/phone/keys/badge
   - Responsible: IT/Office Manager

☐ Step 2: Finance Sign-Off (Due: Day 5)
   - Confirm no outstanding loans
   - Calculate final dues + leave balance
   - Responsible: Finance team

☐ Step 3: Work Handover (Due: Day 7)
   - Transfer files and passwords
   - Document ongoing work
   - Responsible: Direct supervisor

☐ Step 4: Access Revocation (Due: Day 7)
   - CCTV access removed
   - Google Drive access removed
   - Telegram groups removed
   - Responsible: IT/Admin

☐ Step 5: Experience Letter (Due: Day 10)
   - Draft from template
   - Print and sign
   - Responsible: Bruk/Interim HR

☐ Step 6: Exit Interview (Due: Day 10)
   - Standard questionnaire
   - Document feedback
   - Responsible: Bruk or Interim HR

☐ Step 7: Final Sign-Off (Due: Day 14)
   - All boxes checked = clearance complete
   - File in employee records
```

3. Agent sends daily reminders for incomplete steps
4. At Day 10: escalation if not complete
5. At Day 14: Urgent alert to Bruk

**Agent role:** Maintain the workflow engine, send reminders, track deadlines, update dashboard.

### 2. Set Up Recruitment Pipeline 🟠 HIGH
**Owner:** AGENT (tracking), BRUK (decisions)  
**Deadline:** April 20

**Current recruitment assets:**
- Ethiojobs ATS: 34 posts remaining
- Freelance Ethiopia Telegram: Afriwork channel
- Applicant database (Google Sheet with master list)
- Interview notes (Google Doc)

**Agent recruitment workflow:**
1. Agent maintains a simple pipeline board:
   ```
   [Posted] → [Applications Received] → [Screening] → [Interview Scheduled] → [Interviewed] → [Offer Sent] → [Hired]
   ```
2. Weekly Monday report: "Active vacancies: X | Applications this week: Y | Interviews scheduled: Z"
3. Post-removal reminder: "You have 34 Ethiojobs posts remaining. Used 0 this month."
4. Candidate retrieval: "Show me all applicants for warehouse supervisor"

**Bruk's role:** Makes hiring decisions. Agent organizes information.

**Recruitment readiness checklist:**
- [ ] Review current vacancies — are positions still open from before?
- [ ] Update applicant database with accurate current status
- [ ] Set up a weekly candidate review slot on Bruk's calendar

### 3. Contract Monitoring System 🟡 MEDIUM  
**Owner:** AGENT  
**Deadline:** April 18

Active countdown timers for:

| Contract | Paid Until | Lease Expiry | Agent Reminders |
|----------|-----------|-------------|----------------|
| ChipChip Office Rent | May 20, 2026 | Nov 2026 | Apr 15 (rent), Aug 1 (lease renewal start) |
| Avenir Dubai Mall Rent | June 9, 2026 | Dec 2026 | May 9 (rent), Sep 1 (lease renewal) |
| Office Lease | Nov 2026 | Nov 2026 | Aug 1 (start renewal) |
| Avenir Lease | Dec 2026 | Dec 2026 | Sep 1 (start renewal) |
| **Warehouse** | **UNKNOWN** | **TBD** | **Agent: prompt Bruk to find docs** |

**Agent action for warehouse:** Every Monday until resolved: "Warehouse lease terms still not documented. Please check box file."

### 4. Vendor Directory Setup 🟡 MEDIUM
**Owner:** AGENT  
**Deadline:** April 20

- Agent stores all 10 vendor contacts
- Structured so Bruk can ask: "Who fixes our printer?" → "Sisay: 0911185412"
- Add contact for office landlord(s) — currently missing from handover
- Add contact for the person who handles rent payments (accounting contact)

### Week 3 Success Criteria
- ✅ Digital clearance workflow tested with a mock resignation
- ✅ Recruitment pipeline active and reporting weekly
- ✅ All contract dates monitored with active alerts
- ✅ Vendor directory searchable
- ✅ Warehouse lease issue acknowledged with active nag

**Risk if Week 3 fails:** Next resignation will be a mess without digital clearance. Recruitment blind spots mean positions sit empty. Unmonitored contracts risk non-renewal.

---

## Week 4 (April 21 – April 27, 2026): Test & Transfer 🧪

**Theme:** Stress-test everything, document what works, prepare for handover.

### 1. End-to-End System Test 🟡 MEDIUM
**Owner:** BRUK + AGENT  
**Deadline:** April 24

Run through these test scenarios:

| Test | What We Verify | Expected Result |
|------|---------------|-----------------|
| **Payroll simulation** | Do 27th/2nd/5th reminders fire correctly? | Bruk receives all 3 Telegram messages on test |
| **Document retrieval** | Ask agent: "Show me the clearance form link" | Agent returns correct link within 30 seconds |
| **Contract alert** | Ask agent: "When does office rent expire?" | Agent responds: "May 20, 2026 (XX days)" |
| **Clearance workflow test** | Start mock clearance for "Test Person" | All steps generated, reminders scheduled |
| **Employee directory query** | Ask: "Who works in logistics?" | Agent returns names and contacts |
| **Emergency scenario** | "Urgent: someone is resigning today" | Agent initiates full clearance workflow immediately |

### 2. Create "How-To" Documentation 🟡 MEDIUM
**Owner:** AGENT  
**Deadline:** April 25

Agent generates a **ChipChip HR Operations Manual** covering:

1. **Who does what** — Bruk's role vs. Agent's role for each process
2. **Monthly calendar** — All recurring HR tasks with dates
3. **Emergency procedures** — What to do when: someone resigns, payroll is late, contract is at risk
4. **Quick reference links** — All critical URLs in one place
5. **Contact directory** — All vendors, landlords, authorities
6. **Ethiopian HR compliance checklist** — Key labour law requirements:
   - Probation period (max 45 days)
   - Notice period (per Labour Proclamation No. 1156/2019)
   - Overtime rates (1.25x weekday, 1.5x night, 2x holiday)
   - Pension contribution (7% employee, 11% employer)
   - Annual leave minimum (14 days + 1 per year of service)
   - Severance pay formula

### 3. Determine Long-Term HR Ownership 🟡 MEDIUM
**Owner:** BRUK  
**Deadline:** April 27

Bruk needs to choose one of these options:

| Option | Description | Pros | Cons |
|--------|-----------|------|------|
| **A: Full Agent + Bruk** | Agent handles all coordination; Bruk makes decisions | Lowest cost, full visibility | Bruk time required (~2 hrs/week) |
| **B: Agent + Designated Person** | Interim HR person (from Week 1) acts on agent's behalf; Bruk oversees | Distributes workload | Requires training that person |
| **C: Agent + Part-time HR Hire** | Hire part-time HR professional; agent assists them | Most professional | Added cost (~Birr 10,000-15,000/month) |
| **D: Agent Only** | Agent handles everything except decisions Bruk must make | Fully autonomous | Risk for sensitive matters |

**Nova's recommendation:** Start with **Option B** for 2-3 months, then evaluate. Designate one trusted person as interim HR point person who receives agent reminders and handles physical tasks. This gives you coverage while assessing whether you need to hire a part-time HR person.

### 4. April Payroll Run — Final Validation 🟠 HIGH
**Owner:** BRUK  
**Deadline:** April 27

April 27 is the payroll collection date. Use this as a live test:
- [ ] Agent sends the 27th reminder (this is the first real payroll cycle under the new system)
- [ ] Verify all 4 departments submit on time
- [ ] Check for any issues with the process
- [ ] Document any gaps to fix for May

### Week 4 Success Criteria
- ✅ All system tests pass
- ✅ HR Operations Manual generated
- ✅ Decision made on long-term ownership model
- ✅ April payroll runs smoothly through the new system
- ✅ Any identified gaps logged for Month 2 work

---

## Priority Summary

### 🔴 Do This Week (Week 1) — Non-Negotiable
1. Change all passwords (Ethiojobs, CCTV, Google) → BRUK, TODAY
2. Resolve Saba & Nahom resignations → BRUK, April 6
3. Confirm Eyob loan balance → BRUK + Finance, April 3
4. Confirm Aman CASA amount → BRUK + Finance, April 3
5. Check office rent payment status → BRUK, April 3
6. Find warehouse lease terms → BRUK, April 5
7. Identify interim HR point person → BRUK, April 6
8. Activate payroll cron jobs → AGENT, April 6

### 🟠 Do Next Week (Week 2) — Build Foundation
9. Employee directory → BRUK + Agent, April 11
10. Organize & index all documents → AGENT, April 13
11. Verify department attendance systems → BRUK, April 10

### 🟡 Do Following Weeks (Week 3-4) — Strengthen
12. Digital clearance workflow → AGENT + BRUK, April 17
13. Recruitment pipeline → AGENT + BRUK, April 20
14. Contract monitoring → AGENT, April 18
15. Full system test → BRUK + Agent, April 24
16. HR Operations Manual → AGENT, April 25
17. April payroll live run → BRUK, April 27

---

## Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | Nebila deletes/revokes access to Google Drive files before departure | Medium | High | **Week 1:** Download copies of all critical files, share folder to neutral account |
| R2 | Passwords not changed → account compromise | Medium | High | **Week 1, Item 1.** If forgotten: assume compromised, change + review activity log |
| R3 | April payroll missed or delayed | Low | High | Payroll reminders start April 27. Manual backup: calendar alert on Bruk's phone |
| R4 | Saba/Nahom clearance drags → legal risk | Medium | High | Agent escalates weekly. Ethiopian Labour law requires exit to be processed promptly |
| R5 | No physical HR person → processes break | Medium | High | Identify interim person in Week 1. Print HR manual as backup |
| R6 | Agent downtime (OpenClaw offline) | Low | Medium | Manual checklist printed. Bruk has quick-reference with key dates |
| R7 | Finance team not cooperating with agent | Medium | Medium | Bruk briefs Finance team on Day 1. Agent is an assistant, not a replacement |
| R8 | Office rent renewal mishandled | Low | Very High | Agent alerts at 35 days + 15 days + 7 days. Bruk contacts landlord directly |
| R9 | Employee data privacy breach | Low | Medium | Dashboard access limited. No employee salary data shared externally |
| R10 | Recruitment posts wasted (34 remaining, no posting cadence) | Medium | Medium | Agent tracks usage. Weekly reminder: "X posts used, X remaining" |

---

## Success Metrics (30-Day Targets)

By April 30, 2026, we should be able to say:

- ✅ All passwords changed and secured
- ✅ 0 open resignation clearances
- ✅ All 4 pending financial items resolved or documented
- ✅ All lease dates confirmed and monitored
- ✅ Payroll process running through agent reminders (April cycle completed)
- ✅ Employee directory complete and accurate
- ✅ Digital clearance workflow tested and documented
- ✅ Recruitment pipeline active and reporting
- ✅ HR Operations Manual generated and accessible
- ✅ Decision made on long-term HR ownership model
- ✅ Interim HR point person actively using agent reminders

---

*End of Immediate Action Plan. The agent is now ready to begin executing Week 1 tasks as directed by Bruk.*
