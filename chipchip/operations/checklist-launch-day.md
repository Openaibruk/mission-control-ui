# Launch Day Checklist

**Document ID:** CHIP-OPS-005
**Version:** 1.0
**Effective Date:** 2026-03-16
**Owner:** Operations Manager
**Review Cycle:** Per launch event

---

*Use this checklist for new city launches, major feature rollouts, or large-scale promotional campaigns.*

## T-7 Days: Pre-Launch Preparation

### Infrastructure
- [ ] Load testing completed — verify platform handles 3x expected peak traffic
- [ ] CDN and caching configured and tested
- [ ] Database backups verified and auto-backup schedule confirmed
- [ ] Monitoring dashboards configured (uptime, latency, error rates, order volume)
- [ ] Alerting rules set for critical thresholds
- [ ] Rollback plan documented and tested

### Supply Chain
- [ ] Supplier inventory confirmed for all launch SKUs
- [ ] Buffer stock arranged (+20% above projected demand)
- [ ] Delivery routes planned and logistics partner briefed
- [ ] Packaging materials stocked (bags, boxes, cold packs)
- [ ] Backup suppliers identified for top 10 products

### Customer Operations
- [ ] Customer service team briefed on launch — FAQ document prepared
- [ ] Extra CS agents scheduled for launch day (+50% staffing)
- [ ] Escalation paths defined and communicated
- [ ] Refund/credit pre-approval limits set for launch day (temporary increase)
- [ ] Social media monitoring setup for launch-related mentions

### Marketing
- [ ] Launch campaign creatives approved and scheduled
- [ ] Email blast queued for launch morning
- [ ] Push notification schedule confirmed
- [ ] Social media posts scheduled across all channels
- [ ] Influencer/content creator posts confirmed and timed
- [ ] Press release distributed (if applicable)
- [ ] Referral/launch promo codes generated and tested

### Legal & Compliance
- [ ] Terms of service updated (if needed for new market/feature)
- [ ] Privacy policy current
- [ ] Promotional terms clearly stated (discount limits, expiry, eligibility)
- [ ] Data protection measures verified (especially for new customer data)

## T-1 Day: Final Checks

### Technical
- [ ] Final deployment to production — all features behind feature flags
- [ ] Smoke test all critical paths: signup → browse → add to cart → checkout → order confirmation
- [ ] Payment processing test with live payment gateway (small real transaction)
- [ ] Email and push notification delivery test
- [ ] Mobile app update live on App Store and Play Store
- [ ] Landing page and campaign URLs verified

### Operations
- [ ] All-hands team briefing — roles, responsibilities, communication channels
- [ ] War room / incident channel set up (Slack #launch-ops)
- [ ] On-call rotation confirmed for Engineering, Ops, CS
- [ ] Print/post launch day run-of-show schedule for all team leads
- [ ] Emergency contact list distributed to all team members

### Supply Chain
- [ ] Supplier readiness confirmed — all green in supplier dashboard
- [ ] Logistics partner final confirmation — drivers and vehicles secured
- [ ] Hub operations team briefed on expected volumes

## T-Day: Launch Day

### Morning (6:00 AM - 9:00 AM)
- [ ] Final go/no-go decision at 6:00 AM (CTO + Ops Manager + Marketing Lead)
- [ ] If GO: Enable feature flags, activate launch campaign
- [ ] If NO-GO: Execute rollback plan, communicate delay to stakeholders
- [ ] Monitor order flow — first 30 minutes are critical
- [ ] Verify push notifications and emails are delivering
- [ ] Check social media for early reactions — respond to questions
- [ ] Confirm supplier dashboard is processing orders correctly

### Mid-Morning (9:00 AM - 12:00 PM)
- [ ] Review order volume vs. projections — are we on track?
- [ ] Check platform performance metrics — latency, error rate, uptime
- [ ] Monitor customer service queue — are wait times acceptable?
- [ ] Social media pulse check — sentiment, common questions, issues
- [ ] Brief leadership on morning status (Slack update or quick call)

### Afternoon (12:00 PM - 5:00 PM)
- [ ] First delivery wave status — completion rate, any issues?
- [ ] Review customer complaints — any emerging patterns?
- [ ] Marketing campaign performance check — CTR, conversions, spend
- [ ] Inventory check — any SKUs running low?
- [ ] Afternoon status update to leadership

### Evening (5:00 PM - 9:00 PM)
- [ ] Final delivery wave monitoring
- [ ] Compile end-of-day metrics:
  - Total orders placed
  - Total revenue
  - New customer signups
  - Average order value
  - Delivery success rate
  - Customer satisfaction score
  - Platform uptime %
  - CS tickets opened / resolved
- [ ] Team debrief — what went well, what didn't, immediate fixes needed
- [ ] Communication to all-hands: thank you + day 1 results
- [ ] Plan next-day follow-ups and any outstanding issues

## T+1 Day: Post-Launch Review

- [ ] Process any remaining refunds/credits from launch day issues
- [ ] Send follow-up emails to new customers (welcome + onboarding)
- [ ] Debrief meeting with all team leads (30 min)
- [ ] Document lessons learned
- [ ] Update this checklist based on what you learned
- [ ] Send investor/stakeholder launch report (if applicable)

## T+7 Days: Week One Review

- [ ] Compile week-one KPIs vs. projections
- [ ] Customer retention analysis — how many Day-0 customers reordered?
- [ ] Supplier performance review — any issues or bottlenecks?
- [ ] Logistics performance — delivery times, success rates
- [ ] Marketing ROI analysis — cost per acquisition, channel performance
- [ ] Prepare and share Week 1 Launch Report
- [ ] Set 30-day review meeting

---

## Emergency Scenarios & Playbooks

### Scenario 1: Platform Crash
1. Engineering on-call immediately investigates.
2. If recoverable in <30 min: pause marketing campaigns, show "maintenance" page.
3. If >30 min: activate backup landing page, redirect marketing to email capture.
4. Communicate to customers via social media: "We're experiencing high demand — we'll be back shortly!"
5. Post-incident: full post-mortem within 48 hours.

### Scenario 2: Supplier Can't Fulfill
1. Identify affected orders and customers.
2. Source from backup supplier or similar product.
3. If no substitute: contact affected customers with apology + credit + expected restock date.
4. Update platform to show out-of-stock.

### Scenario 3: Delivery Overwhelm
1. Activate backup logistics partners.
2. Extend delivery windows and notify customers proactively.
3. Prioritize by: customer tier (VIP first), order age, perishability.
4. If extreme: pause new orders temporarily, show "delivery slots full" message.

### Scenario 4: Payment System Failure
1. Engineering + Finance immediately engaged.
2. If partial: route to backup payment processor.
3. If complete: enable "pay on delivery" for existing customers, pause new customer checkouts.
4. Queue failed transactions for retry once system is restored.

---

*After every launch, update this document. The best checklist is the one that survived your last launch.*
