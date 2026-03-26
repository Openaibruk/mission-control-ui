# Marketing Analytics Framework

A comprehensive guide to tracking, measuring, and optimizing marketing performance.

---

## 1. KPI Definitions

### Customer Acquisition Metrics

| KPI | Formula | Target | Description |
|-----|---------|--------|-------------|
| **CAC (Customer Acquisition Cost)** | Total Marketing Spend / New Customers Acquired | Varies by channel | Cost to acquire one new customer |
| **CAC Payback Period** | CAC / (ARPU × Gross Margin) | <12 months | Months to recoup acquisition cost |
| **Marketing Qualified Leads (MQLs)** | Count of leads meeting BANT criteria | Per campaign | Leads deemed sales-ready |
| **Sales Qualified Leads (SQLs)** | MQLs converted by sales team | >20% of MQLs | Leads accepted by sales |

### Revenue & Lifetime Value

| KPI | Formula | Target | Description |
|-----|---------|--------|-------------|
| **LTV (Lifetime Value)** | ARPU × Customer Lifespan × Gross Margin | $500+ | Total revenue expected from a customer |
| **LTV:CAC Ratio** | LTV / CAC | >3:1 | Efficiency of acquisition spend |
| **ARPU (Avg Revenue Per User)** | Total Revenue / Total Customers | Growing MoM | Average revenue per customer |
| **MRR/ARR** | Monthly/Annual Recurring Revenue | Growing | Predictable revenue stream |

### Conversion Metrics

| KPI | Formula | Target | Description |
|-----|---------|--------|-------------|
| **Lead-to-Customer Rate** | Customers / Total Leads | 2-5% | Overall conversion efficiency |
| **Trial-to-Paid Rate** | Paid Customers / Trial Users | >15% | Product adoption success |
| **Landing Page Conversion** | Conversions / Page Visits | 2-5% | Page performance |
| **Email Conversion Rate** | Clicks / Emails Delivered | 2-3% | Campaign engagement |

### Engagement Metrics

| KPI | Formula | Target | Description |
|-----|---------|--------|-------------|
| **DAU/MAU Ratio** | Daily Active Users / Monthly Active Users | >20% | Product stickiness |
| **Session Duration** | Avg time on site/app | Growing | Content engagement |
| **Bounce Rate** | Single-page sessions / Total sessions | <40% | Landing page quality |
| **Email Open Rate** | Opens / Emails Delivered | 15-25% | Content relevance |
| **Click-Through Rate (CTR)** | Clicks / Impressions | Varies by channel | Ad/content performance |
| **Net Promoter Score (NPS)** | Survey-based (0-10) | >50 | Customer satisfaction |


---

## 2. Tracking Methodology

### Implementation Stack

- **Analytics Platform**: Google Analytics 4, Mixpanel, or Amplitude
- **Attribution**: Adjust, AppsFlyer, or native UTM tracking
- **CRM**: HubSpot, Salesforce, or equivalent
- **Data Warehouse**: BigQuery, Snowflake, or Postgres

### Event Tracking

```javascript
// Standard event schema
{
  event: 'purchase',
  timestamp: '2024-01-15T10:30:00Z',
  user_id: 'user_123',
  session_id: 'sess_456',
  platform: 'web',
  properties: {
    value: 99.00,
    currency: 'USD',
    items: [{ sku: 'prod_001', qty: 1 }]
  },
  utm: {
    source: 'google',
    medium: 'cpc',
    campaign: 'spring_sale'
  }
}
```

### Key Events to Track

| Category | Events |
|----------|--------|
| **Awareness** | page_view, video_view, ad_impression |
| **Interest** | link_click, document_download, email_open |
| **Consideration** | add_to_cart, start_checkout, initiate_trial |
| **Conversion** | purchase, subscription_start, signup_complete |
| **Retention** | return_visit, subscription_renew, referral |

### UTM Parameters (Required for All Campaigns)

```
utm_source   = platform (google, facebook, newsletter)
utm_medium   = channel type (cpc, email, social)
utm_campaign = campaign name (spring_2024_sale)
utm_content  = ad variation (cta_button_a)
utm_term     = keyword (running_shoes)
```

---

## 3. Reporting Templates

### Weekly Marketing Report

**Sent**: Every Monday, 9 AM

## Week of [Date] Marketing Summary

### Quick Wins
- [Top performing campaign]
- [Key metric improvement]

### Traffic & Acquisition
| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Sessions | 12,500 | 11,200 | +12% |
| New Users | 3,100 | 2,800 | +11% |
| CAC | $45 | $52 | -13% |

### Conversion Funnel
| Stage | Rate | vs Last Week |
|-------|------|--------------|
| Visit → Lead | 4.2% | +0.3% |
| Lead → MQL | 28% | -2% |
| MQL → SQL | 45% | +5% |
| SQL → Customer | 22% | +1% |

### Campaign Performance
| Campaign | Spend | Revenue | ROAS |
|----------|-------|---------|------|
| Spring Sale | $2,500 | $8,200 | 3.3x |
| Email Retargeting | $500 | $3,100 | 6.2x |

### Action Items
- [ ] Optimize underperforming CPC ads
- [ ] A/B test landing page CTA
- [ ] Review budget allocation

### Monthly Business Review

**Sent**: First Monday of each month

## [Month] Marketing Performance Report

### Executive Summary
[2-3 sentence overview of month's performance]

### KPI Dashboard
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| New Customers | 150 | 162 | ✅ |
| Revenue | $50,000 | $54,200 | ✅ |
| CAC | <$60 | $55 | ✅ |
| LTV:CAC | >3:1 | 3.4:1 | ✅ |
| MQLs | 500 | 480 | ⚠️ |

### Channel Breakdown
| Channel | Spend | Revenue | ROAS | CAC |
|---------|-------|---------|------|-----|
| Paid Search | $8,000 | $28,000 | 3.5x | $48 |
| Social Ads | $5,000 | $12,000 | 2.4x | $62 |
| Email | $1,000 | $8,000 | 8.0x | $22 |
| Organic | $0 | $6,200 | ∞ | $0 |

### Cohort Analysis
[Insert retention curve chart]

### Campaign ROI
[Summary of all campaigns with profit/loss]

### Insights & Recommendations
1. Email channel showing highest ROI - consider budget reallocation
2. Facebook CAC trending up - review audience targeting
3. New product launch driving organic traffic

### Next Month Priorities
- [ ] Launch summer campaign
- [ ] Implement new attribution model
- [ ] Reduce CAC by 10%


---

## 4. Campaign Measurement Guide

### Pre-Campaign Setup

1. **Define objectives**: Brand awareness, lead gen, or revenue
2. **Set baseline metrics**: 30-day historical averages
3. **Establish success criteria**: Minimum ROAS, CPA targets
4. **Create tracking**: UTM parameters, conversion events, goals

### Campaign Types & Measurement

| Campaign Type | Key Metrics | Typical Targets |
|---------------|-------------|-----------------|
| **Awareness** | Impressions, Reach, CPM, Brand Lift | CPM <$10 |
| **Lead Generation** | Leads, CPL, Lead Quality | CPL <$50 |
| **Conversion/ROI** | Revenue, ROAS, CPA, AOV | ROAS >3x |
| **Retention** | Repeat Purchase Rate, LTV, Churn | LTV:CAC >3:1 |
| **Referral** | Referrals, Cost per Referral, Viral Coeff | Viral >1.0 |

### A/B Testing Framework

1. **One variable at a time**: Creative, audience, or landing page
2. **Statistical significance**: Minimum 95% confidence, n>1000
3. **Test duration**: Minimum 1 full business cycle (usually 7-14 days)
4. **Document learnings**: Always record why winners won

### Budget Allocation Model

```
Total Marketing Budget: $X

Split by funnel stage:
- Awareness (TOFU): 30%
- Consideration (MOFU): 40%
- Decision (BOFU): 30%

Split by channel (based on historical ROAS):
- Highest ROAS: 40%
- Medium ROAS: 35%
- Testing/New: 25%
```

---

## 5. Attribution Models

### Overview of Models

| Model | How It Works | Best For |
|-------|--------------|----------|
| **Last Click** | 100% credit to final touchpoint | Simple reporting, direct response |
| **First Click** | 100% credit to discovery touchpoint | Awareness campaigns, upper funnel |
| **Linear** | Equal credit across all touchpoints | Even distribution credit |
| **Time Decay** | More credit to recent touchpoints | Short sales cycles |
| **Position-Based** | 40% first, 40% last, 20% middle | Balanced funnel credit |
| **Data-Driven** | ML-based credit distribution | Enterprise, complex journeys |

### Choosing the Right Model

1. **Short sales cycle (<7 days)**: Last Click or Time Decay
2. **Long sales cycle (>30 days)**: Data-Driven or Position-Based
3. **Brand awareness focus**: First Click
4. **Multi-channel complexity**: Data-Driven (requires sufficient data)

### Implementation Notes

- Use same model for consistency across reports
- Document model choice in all campaign documentation
- Review model effectiveness quarterly
- Consider privacy implications (cookie-less future)

---

## Quick Reference Card

### Golden Metrics
- **LTV:CAC > 3:1** - Healthy business
- **CAC Payback < 12 months** - Sustainable growth
- **ROAS > 3x** - Profitable campaigns

### Weekly Check
- [ ] Traffic vs. last week
- [ ] CAC trend
- [ ] Campaign spend vs. budget
- [ ] Conversion rates

### Monthly Check
- [ ] Channel ROI comparison
- [ ] Cohort retention review
- [ ] Attribution model audit
- [ ] Target vs. actual performance

---

*Last Updated: March 2024*
