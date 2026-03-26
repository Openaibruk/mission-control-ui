# Marketing Analytics Tracking Framework

> What to measure, how to measure it, and when to review — all in one place.

---

## 1. Measurement Architecture

### Data Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌────────────┐
│   Sources   │───▶│  Collection  │───▶│  Storage &  │───▶│  Reporting │
│             │    │    Layer     │    │  Transform  │    │   Layer    │
├─────────────┤    ├──────────────┤    ├─────────────┤    ├────────────┤
│ • Website   │    │ • GA4        │    │ • BigQuery  │    │ • Looker   │
│ • Ads       │    │ • Tag Manager│    │ • Snowflake │    │ • Sheets   │
│ • Email     │    │ • Pixel      │    │ • Postgres  │    │ • Dashboards│
│ • CRM       │    │ • API        │    │             │    │            │
└─────────────┘    └──────────────┘    └─────────────┘    └────────────┘
```

---

## 2. Core Metrics by Funnel Stage

### Awareness (TOFU)

| Metric | Definition | Tool | Frequency |
|--------|------------|------|-----------|
| **Impressions** | Total ad views | Ad platforms | Daily |
| **Reach** | Unique viewers | Ad platforms, GA4 | Daily |
| **CPM** | Cost per 1,000 impressions | Ad platforms | Daily |
| **Website Sessions** | Total visits | GA4 | Daily |
| **New Users** | First-time visitors | GA4 | Daily |
| **Brand Lift** | Awareness increase | Surveys | Campaign |

### Consideration (MOFU)

| Metric | Definition | Tool | Frequency |
|--------|------------|------|-----------|
| **Click-Through Rate (CTR)** | Clicks / Impressions | Ad platforms | Daily |
| **Time on Site** | Avg session duration | GA4 | Daily |
| **Pages per Session** | Depth of engagement | GA4 | Daily |
| **Bounce Rate** | Single-page exits | GA4 | Daily |
| **Email Open Rate** | Opens / Delivered | Email platform | Per send |
| **Email CTR** | Clicks / Opens | Email platform | Per send |
| **Content Downloads** | PDF/guide captures | GA4 | Weekly |
| **Video Views** | Video engagement | YouTube, GA4 | Weekly |

### Decision (BOFU)

| Metric | Definition | Tool | Frequency |
|--------|------------|------|-----------|
| **Leads** | Form submissions | CRM, GA4 | Daily |
| **MQLs** | Sales-qualified leads | CRM | Daily |
| **SQLs** | Accepted by sales | CRM | Weekly |
| **Trials Started** | Free trial signups | App, GA4 | Daily |
| **Trial-to-Paid** | Conversion rate | CRM | Weekly |
| **Purchases** | Completed transactions | Payment, CRM | Daily |
| **Revenue** | Total sales | Payment, CRM | Daily |
| **CAC** | Cost per acquisition | Calculated | Weekly |

### Retention (Post-Purchase)

| Metric | Definition | Tool | Frequency |
|--------|------------|------|-----------|
| **Churn Rate** | Customers lost / total | CRM | Monthly |
| **NPS** | Net Promoter Score | Survey tool | Quarterly |
| **Repeat Purchase Rate** | 2+ orders / customers | CRM | Monthly |
| **LTV** | Lifetime value | CRM | Monthly |
| **Customer Support Tickets** | Support volume | Support tool | Weekly |

---

## 3. Event Tracking Specification

### Required Events (All Channels)

```javascript
// Page Views
{
  event: 'page_view',
  page_location: '/pricing',
  page_title: 'Pricing Plans',
  referrer: 'https://google.com'
}

// Form Submissions
{
  event: 'generate_lead',
  form_name: 'contact_form',
  form_location: 'pricing_page'
}

// E-commerce
{
  event: 'add_to_cart',
  currency: 'USD',
  value: 49.00,
  items: [{ item_id: 'pro_plan', item_name: 'Pro Plan' }]
}

{
  event: 'purchase',
  currency: 'USD',
  value: 49.00,
  transaction_id: 'ord_12345',
  items: [{ item_id: 'pro_plan', item_name: 'Pro Plan' }]
}

// Sign-ups
{
  event: 'sign_up',
  method: 'google_oauth',
  source: 'homepage'
}

// Trials
{
  event: 'trial_start',
  plan: 'pro_trial',
  source: 'landing_page'
}
```

### Custom Events by Channel

| Channel | Event | When to Fire |
|---------|-------|--------------|
| **Email** | `email_open` | On image load |
| **Email** | `email_click` | On link click |
| **Social** | `social_share` | On share action |
| **Video** | `video_complete` | At 90% watch |
| **Webinar** | `webinar_register` | On registration |
| **Webinar** | `webinar_attend` | When live starts |
| **Chat** | `chat_started` | When widget opened |
| **Chat** | `chat_booked` | When meeting scheduled |

---

## 4. UTM Tracking Protocol

### Required Parameters (All Campaign Links)

```
utm_source     = referral source (required)
utm_medium     = marketing medium (required)
utm_campaign   = campaign name (required)
utm_content    = creative/ad variation (optional)
utm_term       = keyword (optional)
```

### Naming Conventions

| Parameter | Format | Example |
|-----------|--------|---------|
| **utm_source** | platform or partner name | facebook, google, newsletter, partner_co |
| **utm_medium** | channel type | cpc, email, social, referral, organic |
| **utm_campaign** | objective_timing | q1_2026_awareness, spring_sale_2026 |
| **utm_content** | creative_identifier | hero_banner_a, cta_button_v2, email_subject_1 |
| **utm_term** | keyword or audience | running_shoes, lookalike_1pct |

### Builder Tool

Use: [UTM Builder Link](https://example.com/utm-builder)

```
https://yoursite.com/landing-page
?utm_source=facebook
&utm_medium=cpc
&utm_campaign=spring_sale_2026
&utm_content=hero_video_ad
&utm_term=fitness_apparel
```

---

## 5. Attribution Windows

| Model | Window | Use Case |
|-------|--------|----------|
| **Last Click** | 30 days | Direct response campaigns |
| **First Click** | 90 days | Awareness campaigns |
| **Linear** | 60 days | Balanced credit |
| **Data-Driven** | 90 days | Enterprise (if data allows) |

**Default**: Use Last Click for weekly reports, Data-Driven for monthly reviews.

---

## 6. Reporting Schedule

| Report | Frequency | Audience | Day/Time |
|--------|-----------|----------|----------|
| **Daily Dashboards** | Daily | Marketing team | 9 AM |
| **Weekly Performance** | Weekly | Marketing + Sales | Monday 9 AM |
| **Monthly Business Review** | Monthly | Leadership | 1st Monday |
| **Quarterly Strategy** | Quarterly | Executive team | QBR |

---

## 7. Dashboard Links

| Dashboard | Tool | URL/Location |
|-----------|------|--------------|
| Real-time Traffic | GA4 | ga4.google.com |
| Campaign Performance | Looker | looker.company.com/marketing |
| Revenue & SQLs | CRM | salesforce/hubspot |
| Email Metrics | Email Platform | mailchimp/klaviyo |
| Ad Spend | Ad Platforms | Google/Meta/TikTok |

---

## 8. Data Validation Checklist

Before reporting, verify:

- [ ] GA4 event firing (use GA DebugView)
- [ ] UTM parameters present on all campaign URLs
- [ ] Conversion events mapped correctly in all ad platforms
- [ ] CRM data synced (no lag >1 hour)
- [ ] Revenue data reconciled with payment processor
- [ ] Attribution model applied consistently

---

*Last Updated: March 2026*
*Owner: Marketing Analytics*
