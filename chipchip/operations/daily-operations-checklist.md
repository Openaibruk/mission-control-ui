# Daily Operations Checklist

**Document ID:** CHIP-OPS-003
**Version:** 1.0
**Effective Date:** 2026-03-16
**Owner:** Operations Manager
**Review Cycle:** Monthly

---

## Morning Opening (7:00 AM - 9:00 AM)

### System & Platform Health
- [ ] Verify platform uptime and response times (check monitoring dashboard)
- [ ] Confirm overnight order batch processed successfully
- [ ] Check for any system alerts or error logs from overnight
- [ ] Verify payment gateway is operational (run $0.01 test transaction)
- [ ] Confirm push notification and email services are running

### Orders & Fulfillment
- [ ] Review all pending orders from overnight — prioritize by delivery window
- [ ] Verify supplier readiness confirmations received for today's batches
- [ ] Flag any unconfirmed supplier orders — escalate per SLA (2-hour rule)
- [ ] Check inventory levels vs. open order quantities — alert Ops Coordinator of potential stock-outs
- [ ] Review special delivery instructions and route to drivers

### Customer Service
- [ ] Check open support tickets — clear any overnight backlog
- [ ] Review customer complaints from previous day — ensure all SLA-compliant responses
- [ ] Verify refund/credit requests are in queue for Finance processing
- [ ] Check social media mentions and direct messages for urgent issues

## Midday Check-In (12:00 PM - 1:00 PM)

### Delivery Status
- [ ] Review morning delivery completion rate — target: >95%
- [ ] Check for any failed deliveries — coordinate re-delivery attempts
- [ ] Verify afternoon delivery routes are loaded and drivers confirmed
- [ ] Monitor real-time delivery tracker for delays

### Supplier Coordination
- [ ] Confirm afternoon pickup slots with suppliers
- [ ] Follow up on any partial fulfillment issues from morning
- [ ] Check supplier dashboard for new product submissions awaiting review

### Group Order Management
- [ ] Monitor active group orders — track progress toward quantity thresholds
- [ ] Send reminder notifications to group order hosts for orders closing today
- [ ] Verify group pricing tiers are calculating correctly

## End of Day (5:00 PM - 7:00 PM)

### Order Summary
- [ ] Generate daily order report: total orders, revenue, average order value
- [ ] Compile delivery success rate for the day
- [ ] Document any order issues or exceptions in the daily log
- [ ] Confirm tomorrow's batch orders are queued and supplier notifications scheduled

### Financial Reconciliation
- [ ] Verify daily payment captures match delivered orders
- [ ] Log any payment failures or disputes
- [ ] Confirm refund batch is queued for processing

### Customer Feedback
- [ ] Review end-of-day satisfaction survey results
- [ ] Flag any 1-2 star ratings for immediate follow-up
- [ ] Compile positive testimonials for marketing team

### Platform & Security
- [ ] Verify end-of-day database backup completed
- [ ] Review access logs for any unusual activity
- [ ] Confirm all team member sessions are properly closed on shared terminals

## Weekly Tasks (Every Friday)

- [ ] Compile weekly KPI summary and share with leadership
- [ ] Review supplier performance scores — flag underperformers
- [ ] Update delivery zone coverage based on demand patterns
- [ ] Team standup: discuss blockers, celebrate wins, plan next week
- [ ] Review and archive completed group orders

## Escalation Contacts

| Issue Type | Contact | Phone/Channel |
|-----------|---------|---------------|
| Platform down | Engineering On-Call | Slack #engineering-urgent |
| Supplier emergency | Supplier Relations Manager | Direct line |
| Delivery crisis | Logistics Manager | Slack #logistics |
| Customer safety issue | Operations Manager | Direct line |
| Payment system failure | Finance Lead | Slack #finance |

---

*This checklist should be completed daily by the on-duty Operations Coordinator and reviewed by the Operations Manager at end of week.*
