# Standard Operating Procedure: Order Processing & Fulfillment

**Document ID:** CHIP-OPS-001
**Version:** 1.0
**Effective Date:** 2026-03-16
**Owner:** Operations Team
**Review Cycle:** Quarterly

---

## 1. Purpose

This SOP defines the end-to-end process for receiving, processing, and fulfilling customer orders on the ChipChip platform, ensuring consistency, accuracy, and timely delivery.

## 2. Scope

Applies to all orders placed through ChipChip's web and mobile platforms, including group orders, individual orders, and subscription orders.

## 3. Definitions

| Term | Definition |
|------|-----------|
| Group Order | An order where multiple customers collectively purchase to unlock bulk pricing |
| Order Window | The time period during which customers can join a group order |
| Batch Order | A consolidated order from a single group buy session |
| Cut-off Time | The deadline after which no new items/quantities can be added to a batch |

## 4. Procedure

### 4.1 Order Receipt

1. System captures the order and sends confirmation to the customer via push notification and email.
2. Order enters `PENDING` status.
3. For group orders: order is held open until the order window closes or minimum quantity is reached.
4. Payment is authorized (not captured) at this stage.

### 4.2 Order Validation

1. Verify item availability with the supplier system.
2. Check delivery zone coverage for the customer's address.
3. Validate pricing — confirm group discount tiers are correctly applied.
4. Flag any orders with special instructions for manual review.
5. Orders failing validation → status set to `REVIEW_NEEDED`, assigned to Ops Coordinator.

### 4.3 Order Consolidation

1. At order window cut-off, system automatically consolidates all group orders into batch orders.
2. Generate consolidated pick list per supplier.
3. Send supplier notification with itemized order summary.
4. Capture payment from all participants in the batch.

### 4.4 Supplier Fulfillment

1. Supplier confirms receipt of batch order within **2 hours**.
2. Supplier prepares items and marks order as `READY_FOR_PICKUP` in system.
3. Ops team performs spot-check quality verification (see QA checklist, Section 6).
4. If items are unavailable: supplier marks partial fulfillment; Ops Coordinator contacts affected customers.

### 4.5 Delivery

1. Logistics partner receives pickup confirmation and delivery manifest.
2. Driver scans items at pickup — system updates status to `IN_TRANSIT`.
3. Customer receives real-time tracking link.
4. On delivery: customer confirms receipt via app; status → `DELIVERED`.
5. If delivery fails (customer unavailable): driver makes **1 retry attempt** after 30 minutes. After second failure, order returns to hub and customer is contacted for rescheduling.

### 4.6 Post-Delivery

1. System triggers satisfaction survey within **2 hours** of delivery confirmation.
2. Customer has **24 hours** to report quality issues with photo evidence.
3. Negative feedback (rating ≤ 3) auto-creates a customer service ticket.

## 5. SLA Targets

| Metric | Target |
|--------|--------|
| Order confirmation | < 30 seconds |
| Supplier notification after cut-off | < 15 minutes |
| Supplier readiness confirmation | < 2 hours |
| Delivery completion | Within delivery window selected |
| Customer service response (first reply) | < 1 hour during business hours |

## 6. Quality Check Criteria

- [ ] Items match order quantity ± 5% (weight-based items)
- [ ] Expiration dates are minimum 3 days from delivery date
- [ ] Packaging is intact and clean
- [ ] Temperature-sensitive items are properly stored (cold chain)
- [ ] Correct labeling and allergen information present

## 7. Escalation Matrix

| Issue | Escalate To | Timeframe |
|-------|-------------|-----------|
| Supplier non-response | Supplier Relations Manager | After 2 hours |
| Payment failure | Finance Team | Immediately |
| Delivery delay > 2 hours | Logistics Manager | At delay threshold |
| Customer complaint (severity high) | Customer Success Lead | Immediately |
| System outage | Engineering On-Call | Immediately |

## 8. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-16 | Operations Team | Initial release |
