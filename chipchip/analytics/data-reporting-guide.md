# Data Analytics & Reporting Guide

**Document ID:** CHIP-ANL-002
**Version:** 1.0
**Effective Date:** 2026-03-16
**Owner:** Analytics Team
**Review Cycle:** Quarterly

---

## 1. Purpose

To establish a single source of truth for how ChipChip collects, processes, and reports business data — ensuring every team makes decisions from the same reliable numbers.

## 2. Data Architecture Overview

### Data Sources

| Source | Data Type | Frequency | Owner |
|--------|-----------|-----------|-------|
| App/Platform Database | Orders, customers, products, sessions | Real-time | Engineering |
| Payment Gateway | Transactions, refunds, chargebacks | Real-time | Finance |
| Customer Service Platform | Tickets, CSAT, resolution times | Real-time | Customer Success |
| Marketing Platforms | Campaigns, spend, impressions, clicks | Daily sync | Marketing |
| Supplier Portal | Inventory, fulfillment, quality scores | Daily sync | Operations |
| Delivery/Logistics | Routes, delivery times, success rates | Real-time | Operations |
| Analytics Tools | Web/app behavior, funnels, cohorts | Real-time | Analytics |

### Key Data Tables

| Table | Description | Key Fields |
|-------|-------------|-----------|
| `orders` | All order records | order_id, customer_id, status, total, created_at, delivered_at |
| `order_items` | Line items per order | order_id, product_id, quantity, unit_price, supplier_id |
| `customers` | Customer profiles | customer_id, signup_date, tier, ltv, last_order_date |
| `products` | Product catalog | product_id, name, category, supplier_id, price, status |
| `suppliers` | Supplier records | supplier_id, name, status, quality_score, onboarding_date |
| `deliveries` | Delivery tracking | delivery_id, order_id, driver_id, status, timestamps |
| `refunds` | Refund records | refund_id, order_id, amount, reason, approved_by |

## 3. Core KPIs & Definitions

### Revenue KPIs

| KPI | Definition | Formula |
|-----|-----------|---------|
| Gross Revenue | Total value of all orders placed | SUM(order.total) |
| Net Revenue | Revenue after refunds | Gross Revenue - SUM(refund.amount) |
| Gross Margin | (Revenue - COGS) / Revenue | (Net Revenue - COGS) / Net Revenue |
| Average Order Value (AOV) | Average revenue per order | Net Revenue / COUNT(orders) |
| Revenue per Customer | Average revenue generated per active customer | Net Revenue / COUNT(active customers) |

### Customer KPIs

| KPI | Definition | Formula |
|-----|-----------|---------|
| New Customers | First-time purchasers in period | COUNT(customers WHERE first_order_date IN period) |
| Active Customers | Customers with ≥1 order in period | COUNT(customers WHERE last_order_date IN period) |
| Retention Rate (period) | % of previous period's customers who ordered again | Customers active in both periods / Customers active in previous period |
| Churn Rate | 1 - Retention Rate | — |
| Customer Lifetime Value (LTV) | Predicted total revenue from a customer | AOV × Avg Orders per Year × Avg Customer Lifespan |
| Customer Acquisition Cost (CAC) | Cost to acquire one new customer | Total Marketing Spend / New Customers |
| LTV:CAC Ratio | Unit economics health indicator | LTV / CAC (target: >3:1) |

### Operational KPIs

| KPI | Definition | Formula |
|-----|-----------|---------|
| Order Fulfillment Rate | % of orders successfully delivered | Delivered Orders / Total Orders |
| Delivery On-Time Rate | % of deliveries within promised window | On-time Deliveries / Total Deliveries |
| Order Accuracy | % of orders with correct items and quantities | Accurate Orders / Total Orders |
| Supplier Fulfillment Rate | % of supplier orders fulfilled completely | Fulfilled Batches / Total Batches |
| Quality Pass Rate | % of items passing QA inspection | Passed Items / Inspected Items |

### Marketing KPIs

| KPI | Definition | Formula |
|-----|-----------|---------|
| Conversion Rate | % of visitors who place an order | Orders / Unique Visitors |
| Cost per Acquisition (CPA) | Cost to acquire one customer via paid channels | Channel Spend / Channel Conversions |
| Return on Ad Spend (ROAS) | Revenue generated per $1 of ad spend | Attributed Revenue / Ad Spend |
| Referral Rate | % of new customers from referrals | Referred New Customers / Total New Customers |
| Email Open Rate | % of emails opened | Opens / Delivered |
| Push Notification CTR | % of push notifications tapped | Taps / Delivered |

## 4. Dashboards

### Executive Dashboard (Real-Time)
- Today's revenue and orders (vs. same day last week)
- Live order map
- Active customer count
- Platform health (uptime, latency)
- Alert status

### Operations Dashboard (Real-Time)
- Orders in queue, processing, in-transit, delivered
- Delivery map with driver locations
- Supplier readiness status
- CS ticket queue depth
- Inventory alerts

### Marketing Dashboard (Daily)
- Channel performance (spend, impressions, clicks, conversions)
- Funnel metrics (visit → signup → first order → repeat)
- Campaign ROI
- Content performance
- Attribution breakdown

### Finance Dashboard (Daily + Monthly)
- Revenue trends (daily, weekly, monthly)
- P&L summary
- Refund and chargeback tracking
- Cash flow forecast
- Unit economics (AOV, LTV, CAC, margins)

### Supplier Dashboard (Weekly)
- Supplier quality scores and rankings
- Fulfillment rates
- Top-performing and underperforming suppliers
- Product category performance

## 5. Reporting Cadence

| Report | Frequency | Audience | Owner | Due |
|--------|-----------|----------|-------|-----|
| Daily Flash Report | Daily | Leadership | Analytics | 9 AM |
| Weekly Business Review | Weekly | All department heads | Operations | Monday 10 AM |
| Marketing Performance | Weekly | Marketing team | Marketing Lead | Tuesday |
| Financial Summary | Monthly | Leadership + Board | Finance Lead | 5th of month |
| Supplier Scorecard | Monthly | Ops + Supplier Relations | QA Lead | 1st of month |
| Customer Health Report | Monthly | CS + Marketing | CS Manager | 10th of month |
| Quarterly Business Review | Quarterly | Board + Investors | CEO/CFO | End of quarter |

## 6. Data Quality Standards

### Principles
1. **Single source of truth:** One system of record per data type. No conflicting numbers.
2. **Timeliness:** Data should be available within its defined SLA (real-time, daily, etc.).
3. **Accuracy:** All reports should be reproducible — same inputs yield same outputs.
4. **Completeness:** Missing data should be flagged, not hidden.

### Data Governance
- **Data Owner:** The team responsible for the accuracy of a data domain.
- **Data Steward:** The individual who maintains data quality day-to-day.
- **Access Control:** Role-based access. Customer PII is restricted to CS and authorized personnel.
- **Retention:** Raw data retained for 3 years. Aggregated reports retained indefinitely.

### Quality Checks (Automated)
- Daily: Null check on critical fields (order_id, customer_id, total)
- Daily: Duplicate detection on order records
- Weekly: Reconciliation between payment processor and internal records
- Monthly: Data completeness audit across all source systems

## 7. Tools & Access

| Tool | Purpose | Access Level |
|------|---------|-------------|
| Primary Database | Raw data storage | Engineering only |
| BI Tool (e.g., Metabase/Looker) | Dashboards and ad-hoc queries | All team leads |
| Spreadsheet (Google Sheets) | Quick analysis, shared reports | All team members |
| Analytics (e.g., Mixpanel/Amplitude) | Product and user behavior | Product + Marketing |
| Payment Dashboard | Transaction details | Finance + authorized |
| CS Platform | Customer interactions | CS team + Management |

### Requesting New Reports
1. Submit request via [internal form/Slack channel].
2. Include: what data you need, why, frequency, audience.
3. Analytics team evaluates and provides timeline.
4. Standard turnaround: 3 business days for simple, 2 weeks for complex.

## 8. Privacy & Compliance

- All customer data handling must comply with applicable data protection regulations.
- PII (names, emails, phone numbers, addresses) must be anonymized in analytical datasets used for reporting.
- No customer data should be exported to personal devices or unauthorized tools.
- Data access is logged and auditable.
- Breach of data policy is grounds for immediate escalation.

---

*Data is only valuable if it drives action. Every report should have a "so what?" — a recommended action based on the numbers.*
