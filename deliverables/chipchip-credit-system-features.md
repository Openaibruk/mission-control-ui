# ChipChip Credit Plan — System & App Feature Suggestions

**Period:** Apr 2026 – Apr 2027 (13 months)
**Document Date:** 2026-03-31
**Author:** Nova, Business Analyst
**Based on:** [Credit Financial Plan Analysis](./chipchip-credit-plan-analysis.md)

---

## Executive Summary

This document outlines the digital platform requirements for ChipChip's credit/BNPL business across three revenue streams generating 89.3M ETB over 13 months. The platform must support **45M ETB in credit exposure**, serve multiple user segments (B2B wholesalers, FMCG retailers, Super Leaders), and provide real-time risk management for a credit model that ramps from 31% to 63% credit-to-revenue ratios.

**Core principle:** Build for the Ethiopian market. Offline-first, mobile-money-native, Amharic/Oromiffa support, and USSD fallback must be foundational — not retrofit add-ons.

---

## 1. Platform Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              CHIPCHIP CREDIT PLATFORM                 │
├──────────────┬──────────────┬───────────────────────┤
│  Merchant    │  Admin       │  Collection           │
│  App         │  Dashboard   │  Portal               │
│  (Android)   │  (Web)       │  (Web + Mobile)       │
├──────────────┴──────────────┴───────────────────────┤
│              API GATEWAY                             │
├───────┬───────┬───────┬───────┬───────┬────────────┤
│  Auth │  Cred │  Order│  Pay  │  Notif │  Credit   │
│  Svc  │  Svc  │  Svc  │  Svc  │  Svc   │  Scoring  │
├───────┴───────┴───────┴───────┴───────┴────────────┤
│              DATA LAYER (Supabase/PostgreSQL)        │
├───────┬───────┬───────┬───────┬────────────────────┤
│  MFI  │  Telco│  Bank  │  ERP  │  SMS/Telebirr     │
│  API  │  API  │  API  │  API  │  Integrations      │
└───────┴───────┴───────┴───────┴────────────────────┘
```

---

## 2. Customer-Facing App Features (Merchant App)

### 2.1 P0 — Must Have (Launch)

| Feature | Description | Why Critical |
|---------|-------------|-------------|
| **Registration & KYC** | Phone number verification → Business registration → ID upload. Streamlined for Ethiopian context (TIN, Trade License, Kebele ID) | Foundation — no account without identity verification. Must work with Ethiopian documents. |
| **Credit Limit Display** | Real-time view of total credit limit, available balance, and utilized amount | Merchants need to know how much they can order *before* placing orders. Ethiopian B2B buyers plan purchases around available credit. |
| **Order Placement** | Browse catalog, select items, choose "Pay Now" or "Pay with Credit", confirm order | Core transaction flow. Must support both cash and credit in same order (partial credit). |
| **Credit Terms Display** | Clear display of repayment period (e.g., 14 days, 30 days), any credit fees, and due date | Transparency required by NBE guidelines and essential for trust. Display in Amharic + English. |
| **Payment Dashboard** | Outstanding balance, due dates, payment history, payment method options | Merchants must see their obligation clearly to avoid disputes. |
| **Mobile Money Payment** | Integrated payment via Telebirr, CBE Birr, M-Pesa Ethiopia | Ethiopian mobile money penetration exceeds bank account ownership. This is the primary payment channel. |
| **Order History** | Full transaction history with status (pending, delivered, paid, disputed) | Reference for merchants and audit trail for ChipChip. |
| **Push + SMS Notifications** | Order confirmation, delivery updates, payment reminders, overdue alerts | Push notifications unreliable on Android in Ethiopia. SMS backup is mandatory. |
| **Amharic Language Support** | Full app localization in Amharic | ~70% of Addis Ababa merchants prefer Amharic UI. English-only would be a major adoption barrier. |

### 2.2 P1 — Should Have (Within 60 Days)

| Feature | Description | Why Important |
|---------|-------------|---------------|
| **Credit Limit Increase Request** | Self-service request with reason (e.g., "Meher season" or "New branch") | Merchants who repay well will want higher limits. Self-service reduces admin workload. |
| **Repayment Reminders** | Multi-channel: SMS 7 days before, 3 days before, 1 day before, and on due date | Proactive reminders reduce collections workload. Ethiopian business culture — reminders should be polite, not threatening. |
| **Dispute Management** | Report wrong items, quantity issues, quality problems with photo evidence | Reduces collections friction — "I won't pay because 3 boxes were damaged" is a common scenario. |
| **Receipt & Invoice Download** | PDF receipts for each transaction | Ethiopian tax compliance requires transaction documentation. Merchants need this for their own accounting. |
| **Referral Program** | Invite other merchants, earn credit bonus or reduced fees | Low-cost customer acquisition in a network-driven market. Ethiopian merchants trust peer recommendations. |
| **Multi-User Accounts** | Business owner + staff access with role-based permissions | Larger B2B and Super Leader accounts have buyers who aren't owners. |
| **Oromiffa Language Support** | Secondary language option | Essential for regional expansion beyond Addis Ababa. |

### 2.3 P2 — Nice to Have (Within 120 Days)

| Feature | Description |
|---------|-------------|
| **USSD Fallback** | *888# style interface for merchants without smartphones |
| **Voice Ordering (Amharic)** | Voice-to-text order placement for low-literacy merchants |
| **WhatsApp Business Integration** | Order placement and payment confirmation via WhatsApp |
| **Merchant Score/Badge** | "Gold Buyer" or "Trusted Merchant" badge visible in app — gamifies repayment |
| **Bulk Order Template** | Save recurring orders for 1-tap reorder |
| **Loyalty Points** | Earn points on cash payments; redeem for credit fee discounts |

### 2.4 P3 — Future (Month 6+)

| Feature | Description |
|---------|-------------|
| **Business Analytics for Merchant** | Sales tracking, inventory suggestions, profit margins |
| **Peer Benchmarking** | "Similar merchants order 20% more this season" |
| **API for Merchant ERP** | Integration with merchant's own inventory/accounting systems |
| **Insurance Add-on** | Product insurance, delivery insurance options |

---

## 3. Admin Dashboard Requirements

### 3.1 P0 — Must Have (Launch)

| Feature | Description | Why Critical |
|---------|-------------|-------------|
| **Real-Time Portfolio Dashboard** | Total credit exposure, outstanding balances by segment (B2B/FMCG/SL), DSO, aging buckets | The #1 tool for the Credit Risk Lead. Must show the 45M ETB exposure growing in real time. |
| **Credit Approval Workflow** | Queue of pending credit applications → review → approve/reject with reason code → notify merchant | Centralized credit decisioning. Every credit extension must be traceable. |
| **Merchant Management** | KYC documents, credit limits, repayment history, risk flags, account status | Single view for account management from sales to collections. |
| **Order Management** | Order queue, fulfillment status, dispatch tracking, delivery confirmation | Operations team's primary tool. Must show order-age to prioritize. |
| **Collections Work Queue** | Overdue accounts prioritized by amount and days overdue, bulk actions, activity logging | Collections team's daily workspace. Must support field collectors' offline access. |
| **Revenue Tracking** | Revenue by stream (B2B/FMCG/SL), trend vs. plan, margin analysis | Finance Lead needs to track the 89.3M ETB revenue target progress. |
| **Alert System** | Configurable alerts: NPL spikes, large overdue accounts, credit exposure approaching caps | Proactive risk management — especially critical given the Super Leader credit jumps. |
| **Audit Trail** | Every credit decision, payment, adjustment, and limit change logged with user + timestamp | Compliance requirement and internal control mechanism. |

### 3.2 P1 — Should Have (Within 60 Days)

| Feature | Description |
|---------|-------------|
| **Segment Analytics** | Performance comparison: B2B vs. FMCG vs. Super Leader. Revenue, margin, default rates per segment |
| **Geographic Heat Map** | Credit risk and revenue density by sub-city/zone in Addis Ababa |
| **Merchant Risk Scoring Display** | Credit score with trend, risk band (Low/Medium/High/Rejected), factors affecting score |
| **Collection Performance Metrics** | Collector-level performance: recovery rate, accounts handled, average days to recover |
| **Revenue Forecast vs. Actuals** | Overlay actual revenue on projected curve (from financial plan). Show variance at each month |
| **Credit Limit Adjustment Log** | History of all limit changes with reason and authorizer |
| **Export & Reporting** | CSV/PDF exports of all dashboards; scheduled email reports to stakeholders |

### 3.3 P2 — Nice to Have (Within 120 Days)

| Feature | Description |
|---------|-------------|
| **Automated Scenario Modeling** | "What if B2B growth drops to 10% MoM?" / "What if NPL hits 6%?" |
| **Cohort Analysis** | Merchant cohorts by onboarding month, showing repayment behavior over time |
| **Staff Performance Dashboard** | Sales pipeline, collections efficiency, credit approval turnaround times |
| **Regulatory Reporting Module** | Generate reports aligned with National Bank of Ethiopia requirements |

---

## 4. Credit Scoring Engine Requirements

The credit scoring engine is the **most critical technical component** of this platform. With credit exposure growing from 31% to 63% of revenue, the accuracy of credit decisions directly determines profitability. At a 2.4% B2B credit margin, even small scoring errors are devastating.

### 4.1 Scoring Methodology

| Component | Weight | Description |
|-----------|--------|-------------|
| **Transaction History** | 30% | Volume, frequency, value of past purchases from ChipChip |
| **Repayment Behavior** | 25% | On-time rate, average days to pay, any defaults (once platform has data) |
| **Business Longevity** | 15% | Years in business — verified via trade license |
| **Market Reputation** | 10% | Peer references, market association membership |
| **Financial Capacity** | 10% | Stated revenue, bank statements (if available), mobile money transaction volume |
| **Market Sector Risk** | 10% | FMCG = lower risk, electronics = higher risk, perishables = medium risk |

### 4.2 Scoring Engine Features

| Feature | Priority | Description |
|---------|----------|-------------|
| **Automated Score Calculation** | P0 | Score from 100-850 using the above methodology. Output: credit limit recommendation |
| **Risk Band Classification** | P0 | Green (approve), Yellow (manual review), Red (reject/require collateral) |
| **Initial Score (Limited Data)** | P0 | When no platform history exists, use proxy data: business age, market reputation, initial order size, trade license verification |
| **Dynamic Score Updates** | P1 | Score updates after each repayment event. Real-time limit adjustments |
| **Segmented Scoring Models** | P1 | Separate models for B2B wholesalers, FMCG retailers, Super Leaders — each has different risk profiles |
| **Limit Recommendation Engine** | P1 | "Recommended limit: 45,000 ETB" based on score + segment rules |
| **Overriding & Manual Review Queue** | P0 | Human underwriter can override auto-decision with reason code |
| **Score Explanation Display** | P2 | Show merchants WHY they got their score (transparency — like FICO) |

### 4.3 Credit Limit Rules Engine

| Rule | Parameter | Rationale |
|------|-----------|-----------|
| **Max single limit** | 200,000 ETB | Cap exposure per merchant at pilot-safe levels |
| **Portfolio cap per segment** | B2B: 60%, FMCG: 25%, SL: 15% | Diversification rule — aligns with revenue targets |
| **Limit increase cadence** | Min 30 days between increases | Prevent abuse; observe 30 days of behavior |
| **Limit increase trigger** | ≥ 3 on-time repayments within limit | Evidence-based increases |
| **Limit decrease trigger** | ≥ 1 payment > 7 days overdue in last 30 days | Rapid response to risk |
| **Super Leader special rules** | Higher base limits required due to larger transaction sizes; stricter repayment monitoring due to 80% credit policy | Super Leaders carry more absolute exposure |
| **New merchant starting limit** | 10,000 – 30,000 ETB | Conservative start; increase based on behavior |

### 4.4 Data Sources for Scoring

| Source | Data Type | Availability in Ethiopia | Integration Complexity |
|--------|-----------|------------------------|----------------------|
| **ChipChip platform** | Transaction history, repayment behavior | Available once launched | Native — no integration needed |
| **Mobile money operators** | Telebirr/M-Pesa transaction volume | Requires partnership/API | Medium — NBE approval may be needed |
| **Trade registration** | Business age, legal status | Public records | Low — manual verification at launch |
| **Market association records** | Merchant standing, reputation | Federation of Ethiopian Chambers | Low — partnership needed |
| **Bank statement** | Financial capacity | Merchant-provided | Low — document upload + review |
| **Credit reference bureau** | Historical credit data | Commercial Bank of Ethiopia bureau — limited coverage | Medium — formal integration required |

> **Recommendation:** Start with internal platform data + manual verification. Integrate mobile money data as a Phase 2 priority. Bank credit bureau integration is Phase 3.

---

## 5. Collection Management System

### 5.1 Core Features

| Feature | Priority | Description |
|---------|----------|-------------|
| **Aging Buckets** | P0 | Current, 1-7 days, 8-15 days, 16-30 days, 31-60 days, 60+ days. Ethiopian standard payment terms are typically 30 days. |
| **Automated Reminder Workflow** | P0 | SMS → phone call → field visit → escalation. Configurable per segment. |
| **Collector Assignment** | P0 | Auto-assign overdue accounts to collectors by geography + workload balance |
| **Field Visit Logging** | P0 | Mobile field app: collector visits merchant, logs outcome (promised to pay, dispute, avoiding, closed) |
| **Promise-to-Pay Tracking** | P0 | Record merchant's payment promise date; track kept vs. broken |
| **Partial Payment Handling** | P0 | Record partial payments; adjust remaining balance; update aging |
| **Escalation Triggers** | P1 | Automatic escalation: 15 days → team lead; 30 days → collections lead + credit limit freeze; 60 days → legal |
| **Write-Off Workflow** | P1 | Formal write-off process with approval chain for accounts beyond recovery |
| **Collection Performance Dashboard** | P1 | Recovery rate, accounts aged by bucket, collector-level stats |
| **Legal Action Module** | P2 | Case management for accounts escalated to legal; document storage for legal proceedings |
| **Restructuring Module** | P2 | Payment plan creation for merchants struggling with original terms |

### 5.2 Collection Workflow (Ethiopian Context)

```
Payment Due
    │
    ├── T-7 days: SMS reminder (polite tone, Amharic)
    ├── T-3 days: SMS reminder + in-app notification
    ├── T-0 days: SMS + automated call (if voice service available)
    ├── T+1 day: Collector phone call
    ├── T+3 days: Second call + promise-to-pay recorded
    ├── T+7 days: Field visit scheduled (Addis: same-day; Regional: next-day)
    ├── T+15 days: Credit limit reduced by 50%
    ├── T+30 days: Credit frozen; account escalated to Collections Lead
    ├── T+45 days: Legal review initiated
    ├── T+60 days: Write-off consideration
    └── T+90 days: Write-off processed; merchant blacklisted
```

> **Ethiopian context note:** In Ethiopia, personal relationships matter more than legal processes. A merchant who is avoiding payment might pay immediately if a trusted sales rep calls. The collection system should enable **relationship-based recovery** before **process-based escalation.**

### 5.3 Offline Capability for Collections

| Requirement | Detail |
|-------------|--------|
| **Offline data sync** | Field collectors often work in areas with poor connectivity (Merkato alleys, informal markets). App must store data locally and sync when connectivity returns |
| **Offline payment logging** | Record cash payments made to collector; sync when online |
| **Offline merchant lookup** | Cached merchant list with key info (name, address, balance, last visit) |

---

## 6. Integration with Existing Systems

### 6.1 Required Integrations

| Integration | Type | Priority | Ethiopian Provider | Notes |
|-------------|------|----------|-------------------|-------|
| **Telebirr** | Payment | P0 | Ethio Telecom | Mandatory. Largest mobile money platform. API integration required |
| **CBE Birr** | Payment | P1 | Commercial Bank of Ethiopia | Second-largest. Required for bank-direct payment option |
| **M-Pesa Ethiopia** | Payment | P1 | Safaricom Ethiopia | Growing rapidly; essential for southern/Eastern Ethiopia |
| **SMS Gateway** | Communication | P0 | Ethio Telecom / local provider | Transactional SMS for OTPs, reminders, notifications. Bulk SMS for marketing |
| **Existing Supabase** | Data | P0 | Internal | ChipChip already uses Supabase — extend with credit tables, use Row Level Security |
| **ERP / Inventory System** | Data | P1 | Internal or 3rd-party | Sync order data, product catalog, inventory levels |
| **Ethiopian Revenue Authority** | Compliance | P2 | ERCA | Tax invoice generation and reporting |
| **National Bank Credit Bureau** | Data | P3 | NBE | Historical credit data — long-term strategic integration |

### 6.2 Integration Architecture Principles

| Principle | Detail |
|-----------|--------|
| **API-first** | All internal services communicate via APIs; easy to swap components |
| **Event-driven** | Key events (order placed, payment made, credit issued) published as events for async processing |
| **Retry with backoff** | Third-party APIs in Ethiopia can be unreliable; automatic retry with exponential backoff |
| **Idempotent operations** | Payments and orders must be idempotent — duplicate requests should not create double transactions |
| **Data localization** | All data stored in-country (Ethiopian data sovereignty considerations). Consider local cloud or on-premise |

---

## 7. Security & Compliance

| Requirement | Detail | Priority |
|-------------|--------|----------|
| **Data encryption at rest** | All PII, financial data encrypted (AES-256) | P0 |
| **TLS 1.3 for all communications** | API, web, mobile — no exceptions | P0 |
| **Role-based access control (RBAC)** | Granular permissions: sales ≠ credit ≠ collections ≠ finance | P0 |
| **Multi-factor authentication** | For admin dashboard users; OTP for merchant app login | P0 |
| **PCI-DSS compliance** | For payment card processing (if applicable) | P1 |
| **Audit logging** | Every action logged — who, what, when, outcome | P0 |
| **Data retention policy** | Define what to keep and for how long; Ethiopian legal requirements | P1 |
| **Vulnerability scanning** | Quarterly security audits | P2 |
| **Disaster recovery** | RPO < 24 hours, RTO < 4 hours | P1 |

| Requirement | Detail | Priority |
|-------------|--------|----------|
| **NBE compliance review** | Before launch, legal review of all credit terms, interest rates, and collection practices | P0 |
| **Transparent terms** | All credit fees, repayment terms, penalties displayed in Amharic before acceptance | P0 |
| **Complaint mechanism** | In-app dispute filing with SLA for resolution | P1 |
| **Data privacy notice** | Ethiopian data protection compliance (as applicable) | P1 |

---

## 8. Phased Technology Rollout Plan

### Phase 0: Foundation (Mar 2026 — Pre-Launch)

| Deliverable | Owner | Success Criteria |
|-------------|-------|-----------------|
| Supabase schema for credit transactions | Tech Lead | All tables designed, RLS policies set |
| Merchant registration + KYC flow | Mobile Dev | Merchant can register and submit documents |
| Admin user authentication | Backend Dev | Secure login for all admin roles |
| Telebirr sandbox integration | Backend Dev | Test payments working in sandbox |
| SMS gateway integration | Backend Dev | OTP and transactional SMS working |

### Phase 1: MVP Launch (Apr 2026 — Weeks 1-4)

| Deliverable | Owner | Success Criteria |
|-------------|-------|-----------------|
| Credit limit display in merchant app | Mobile Dev | Merchants see their credit limit and available balance |
| Order with credit option | Backend Dev | "Pay with Credit" option in checkout flow |
| Credit approval workflow (admin) | Backend Dev | Credit applications queue, approve/reject actions |
| Basic collections dashboard | Backend Dev | View overdue accounts, aging buckets |
| Automated SMS reminders | Backend Dev | 7-day, 3-day, 1-day, due-day SMS sent |
| Daily portfolio snapshot | Backend Dev | Email report of total exposure and collections to leadership |
| Scoring engine V1 (rules-based) | Credit Risk Lead + Tech | Auto-score new applications based on manual scoring rules |

### Phase 2: Pilot Stabilization (May-Jun 2026 — Weeks 5-12)

| Deliverable | Owner | Success Criteria |
|-------------|-------|-----------------|
| Scoring engine V2 (data-driven) | Tech + Credit | Score updated after each repayment using 30-day pilot data |
| Dynamic credit limit adjustments | Backend Dev | Auto-adjust limits based on scoring engine output |
| Field collection mobile app | Mobile Dev | Collectors can log visits and payments offline |
| Merchant referral program | Mobile Dev | In-app referral with tracking |
| Dispute management module | Backend Dev + Mobile Dev | Merchants can report disputes with photos |
| Geographic risk heat map | Backend Dev | Admin dashboard map view of credit exposure and defaults |
| Export & reporting | Backend Dev | CSV/PDF exports for all major dashboards |

### Phase 3: Scale Prep (Jul-Sep 2026 — Months 4-6)

| Deliverable | Owner | Success Criteria |
|-------------|-------|-----------------|
| CBE Birr integration | Backend Dev | Second payment channel live |
| M-Pesa Ethiopia integration | Backend Dev | Third payment channel live |
| Multi-user merchant accounts | Backend Dev | Business owner can add staff with restricted access |
| USSD fallback interface | Backend Dev | Basic order + balance inquiry via USSD |
| Automated scenario modeling | Tech Lead | "What-if" analysis tool in admin dashboard |
| Oromiffa language support | Mobile Dev | Full app localization in Oromiffa |
| Regulatory reporting module | Backend Dev | NBE-compliant reports generated automatically |
| Cohort analysis dashboard | Backend Dev | Merchant behavior trends by onboarding cohort |

### Phase 4: Advanced Features (Oct 2026 – Apr 2027 — Months 7-13)

| Deliverable | Owner | Success Criteria |
|---------|-------|
| ML-based credit scoring | Tech Lead + Data Analyst | Score prediction accuracy validated against actual defaults |
| Business analytics for merchants | Mobile Dev | Merchant-facing sales/inventory insights |
| WhatsApp Business integration | Backend Dev | Order placement and payment via WhatsApp |
| Voice ordering (Amharic) | Mobile Dev | Voice-to-text order input |
| Legal action case management | Backend Dev | Escalated accounts tracked through legal process |
| API for merchant ERP integration | Backend Dev | External merchants can integrate their systems |
| Insurance add-on module | Backend Dev | Product/delivery insurance options |

---

## 9. Priority Matrix (P0-P3)

### P0 — Must Have (Launch Critical)

| Feature | Effort | Impact | Rationale |
|---------|:---:|:---:|-----------|
| Merchant registration + KYC | Medium | 🔴 | No account = no business |
| Credit limit display | Low | 🔴 | Foundation of all credit decisions |
| Order placement (cash + credit) | High | 🔴 | Core revenue-generating flow |
| Credit approval workflow | Medium | 🔴 | Every credit must be traceably approved |
| Collections work queue | Medium | 🔴 | 45M ETB at risk without collection tracking |
| Aging buckets dashboard | Low | 🔴 | Primary risk visibility tool |
| Automated SMS reminders | Low | 🔴 | Reduces collections workload 50%+ |
| Telebirr payment integration | High | 🔴 | Primary payment channel in Ethiopia |
| Supabase schema for credit data | Medium | 🔴 | Data foundation for everything |
| Basic credit scoring V1 (rules-based) | High | 🔴 | Without this, credit decisions are manual and inconsistent |
| RBAC + audit logging | Medium | 🔴 | Internal control and compliance |
| Daily portfolio dashboard | Low | 🟠 | Leadership visibility into risk |

### P1 — Should Have (30-60 Days Post-Launch)

| Feature | Effort | Impact | Rationale |
|---------|:---:|:---:|-----------|
| Dynamic credit limit updates | Medium | 🔴 | Scale credit decisions without manual overhead |
| Scoring engine V2 (data-driven) | High | 🔴 | Improve accuracy using real repayment data |
| Field collection mobile app | High | 🟠 | Enable efficient field collections |
| CBE Birr + M-Pesa integrations | High | 🟠 | Expand payment options for all merchants |
| Dispute management | Medium | 🟠 | Reduce collection friction |
| Referral program | Medium | 🟠 | Low-cost acquisition |
| Revenue forecast vs. actuals | Low | 🟠 | Track against the 89.3M ETB target |
| Multi-user merchant accounts | Medium | 🟡 | Needed for B2B/Super Leader accounts |
| Export & reporting | Low | 🟡 | Operational necessity |
| Oromiffa language support | Medium | 🟡 | Regional expansion readiness |
| Geographical risk heat map | Medium | 🟡 | Risk visualization |
| USSD fallback | High | 🟡 | Reach non-smartphone merchants |

### P2 — Nice to Have (60-120 Days Post-Launch)

| Feature | Effort | Impact | Rationale |
|---------|:---:|:---:|-----------|
| Automated scenario modeling | High | 🟡 | Strategic planning tool |
| Cohort analysis | Medium | 🟡 | Understand merchant behavior over time |
| Staff performance dashboard | Low | 🟡 | Operational management |
| Regulatory reporting module | Medium | 🟡 | NBE compliance automation |
| Voice ordering | High | 🟢 | Accessibility for low-literacy merchants |
| WhatsApp Business integration | Medium | 🟡 | Meet merchants where they already communicate |
| Loyalty points program | Medium | 🟡 | Retention and cash payment incentives |
| Dispute resolution | Medium | 🟡 | Reduce collection cycle time |
| Restructuring module | Medium | 🟡 | Handle genuine hardship cases |

### P3 — Future (Month 6+)

| Feature | Effort | Impact | Rationale |
|---------|:---:|:---:|-----------|
| ML-based credit scoring | High | 🟡 | Long-term accuracy improvement |
| Merchant business analytics | High | 🟢 | Value-add feature for merchant retention |
| Peer benchmarking | Medium | 🟢 | Engagement gamification |
| API for merchant ERP | High | 🟢 | Deep integration with large B2B accounts |
| Legal action case management | Low | 🟡 | Formal collection process for worst cases |
| Insurance add-on | High | 🟢 | Additional revenue stream |
| NBE Credit Bureau integration | Medium | 🟡 | External credit data — depends on bureau availability |

---

## 10. Ethiopian Market Considerations (Embedded Throughout)

| Consideration | Impact on Design |
|---------------|-----------------|
| **Connectivity** | Intermittent network in Addis; virtually none in some markets | → Offline-first architecture, SMS fallback, local data caching |
| **Device landscape** | Low-end Android phones dominate; iPhones are < 2% | → Lightweight Android app (max 15MB); no iOS required initially |
| **Payment culture** | Cash is still king; mobile money growing rapidly | → Telebirr/CBE Birr/M-Pesa integration from Day 1; cash payment logging |
| **Language** | Amharic primary, Oromiffa for eastern expansion, English for business | → Amharic localization mandatory; Oromiffa Phase 3; English always available |
| **Trust dynamics** | Business relationships based on personal trust, not digital systems | → Human touchpoints (phone calls, field visits) essential alongside digital tools |
| **Informal economy** | Many merchants operate without formal registration | → Flexible KYC: accept Kebele ID + trade references when trade license unavailable |
| **Seasonal patterns** | Fasting seasons (Abbay, Genna, Timkat) and holidays affect purchasing | → System should flag and factor in Ethiopian calendar seasonality |
| **Regulatory environment** | NBE oversight of credit provision, evolving fintech regulations | → Legal review of all features; build compliance by design |

---

## 11. Technology Stack Recommendation

| Layer | Recommended | Alternatives | Rationale |
|-------|-------------|-------------|-----------|
| **Mobile App** | React Native or Flutter | Native Android (Kotlin) | Cross-platform for future; Flutter slightly better performance on low-end devices |
| **Backend** | Node.js + Express or Python FastAPI | Django, Go | Node.js aligns with existing Supabase ecosystem |
| **Database** | Supabase (PostgreSQL) | PostgreSQL standalone | Already in use; Row Level Security is perfect for multi-tenant credit data |
| **Authentication** | Supabase Auth | Firebase Auth | Already integrated |
| **SMS** | Ethio Telecom SMS API | Africa's Talking (Ethiopia) | Direct integration preferred for reliability |
| **Hosting** | Local Ethiopian hosting provider or AWS (Africa Cape Town) | DigitalOcean, Render | Data sovereignty and latency considerations |
| **Analytics** | Metabase or custom dashboards | Redash, Superset | Open-source, PostgreSQL-native |
| **Monitoring** | Sentry + self-hosted Uptime Kuma | Datadog | Cost-effective; Sentry catches errors, Uptime Kuma monitors availability |

---

## 12. Summary & Key Recommendations

1. **Start with a ruthless MVP.** Launch with P0 features only. Every P1/P2 feature adds weeks; the business cannot wait.
2. **Build the credit scoring engine first.** Everything else depends on knowing who to extend credit to and for how much. This is not negotiable — it's the foundation of the 45M ETB credit model.
3. **Invest heavily in the collections app for field staff.** The platform will have 45M ETB in credits — recovering them is as important as issuing them. Field collectors need a mobile tool that works offline.
4. **Telebirr integration is P0, not optional.** Ethiopian mobile money is not a feature — it's the payment infrastructure. Skip it and you lose 70% of your merchant base.
5. **Design for offline first.** Intermittent connectivity in Ethiopian markets is a fact of life, not a bug.
6. **Plan Super Leader credit policy changes in the system.** When credit rates jump from 20% → 40% → 80%, the system should automatically flag higher-risk approvals and tighten collection reminders.
7. **Budget for 6 months of iterative development.** The platform is never "done" — it evolves with repayment data, regulatory changes, and merchant feedback.

---

*Prepared by Nova, Business Analyst. Based on ChipChip Credit Financial Plan Analysis (Apr 2026 – Apr 2027).*
