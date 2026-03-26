# Standard Operating Procedure: Emergency Response & Crisis Management

**Document ID:** CHIP-OPS-006
**Version:** 1.0
**Effective Date:** 2026-03-16
**Owner:** Operations Manager
**Review Cycle:** Semi-annually

---

## 1. Purpose

To ensure ChipChip can respond quickly, effectively, and consistently to emergencies and crises — protecting customers, team members, brand reputation, and business continuity.

## 2. Scope

All emergency situations including but not limited to: platform outages, food safety incidents, data breaches, delivery accidents, natural disasters, supplier crises, and public relations emergencies.

## 3. Emergency Severity Levels

| Level | Description | Examples | Response Time |
|-------|-------------|----------|--------------|
| **SEV-1 (Critical)** | Immediate threat to health, safety, or business survival | Food safety incident, data breach, platform-wide outage, delivery accident with injury | Immediate (within 15 minutes) |
| **SEV-2 (Major)** | Significant disruption to operations or customer experience | Partial platform outage, supplier collapse, delivery fleet failure, viral negative press | Within 30 minutes |
| **SEV-3 (Moderate)** | Contained disruption with limited impact | Single feature outage, regional delivery delay, moderate customer complaints | Within 2 hours |
| **SEV-4 (Minor)** | Low-impact incident requiring attention | Individual customer issue, minor bug, small supplier delay | Within 4 hours |

## 4. Emergency Response Team (ERT)

### Core Team

| Role | Primary | Backup | Responsibilities |
|------|---------|--------|-----------------|
| Incident Commander | Operations Manager | COO | Overall coordination, decision authority, external communication |
| Technical Lead | CTO / Sr. Engineer | Engineering Manager | Platform diagnostics, fixes, rollback decisions |
| Communications Lead | Marketing Manager | Head of PR | Customer communication, social media, press |
| Customer Success Lead | CS Manager | CS Team Lead | Customer notifications, complaint management |
| Logistics Lead | Logistics Manager | Ops Coordinator | Delivery management, driver communication |
| Legal Advisor | Legal Counsel | External Counsel | Regulatory compliance, liability, insurance |

### Activation Protocol

1. **Any team member** can activate the ERT by posting in `#emergency` Slack channel with:
   - Severity level
   - Brief description
   - Affected area
2. **Incident Commander** confirms activation within 15 minutes (SEV-1/2) or 2 hours (SEV-3/4).
3. **Core team** assembles in `#emergency` channel (virtual war room).
4. **Incident Commander** assigns roles and establishes communication cadence.

## 5. Incident Response Playbooks

### 5.1 Food Safety Incident

**Triggers:** Customer reports illness, foreign object in food, contamination discovery, supplier recall notice.

**Immediate Actions (within 15 minutes):**
1. **Quarantine:** Pull all affected products from inventory. Flag in system as `DO_NOT_SELL`.
2. **Identify:** Trace all orders containing affected products in the past [X] days.
3. **Notify:** Contact all affected customers with:
   - Health advisory (seek medical attention if symptomatic)
   - Product recall information
   - Full refund + additional compensation
4. **Report:** Notify relevant health authorities per local regulations.
5. **Supplier:** Suspend supplier account immediately. Demand incident report within 24 hours.

**Follow-Up (24-72 hours):**
- Medical follow-up with affected customers
- Full supplier audit and investigation
- Root cause analysis report
- Regulatory compliance documentation
- Public statement if required (draft with Legal)

### 5.2 Platform Outage

**Triggers:** Monitoring alerts, customer reports, internal discovery.

**Immediate Actions (within 15 minutes):**
1. Engineering on-call investigates and classifies: partial vs. full outage.
2. If full outage and ETA >30 min: Communications Lead posts status update on:
   - Status page
   - Social media
   - In-app banner (if accessible)
3. Pause all scheduled marketing campaigns and push notifications.
4. If payment system affected: flag all pending transactions for reconciliation.

**Communication Templates:**
- **Initial (within 30 min):** "We're aware of an issue affecting [specific area] and our team is working on it. We'll update you shortly."
- **Update (every 60 min):** "Our team has identified [the issue] and is [working on a fix / implementing a fix]. Expected resolution: [timeframe]."
- **Resolved:** "The issue has been resolved. [Brief explanation]. Thank you for your patience. [Compensation if applicable]."

**Post-Incident:**
- Full post-mortem within 48 hours
- Document: timeline, root cause, impact, fix, prevention measures
- Share learnings with team

### 5.3 Data Breach

**Triggers:** Security alert, external report, unusual access patterns.

**Immediate Actions (within 15 minutes):**
1. **Contain:** Isolate affected systems. Revoke compromised credentials.
2. **Assess:** Determine what data was accessed/exfiltrated.
3. **Legal:** Immediately engage legal counsel.
4. **Do NOT** publicly disclose details until legal advises.

**Within 24 hours:**
- Complete initial forensic assessment
- Determine notification requirements (regulatory and customer)
- Draft customer notification (reviewed by Legal)
- Engage external security firm if needed

**Within 72 hours:**
- Notify affected customers (per legal requirements)
- File regulatory notifications as required
- Implement remediation measures
- Public statement if required

### 5.4 Delivery Accident / Safety Incident

**Triggers:** Driver reports accident, customer reports injury, vehicle incident.

**Immediate Actions:**
1. Ensure human safety first — call emergency services if needed (911/local equivalent).
2. Incident Commander contacted immediately.
3. Document the scene: photos, witness statements, police report number.
4. Notify insurance provider.
5. If customer injury: CS Lead contacts customer directly with empathy and support.
6. Suspend driver from active deliveries pending investigation.

**Follow-Up:**
- Full incident report within 24 hours
- Insurance claim filed within 48 hours
- Driver review and potential retraining/disciplinary action
- Customer care follow-up (medical expenses coverage if applicable)

### 5.5 Supplier Crisis (Sudden Closure, Fraud, etc.)

**Triggers:** Supplier becomes unresponsive, reports of financial trouble, fraud discovery.

**Immediate Actions:**
1. Attempt contact via all channels (phone, email, in-person if local).
2. If confirmed closure: identify all pending orders with this supplier.
3. Contact affected customers — offer substitute products or full refund.
4. Switch to backup supplier for those product categories.
5. Assess financial exposure (outstanding payments, prepaid inventory).
6. If fraud suspected: engage Legal and document everything.

## 6. Communication Protocols

### Internal Communication
- All incident communication happens in `#emergency` Slack channel.
- Status updates every 30 minutes (SEV-1), 60 minutes (SEV-2), 2 hours (SEV-3).
- Use structured updates: `STATUS | [timestamp] | [summary] | [next update time]`

### External Communication
- Only the **Incident Commander** or **Communications Lead** communicates externally.
- All customer-facing statements reviewed by Legal before release (SEV-1/2).
- Social media responses are factual, empathetic, and action-oriented.
- Never speculate about causes or blame in public statements.

### Media / Press
- All media inquiries routed to Communications Lead.
- No team member speaks to media without authorization.
- Prepared holding statement: "We're aware of [situation] and are actively working to [resolve it / investigate]. We'll share more information as it becomes available."

## 7. Post-Incident Process

### Within 48 Hours
1. **Post-Mortem Meeting:** All involved team members.
2. **Blameless Analysis:** Focus on systems and processes, not individuals.
3. **Document:** Timeline, root cause(s), what went well, what didn't.
4. **Action Items:** Specific, assigned, with deadlines.

### Within 1 Week
1. Share post-mortem with relevant stakeholders.
2. Implement immediate preventive measures.
3. Update this SOP if gaps were identified.
4. Schedule follow-up review for preventive measures (30 days out).

### Post-Mortem Template
```
# Incident Post-Mortem: [Title]

**Date:** [Date]
**Severity:** [Level]
**Duration:** [Start time] → [End time]
**Incident Commander:** [Name]

## Summary
[2-3 sentence description of what happened]

## Impact
- Customers affected: [number]
- Orders affected: [number]
- Revenue impact: [$ amount]
- Reputation impact: [assessment]

## Timeline
| Time | Event |
|------|-------|
| [HH:MM] | [Event] |
| [HH:MM] | [Event] |

## Root Cause
[Detailed analysis of why this happened]

## What Went Well
- [Thing 1]
- [Thing 2]

## What Needs Improvement
- [Thing 1]
- [Thing 2]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| | | | |
```

## 8. Drills & Preparedness

- **Tabletop Exercise:** Quarterly — walk through a hypothetical scenario with the ERT.
- **Technical Failover Test:** Bi-annually — test backup systems and recovery procedures.
- **Contact Verification:** Monthly — confirm all emergency contact numbers are current.
- **SOP Review:** Semi-annually — update procedures based on incidents and drill learnings.

---

*The best emergency response is the one you practiced before you needed it.*
