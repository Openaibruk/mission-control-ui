# Marketing Analytics Framework

## Overview
This framework establishes how we track, measure, and optimize marketing performance across all channels. Built for the marketing team (Maven, Pixel, Echo, Pulse).

## Core KPI Categories

### 1. Acquisition Metrics
| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| **CAC** | Customer Acquisition Cost = Total Marketing Spend / New Customers | < $50 | Weekly |
| **Leads** | Total qualified leads generated | Weekly growth: 10% | Weekly |
| **Lead-to-Customer Rate** | % of leads that convert to customers | > 5% | Weekly |
| **Traffic Cost** | Cost per visit across all channels | < $0.25 | Weekly |

### 2. Revenue Metrics
| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| **Revenue** | Total revenue from marketing-attributed customers | Growing MoM | Weekly |
| **LTV** | Lifetime Value = Avg Order Value × Purchase Frequency × Retention | > $200 | Monthly |
| **ROAS** | Return on Ad Spend = Revenue / Ad Spend | > 3:1 | Weekly |
| **AOV** | Average Order Value | > $75 | Weekly |

### 3. Engagement Metrics
| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| **Email Open Rate** | % of emails opened | > 20% | Per campaign |
| **Email CTR** | Click-through rate on emails | > 3% | Per campaign |
| **Social Engagement** | Likes + Comments + Shares / Followers | > 5% | Weekly |
| **Website Engagement** | Pages per session, time on site | > 2.5 min | Weekly |

### 4. Conversion Metrics
| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| **Landing Page CVR** | Conversion rate on landing pages | > 3% | Weekly |
| **Cart Abandonment** | % who add to cart but don't purchase | < 60% | Weekly |
| **Checkout Completion** | % who start checkout and complete | > 65% | Weekly |

### 5. Brand & Content Metrics
| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| **Brand Mentions** | Unpaid mentions across channels | Tracking only | Weekly |
| **Content Performance** | Top performing content by engagement | Top 5 | Weekly |
| **Share of Voice** | % of category conversations we own | Growing | Monthly |

---

## Data Sources

### Primary Sources
- **Ads Platforms:** Google Ads, Meta Ads, LinkedIn Ads (via API or manual export)
- **Analytics:** Google Analytics 4, Plausible, or similar
- **CRM:** Customer data, pipeline, closed-won data
- **Email:** Marketing platform (Mailchimp, ConvertKit, etc.)
- **Social:** Platform native analytics

### Secondary Sources
- **Website:** Server logs, heatmaps (Hotjar)
- **Surveys:** NPS, customer satisfaction
- **Competitive:** SEMrush, Ahrefs for benchmarking

---

## Attribution Models

### Recommended: First-Touch + Last-Touch Hybrid
1. **First-Touch:** Credit goes to the channel that introduced the customer
2. **Last-Touch:** Credit goes to the channel that closed the sale
3. **Time-Decay:** More credit to touchpoints closer to conversion

### Reporting Priority
- Start with **last-touch** (simplest, most common)
- Build toward **multi-touch** as data accumulates

---

## Reporting Cadence

| Report | Frequency | Audience | Format |
|--------|-----------|----------|--------|
| **Daily Pulse** | Daily | Pulse | Slack: 3-5 key metrics |
| **Weekly Performance** | Every Monday | Marketing team | Markdown report + dashboard |
| **Monthly Strategy** | 1st of month | Maven + Nova | Slides + recommendations |
| **Quarterly Review** | Q-end | All | Full deck + Q goals |

---

## Dashboard Structure

### Real-Time Dashboard (docs/kpi-dashboard.md)
- Current week metrics vs targets
- Traffic & conversion trends (7-day chart)
- Top performing campaigns
- Alerts for anomalies

### Monthly Deep Dive
- Channel-by-channel breakdown
- Cohort analysis
- Customer journey mapping
- Competitive benchmarking

---

## Tools & Stack

### Current (Simple)
- **Dashboard:** Markdown-based in docs/
- **Data Collection:** Manual + platform exports
- **Visualization:** ASCII/text charts, basic tables

### Future (Recommended)
- **Analytics:** Mixpanel or Amplitude (product analytics)
- **BI Layer:** Metabase or Grafana (self-hosted)
- **Data Warehouse:** Supabase (for aggregated data)
- **Automation:** n8n for data pipelines

---

## Action Thresholds

| Metric | Yellow Alert | Red Alert |
|--------|-------------|-----------|
| CAC | > $40 | > $60 |
| ROAS | < 2.5:1 | < 2:1 |
| Lead Volume | -20% vs last week | -40% vs last week |
| CVR | < 2% | < 1% |
| Email Open | < 15% | < 10% |

---

## Next Steps

1. [ ] Set up data collection from all platforms (manual initially)
2. [ ] Populate kpi-dashboard.md with baseline metrics
3. [ ] Establish weekly reporting rhythm
4. [ ] Build automated data pull (Phase 2)
5. [ ] Integrate with Supabase/Metabase (Phase 3)

---

*Framework Owner: @Pulse*
*Last Updated: 2026-03-14*