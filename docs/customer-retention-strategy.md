# Customer Retention Strategy — Implementation Guide

**Company:** ChipChip  
**Version:** 1.0  
**Date:** 2026-03-24  
**Owner:** Growth & Operations Team

---

## Objective

Reduce churn, increase repeat order rate, and build customer lifetime value through three pillars: **Loyalty Program**, **Win-Back Flows**, and **NPS Tracking**.

---

## Pillar 1: Loyalty Program

### Structure: "ChipChip Rewards"

| Tier | Orders/Month | Benefits |
|------|-------------|----------|
| **Member** | 0–2 | Base pricing, standard delivery |
| **Regular** | 3–7 | 5% discount on orders ≥ 500 Birr, priority delivery window |
| **Super Leader** | 8+ | Free pickup delivery, 8% discount, early access to new products, dedicated support line |

### Implementation Tasks
- [ ] Define point system: 1 point per 100 Birr spent
- [ ] Build loyalty tier logic in backend (Supabase function)
- [ ] Add loyalty badge + points display to customer app/profile
- [ ] Create automated tier upgrade/downgrade (monthly cycle)
- [ ] Design reward redemption flow (points → discount codes)
- [ ] Launch comms: SMS blast + in-app banner

### Metrics
- Repeat order rate (target: 40% within 30 days)
- Avg. orders/month per customer (target: 3.5)
- Tier distribution (target: 20% Regular, 5% Super Leader)

---

## Pillar 2: Win-Back Flows

### Trigger: Customer inactive for 14+ days

### Flow Sequence

| Day | Channel | Message |
|-----|---------|---------|
| Day 14 | SMS | "We miss you! Here's 10% off your next order. Use code: COMEBACK10" |
| Day 21 | SMS | "Your favorites are waiting 🧡 Order now and get free delivery!" |
| Day 30 | Phone call (ops team) | Personal check-in: "Any issues? We'd love to have you back." |
| Day 45 | Final SMS | "Last chance: 15% off expires in 48 hours. Code: LASTCHANCE15" |
| Day 60 | Archive | Move to dormant segment, exclude from active campaigns |

### Implementation Tasks
- [ ] Build inactivity detection query (Supabase: last_order_date > 14 days)
- [ ] Create SMS templates (Amharic + English)
- [ ] Set up automated trigger via Supabase Edge Function (cron: daily)
- [ ] Create discount codes in promo system
- [ ] Train ops team on Day 30 call script
- [ ] Build dormant segment for analytics

### Metrics
- Win-back rate (target: 15% reactivation within 30 days)
- Revenue recovered per month
- Cost per win-back (discount + ops time)

---

## Pillar 3: NPS Tracking

### Survey Design

**Core question:** "On a scale of 0–10, how likely are you to recommend ChipChip to a friend?"

**Follow-up (conditional):**
- Promoters (9–10): "What do you love most about ChipChip?"
- Passives (7–8): "What could we improve?"
- Detractors (0–6): "We're sorry! What went wrong?"

### Distribution
- **When:** After every 5th order (avoids survey fatigue)
- **Channel:** In-app popup + SMS fallback
- **Language:** Auto-detect (Amharic/English)

### Implementation Tasks
- [ ] Create NPS survey (Google Forms or in-app modal)
- [ ] Build trigger: order_count % 5 === 0 → show survey
- [ ] Create Supabase table: `nps_responses` (customer_id, score, comment, created_at)
- [ ] Build NPS dashboard widget in Mission Control
- [ ] Set up alerting: detractor score → notify ops lead immediately
- [ ] Monthly NPS review meeting cadence

### Metrics
- NPS score (target: +40 within 6 months)
- Response rate (target: 25%)
- Detractor resolution rate (target: 80% contacted within 48 hrs)

---

## Implementation Timeline

| Week | Focus |
|------|-------|
| Week 1 | Loyalty program backend + tier logic |
| Week 2 | Win-back flow automation + SMS templates |
| Week 3 | NPS survey creation + dashboard widget |
| Week 4 | Testing, soft launch, team training |

---

## Success Criteria (90-day review)

- Repeat order rate ≥ 35%
- Win-back reactivation ≥ 12%
- NPS score ≥ +30
- Zero negative feedback about loyalty program UX

---

*Review and iterate monthly based on data.*
