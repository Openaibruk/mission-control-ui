# ChipChip Credit Plan — 90-Day Pilot Test Action Plan

**Period:** Apr 2026 – Jun 2026 (90 days)
**Document Date:** 2026-03-31
**Author:** Nova, Business Analyst
**Based on:** [Credit Financial Plan Analysis](./chipchip-credit-plan-analysis.md)

---

## Executive Summary

This 90-day pilot plan tests ChipChip's credit/BNPL model at **50% scale** with **controlled risk exposure** before committing to the full 89.3M ETB revenue target. The pilot focuses on validating three critical assumptions:

1. **Do merchants actually want and use credit terms?** (behavioral validation)
2. **Can ChipChip collect on time?** (operational validation)
3. **Are the margin assumptions realistic?** (financial validation)

The pilot targets **~320 merchants** in **Addis Ababa**, with a maximum credit exposure cap of **600K ETB/month** (vs. the plan's 812K ETB projected for Month 1). This protects ChipChip while generating statistically meaningful data.

---

## 1. Pilot Objectives

### Primary Objectives

| # | Objective | How to Measure |
|---|-----------|---------------|
| 1 | Validate merchant demand for credit terms | Credit utilization rate (% of eligible merchants using credit) |
| 2 | Test collection processes and timelines | Days Sales Outstanding (DSO), collection success rate |
| 3 | Validate margin assumptions | Actual vs. projected margin per transaction type |
| 4 | Stress-test credit scoring model | Accuracy of initial credit limit predictions |

### Secondary Objectives

| # | Objective | How to Measure |
|---|-----------|---------------|
| 5 | Test platform usability | App adoption rate, support tickets per merchant |
| 6 | Validate operational capacity | Order fulfillment rate, delivery timeliness |
| 7 | Gather customer feedback | NPS score, qualitative interviews |
| 8 | Test FMCG step-growth assumption | Is the 50% revenue jump achievable in Month 3? |

---

## 2. Pilot Scale & Scope

### 2.1 Geographic Scope

**Primary market: Addis Ababa only**

| Zone / Sub-city | Target Merchants | Rationale |
|-----------------|:---:|------|
| Merkato (Kiryu) | 80 | Largest wholesale market in Ethiopia; highest B2B density |
| Shola Market | 60 | Second-largest traditional market; strong FMCG presence |
| Bole / Kazanchis | 50 | Modern retail corridor; good for Super Leader channel |
| Piassa / Arada | 50 | Central location; mixed traditional and modern trade |
| Kolfe / Nifas Silk | 40 | Emerging commercial areas; growth potential |
| Yeka / Gulele | 40 | Residential-commercial mix; FMCG distribution hub |
| **Total** | **320** | |

**Expansion readiness (Phase 2, post-pilot):** Dire Dawa, Hawassa, Bahir Dar, Mekelle — to be considered after pilot validation.

### 2.2 Customer Segmentation

| Segment | Target Count | Credit Limit (ETB) | Revenue Share Target |
|---------|:---:|:---:|:---:|
| **B2B Wholesalers** | 120 | 20,000 – 80,000 / month | ~55% |
| **FMCG Retailers** | 100 | 10,000 – 40,000 / month | ~30% |
| **Super Leaders (Large Retailers)** | 60 | 50,000 – 150,000 / month | ~15% |
| **Other (Kiosks, Distributors)** | 40 | 5,000 – 20,000 / month | ~5% (buffer) |
| **Total** | **320** | | **100%** |

> **Why 320?** This provides sufficient statistical power to measure default rates meaningfully. With 320 merchants, even a 3% default rate (10 merchants) is observable and analyzable — versus 50 merchants where a 1-2 defaulter could be noise.

### 2.3 Revenue & Credit Targets (90-Day Pilot)

| Metric | Month 1 (Apr) | Month 2 (May) | Month 3 (Jun) | **90-Day Total** |
|--------|:---:|:---:|:---:|:---:|
| **Revenue Target** | 1.3M ETB | 1.7M ETB | 2.2M ETB | **5.2M ETB** |
| **Credit Exposure Cap** | 600K ETB | 700K ETB | 800K ETB | — |
| **Active Merchants** | 150 | 220 | 320 | — |
| **Avg Transactions/Merchant/Month** | 8 | 10 | 12 | — |

> These are **50% of the full plan** projections for the same months.

---

## 3. Success Metrics & KPIs

### 3.1 Go/No-Go KPIs (Must-hits)

| KPI | Target | Measurement Period | Decision Impact |
|-----|--------|-------------------|-----------------|
| **Credit Utilization Rate** | ≥ 60% of eligible merchants use credit | Day 90 | < 40% = rethink product-market fit |
| **Collection Rate (30-day)** | ≥ 92% of credits collected within 30 days | Monthly | < 85% = extend pilot 30 days; < 75% = stop |
| **Default Rate (NPL)** | ≤ 4% of outstanding credit | Day 90 | > 6% = stop and redesign |
| **Gross Margin** | ≥ 12% (lower than 17.97% target — accounts for pilot costs) | Monthly | < 8% = review pricing |
| **Merchant Retention** | ≥ 80% of onboarded merchants still active at Day 90 | Day 90 | < 65% = investigate churn drivers |
| **Order Fulfillment Rate** | ≥ 95% | Monthly | < 90% = scale operations before expansion |

### 3.2 Health Metrics (Track but not go/no-go)

| KPI | Target | Notes |
|-----|--------|-------|
| Days Sales Outstanding (DSO) | ≤ 25 days | Under 30-day payment terms |
| Average Order Value (AOV) | ≥ 15,000 ETB | Validates merchant size assumptions |
| Customer Acquisition Cost (CAC) | ≤ 2,000 ETB per merchant | Sales efficiency |
| Net Promoter Score (NPS) | ≥ 40 | Merchant satisfaction |
| App Daily Active Users / Total Users | ≥ 50% | Digital adoption |
| Support Tickets per 100 Transactions | ≤ 3 | Platform stability |
| Repeat Purchase Rate | ≥ 70% within 14 days | Merchant stickiness |

### 3.3 Credit-Specific Metrics

| KPI | Target | Why It Matters |
|-----|--------|---------------|
| Credit-to-Revenue Ratio for Super Leaders | ≤ 30% (vs. plan's 20%) | Test slightly higher tolerance during pilot |
| B2B Credit-to-Revenue Ratio | ≤ 75% (vs. plan's 80%) | Validate demand for high credit coverage |
| Credit Limit Increase Requests | Track only | Shows merchant comfort level |
| Early Repayment Rate | Track only | Shows merchant financial health |
| Dispute Rate per Transaction | ≤ 1% | Quality control |

---

## 4. Risk Mitigation During Pilot

### 4.1 Risk Register

| Risk ID | Risk Description | Likelihood | Impact | Mitigation |
|---------|----------------|:---:|:---:|-----------|
| **R1** | Higher-than-expected default rates | Medium | 🔴 High | Start with conservative limits (50% of planned); tighten based on repayment data; no credit increases before Day 30 |
| **R2** | Low credit utilization (merchants don't want credit) | Medium | 🔴 High | Offer pilot incentives (first month 0% credit fee); survey non-users; adjust terms |
| **R3** | Working capital shortfall for credit extension | Medium | 🔴 High | Cap total pilot credit at 600K ETB (Month 1); secure backup credit line; monitor weekly |
| **R4** | Operational bottlenecks (warehouse, delivery) | High | 🟠 Medium | Pre-agree with third-party logistics provider as backup; maintain 20% capacity buffer |
| **R5** | Platform/app tech failures | Low | 🔴 High | Manual backup process ready (paper orders + phone-based credit); 24hr max downtime SLA for vendors |
| **R6** | Regulatory scrutiny (NBE lending rules) | Low | 🔴 High | Legal review of pilot terms before launch; ensure compliance with Ethiopian credit extension regulations |
| **R7** | Staff inexperience with credit processes | Medium | 🟠 Medium | Intensive 1-week training before launch; daily stand-ups during first 2 weeks; shadow senior staff |
| **R8** | FMCG revenue doesn't achieve step-growth | Medium | 🟡 Medium | Treat step-growth as hypothesis, not assumption; if flat, model accordingly |
| **R9** | Key merchant churn | Medium | 🟠 Medium | Assign account managers to top 20 merchants; offer retention incentives |
| **R10** | Currency/purchasing power changes during pilot | Low | 🟡 Medium | Monitor Birr exchange rates weekly; adjust credit limits if significant inflation occurs |

### 4.2 Risk Triggers & Escalation

| Trigger | Action |
|---------|--------|
| NPL rate exceeds 3% in any merchant segment | Freeze new credit for that segment; increase collection intensity |
| NPL rate exceeds 5% overall | Pause all new credit issuance; convene risk committee within 48 hours |
| Weekly credit exposure exceeds 110% of cap | Immediate pause on new approvals; review all pending applications |
| Platform downtime > 4 hours | Activate manual processes; tech team priority incident response |
| Merchant complaint volume spikes > 50% week-over-week | Root cause analysis within 24 hours; customer communication |
| Cash position below 2x outstanding credit exposure | Emergency working capital review; pause growth |

---

## 5. Go/No-Go Criteria for Full Rollout

### Decision Gate: Day 90 Review

**FULLY APPROVE** (all must be met):
- ✅ Collection rate ≥ 92%
- ✅ NPL rate ≤ 4%
- ✅ Gross margin ≥ 12%
- ✅ Credit utilization ≥ 60%
- ✅ Merchant retention ≥ 80%
- ✅ Platform uptime ≥ 99%
- ✅ All operational KPIs green

**CONDITIONAL APPROVE** (proceed with modifications):
- 🟡 1-2 criteria missed but explained by temporary factors (e.g., onboarding delays, one-time tech outage)
- 🟡 Collection rate 85-92% — extend pilot 30 additional days with tightened controls
- 🟡 Margin 8-12% — review pricing and cost structure before scaling
- 🟡 Credit utilization 40-60% — adjust merchant targeting and terms
- **Must re-review at Day 120**

**STOP / REDRAW** (any one is sufficient):
- 🔴 NPL rate > 6% — fundamental credit risk issue
- 🔴 Collection rate < 75% — collection process not viable
- 🔴 Credit utilization < 30% — product-market fit question
- 🔴 Operating cost exceeds margin by > 20%
- 🔴 Regulatory compliance issue identified
- 🔴 Working capital insufficient to sustain current scale

---

## 6. Budget for Pilot Phase (90 Days)

### 6.1 Estimated Pilot Budget

| Category | Month 1 (Apr) | Month 2 (May) | Month 3 (Jun) | **Total** |
|----------|:---:|:---:|:---:|:---:|
| **Credit Extension (Outstanding)** | 600K | 700K | 800K | — |
| **Payroll** | 350K | 450K | 520K | 1,320K |
| **Technology (Infrastructure, hosting)** | 80K | 80K | 80K | 240K |
| **Marketing & Merchant Onboarding** | 100K | 50K | 30K | 180K |
| **Operations (Warehouse, Transport)** | 120K | 150K | 180K | 450K |
| **Training & Onboarding** | 60K | 20K | 10K | 90K |
| **Contingency Fund (15%)** | 200K | 230K | 250K | 680K |
| **Total Cash Required** | **1,510K** | **1,680K** | **1,870K** | **5,060K** |

> **Total pilot budget: ~5.0M ETB** over 90 days.
> Credit extension of 600-800K ETB/month is working capital, not expense — it cycles back as collections succeed.

### 6.2 Cost Breakdown Explanation

| Area | Detail |
|------|--------|
| **Payroll** | ~11-13 person lean team: 2 sales, 1 credit, 1 collections, 3 ops, 3 tech, 1 finance = 350K Month 1, scaling to 520K Month 3 |
| **Technology** | Cloud hosting, SMS gateway (critical in Ethiopia where push notifications are unreliable), app distribution, monitoring tools |
| **Marketing** | Merchant onboarding incentives, field visits, referral bonuses for early adopters |
| **Operations** | Warehouse rent (Merkato-area), fuel/vehicle costs for delivery, packaging materials |
| **Training** | 5-day intensive bootcamp for all launch staff; credit policy workshops; app training |
| **Contingency** | 15% buffer for unexpected costs, faster hiring, or extended pilot activities |

### 6.3 Funding the Pilot

| Source | Amount (ETB) | Notes |
|--------|:---:|------|
| Internal reserves (working capital) | 3,000K | Primary source |
| Backup credit line (bank or partner) | 2,060K | Pre-arranged, undrawn |
| **Total available** | **5,060K** | |

> **Recommendation:** Do NOT fund credit extension through debt at 18-24% interest rates (common Ethiopian bank rates for working capital). At 2.4% B2B credit margin, borrowing costs would completely eliminate profitability. Use internal capital for the pilot.

---

## 7. Timeline & Milestones

### Week-by-Week Breakdown

#### Phase 1: Pre-Launch — Weeks 1-2 (Mar 16 – Mar 29, 2026)

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| W-2 | Core team hired (11 people) | CEO / HR | Signed contracts |
| W-2 | Credit policy finalized | Credit Risk Lead | Documented credit policy, scoring rules, approval matrix |
| W-2 | Platform MVP ready | Tech Lead | Deployed credit app + admin dashboard |
| W-1 | Staff training completed | All leads | Training completion certificates |
| W-1 | First 30 merchants pre-onboarded | Sales Lead | KYC completed, credit limits set |
| W-1 | Working capital secured | Finance Lead | Funds in account, credit line pre-approved |

#### Phase 2: Soft Launch — Weeks 3-4 (Mar 30 – Apr 12) ⚡ LAUNCH WEEK IS WEEK 3

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| W3 | Go-live with 30 merchants | All hands | First credit issued, first order fulfilled |
| W3 | Daily monitoring cadence established | Credit Risk Lead | Daily dashboard of credit exposures and collections |
| W3 | Manual backup process tested | Ops Lead | Paper-based order capability validated |
| W4 | Review and adjust credit limits | Credit Risk Lead | First credit limit adjustments based on actual behavior |
| W4 | Onboard additional 70 merchants (total 100) | Sales | KYC completed, credit limits set |

#### Phase 3: Build Momentum — Weeks 5-8 (Apr 13 – May 10)

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| W6 | 150 active merchants | Sales | Active merchant dashboard |
| W6 | First monthly financial report | Finance | Actuals vs. plan analysis |
| W7 | Credit scoring model V2 launched | Credit Risk Lead | Improved scoring using 30-day repayment data |
| W8 | Mid-pilot review (Day 45) | All leads | Progress report to leadership |
| W8 | 220 active merchants | Sales | Scale to second phase geographies within Addis |

#### Phase 4: Stabilize & Validate — Weeks 9-13 (May 11 – Jun 14)

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| W10 | 300 active merchants (of 320 target) | Sales | Near-full pilot scale |
| W11 | FMCG step-growth test (Month 3) | Ops + Sales | Validate 50% volume increase capability |
| W12 | First NPS survey completed | Sales | Merchant satisfaction score |
| W13 | **DAY 90: Full pilot review** | All leads | Go/No-Go decision package |

#### Phase 5: Decision — Week 14 (Jun 15 – Jun 21)

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| W14 | Go/No-Go decision | CEO / Board | Decision memo with data backing |
| W14 | If Go: 90-day scale plan created | All leads | Phase 2 detailed plan |
| W14 | If Conditional: Remediation plan | Credit Risk Lead | Specific fixes and re-review date |
| W14 | If Stop: Lessons learned documented | All leads | Post-mortem report |

### Key Milestones Summary

| Milestone | Date | Decision Point |
|-----------|------|---------------|
| 🏁 Team hired & trained | Mar 29 | Ready for launch? |
| 🚀 Soft Launch (30 merchants) | Mar 30-31 | First credit issued |
| 📊 30-Day Review | Apr 29 | Adjust or pivot? |
| 📈 Scale to 220 merchants | May 10 | Operations keeping pace? |
| 📋 Mid-Pilot Review (Day 45) | May 24 | On track? Any risks materializing? |
| 🎯 Full Pilot Scale (320) | Jun 1 | Ready for Day 90 assessment? |
| ✅ Day 90: Go/No-Go | Jun 14 | **DECISION: Full rollout or stop?** |

---

## 8. Pilot Governance Structure

### 8.1 Decision-Making Authority

| Decision | Authority | Escalation |
|----------|-----------|-----------|
| Individual credit limit (up to 50K ETB) | Credit Analyst | — |
| Individual credit limit (50K–150K ETB) | Credit Risk Lead | — |
| Credit limit > 150K ETB | Credit Risk Lead + CEO | — |
| Credit policy changes | Credit Risk Lead | CEO approval required |
| Pause new credit issuance | Credit Risk Lead | Notify CEO within 4 hours |
| Stop / redraw pilot | CEO | Board notification |
| Budget variance > 10% | Finance Lead | CEO approval required |

### 8.2 Reporting Cadence

| Report | Frequency | Audience | Content |
|--------|-----------|----------|---------|
| Daily Operations Snapshot | Daily (AM) | Core team | Yesterday's orders, credits issued, collections, incidents |
| Weekly Dashboard | Weekly (Monday) | Leadership | KPIs vs. targets, credit exposure, pipeline |
| Monthly Financial Report | Monthly (5th) | CEO + Board | Revenue, margin, costs, portfolio quality |
| Mid-Pilot Review | Day 45 | Leadership + Board | Comprehensive assessment, course corrections |
| Day 90 Go/No-Go | Day 90 | CEO + Board | Full pilot evaluation, decision package |

---

## 9. Post-Pilot Transition Plan

### If Go Condition Is Met:

| Action | Timeline | Owner |
|--------|----------|-------|
| Activate Phase 2 hiring plan | Day 91-95 | HR / CEO |
| Expand to 2 additional cities (Dire Dawa, Hawassa) | Day 91-120 | Ops + Sales |
| Activate Super Leader credit increase to 40% | Day 120+ | Credit Risk Lead (only after 30-day prep) |
| Scale platform to full feature set | Day 91-180 | Tech Lead |
| Build automated credit scoring V2 | Day 91-150 | Tech + Credit |
| Monthly reporting cadence (no longer daily) | Day 91+ | All |

### If Conditional Approval:

| Action | Timeline | Owner |
|--------|----------|-------|
| 30-day extension pilot | Day 91-120 | Same team |
| Tighten credit limits by 20% | Immediate | Credit Risk Lead |
| Double collection intensity | Immediate | Collections Lead |
| Conduct merchant interviews (n=30) | Day 91-105 | Sales + Product |
| Re-review at Day 120 | Day 120 | Leadership |

### If Stop Condition Is Met:

| Action | Timeline | Owner |
|--------|----------|-------|
| Freeze all new credit immediately | Day 91 | Credit Risk Lead |
| Accelerate collections on outstanding balances | Day 91-120 | Collections Lead |
| Wind down operations | Day 91-135 | Ops Lead |
| Document lessons learned | Day 91-105 | All leads |
| Present findings to board | Day 105 | CEO |

---

## 10. Summary & Next Steps

### Immediate Actions (Next 2 Weeks):

1. ✅ **Approve this pilot plan** at leadership level
2. 🔲 **Hire Credit Risk Lead** — top priority
3. 🔲 **Hire Collections Officer** — concurrent with Credit Risk Lead
4. 🔲 **Confirm working capital of 3M ETB** is ring-fenced for pilot
5. 🔲 **Pre-arrange backup credit line of 2M ETB** (undrawn)
6. 🔲 **Finalize MVP app features** — cut anything not essential for credit extension + collection
7. 🔲 **Book training venue** for 5-day bootcamp (start Mar 23)

### What Success Looks Like at Day 90:

> *"ChipChip has 300+ active merchants in Addis Ababa, extending ~750K ETB in credit monthly, collecting 92%+ within 30 days, generating 12%+ gross margins, and has a validated credit scoring model using real repayment data. The team is ready to scale to 2 additional cities with confidence."*

---

*Prepared by Nova, Business Analyst. Based on ChipChip Credit Financial Plan Analysis (Apr 2026 – Apr 2027).*
