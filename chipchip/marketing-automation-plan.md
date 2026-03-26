# ChipChip Marketing Automation & Tool Stack

**Prepared by:** Amen (Analytics) + Nova  
**Date:** March 18, 2026

---

## Executive Summary

ChipChip's marketing team currently relies on Google Forms, Sheets, and manual processes. This plan recommends a modern, affordable marketing tech stack and 10 key automations that will save 20+ hours/week and enable data-driven decisions.

---

## 1. Current State Assessment

### What Works
- ✅ Google Forms for surveys (cheap, easy)
- ✅ Google Sheets for data tracking
- ✅ Google Drive for document storage

### What Doesn't
- ❌ No CRM — customer data scattered across sheets
- ❌ No email automation — manual follow-ups
- ❌ No social media scheduling — posting is ad-hoc
- ❌ No analytics dashboard — can't see trends
- ❌ No automation between tools — copy-paste between sheets
- ❌ Survey data sits unused after collection
- ❌ No customer journey tracking

---

## 2. Recommended Tool Stack

### Tier 1: Free / Already Available (Implement Immediately)

| Tool | Purpose | Cost | Why |
|------|---------|------|-----|
| **Google Workspace** | Docs, Sheets, Drive, Forms | Free (existing) | Already in use |
| **Google Analytics 4** | Website/app analytics | Free | Essential baseline |
| **Canva** | Design templates | Free tier | Brand consistency |
| **Telegram Bot API** | Automated messages | Free | Already on Telegram |
| **Meta Business Suite** | FB/IG scheduling + insights | Free | Facebook native |
| **Bitly** | Link tracking | Free tier | Track content performance |

### Tier 2: Low-Cost Upgrades (Month 2-3)

| Tool | Purpose | Cost | Why |
|------|---------|------|-----|
| **Brevo (Sendinblue)** | Email + SMS marketing | Free → $25/mo | Best free tier, SMS support |
| **Typeform** | Better surveys | Free → $25/mo | Better UX than Google Forms |
| **Buffer** | Social scheduling | Free → $6/mo/channel | Simple, affordable |
| **Notion** | Knowledge base + wiki | Free | Team documentation |
| **Zapier** | Automation glue | Free → $20/mo | Connects all tools |

### Tier 3: Growth Stage (Month 4+)

| Tool | Purpose | Cost | Why |
|------|---------|------|-----|
| **HubSpot CRM Free** | Customer database | Free | Industry standard, free CRM |
| **Mixpanel** | Product analytics | Free tier | Track user behavior |
| **Google Looker Studio** | Dashboards | Free | Visualize all data |
| **Make (Integromat)** | Advanced automation | $10/mo | More powerful than Zapier |

### Tools to AVOID
- ❌ Salesforce (too expensive, overkill)
- ❌ Hootsuite (Buffer does the same for less)
- ❌ Mailchimp (Brevo is cheaper for SMS+email in Ethiopia)
- ❌ Monday.com (Notion covers this)

---

## 3. 10 Key Automations

### Automation 1: New SGL Welcome Sequence
**Trigger:** New SGL signup form submitted  
**Flow:**
1. Form submission → Google Sheet row added
2. Zapier detects new row → creates contact in Brevo
3. Brevo sends: Day 0 welcome email, Day 1 quick-start guide, Day 3 tips
4. Telegram bot sends: Welcome message in SGL group
5. Google Sheet: auto-assign follow-up date

**Time saved:** 30 min/SGL × 15 SGLs/month = 7.5 hours/month

### Automation 2: Survey Response → Insight
**Trigger:** New survey response submitted  
**Flow:**
1. Google Form → Sheet
2. Zapier analyzes response type → categorizes
3. If negative feedback → instant Telegram alert to marketing
4. If feature request → added to product backlog sheet
5. Weekly summary auto-generated in Google Doc

**Time saved:** 2 hours/week reviewing surveys manually

### Automation 3: Social Media Content Pipeline
**Trigger:** Weekly schedule (every Monday)  
**Flow:**
1. Content calendar in Google Sheet (pre-planned)
2. Buffer reads calendar → schedules posts
3. After posting → Bitly tracks clicks
4. Weekly: auto-pull engagement data into reporting sheet
5. Top performers highlighted in weekly report

**Time saved:** 5 hours/week on manual posting + tracking

### Automation 4: Restaurant Onboarding Drip
**Trigger:** Restaurant signup  
**Flow:**
1. App/form submission → Sheet
2. Day 0: Welcome + menu upload instructions
3. Day 2: Pricing guide + order walkthrough
4. Day 5: "First order" incentive reminder
5. Day 7: Check-in from account manager (task created)
6. Day 14: Satisfaction survey

**Time saved:** 2 hours/week on manual follow-ups

### Automation 5: Campaign Performance Auto-Report
**Trigger:** Every Monday 9AM  
**Flow:**
1. Pull data from: Meta API (social), Brevo (email), Google Analytics (web)
2. Compile into Google Sheet dashboard
3. Generate summary in Google Doc
4. Email report to team
5. Highlight: top post, worst post, key metric changes

**Time saved:** 3 hours/week on manual reporting

### Automation 6: SGL Commission Tracker
**Trigger:** Weekly order processing  
**Flow:**
1. Order data → Google Sheet
2. Auto-calculate commission per SGL (5% of GMV)
3. Monthly: generate commission statement PDF
4. Send to SGL via Telegram/WhatsApp
5. Track payouts in separate sheet

**Time saved:** 4 hours/month on manual calculations

### Automation 7: Lead Scoring & Routing
**Trigger:** Any form submission (SGL, restaurant, partnership)  
**Flow:**
1. Form response scored based on: location, volume, experience
2. Hot leads (score > 80) → immediate Telegram alert to sales
3. Warm leads (50-80) → added to weekly follow-up list
4. Cold leads (< 50) → automated nurture sequence
5. All tracked in HubSpot CRM (when implemented)

**Time saved:** 1 hour/day on lead qualification

### Automation 8: Customer Feedback Loop
**Trigger:** Post-delivery (24h after delivery)  
**Flow:**
1. Auto-send SMS/Telegram: "How was your order? Rate 1-5"
2. Responses logged in sheet
3. Score 4-5 → "Thank you" + "Share with a friend" referral link
4. Score 1-3 → Alert to customer service + "What went wrong?" follow-up
5. Monthly NPS calculated and reported

**Time saved:** 2 hours/week + systematic feedback collection

### Automation 9: Competitor Monitoring
**Trigger:** Daily at 8AM  
**Flow:**
1. Google Alerts for: competitor names, "food delivery Ethiopia", "group buying"
2. Alerts forwarded to Slack/Telegram channel
3. Weekly: summarize competitive moves
4. Monthly: competitive landscape update

**Time saved:** 1 hour/day on manual monitoring

### Automation 10: Content Calendar Auto-Populate
**Trigger:** End of each month  
**Flow:**
1. Read next month's calendar template
2. Auto-fill with: seasonal events, product launches, recurring post types
3. Assign content types per day per channel
4. Notify team to review and finalize
5. Approved calendar syncs to Buffer/scheduling tools

**Time saved:** 2 hours/month on calendar planning

---

## 4. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2) — FREE
- [ ] Set up Google Analytics 4 on all web properties
- [ ] Create Canva brand templates (post, story, cover)
- [ ] Set up Meta Business Suite scheduling
- [ ] Create content calendar Google Sheet
- [ ] Set up Telegram bot for automated messages
- [ ] Create Bitly account, set up branded links

### Phase 2: Automation (Weeks 3-6) — ~$25/month
- [ ] Set up Brevo account (email + SMS)
- [ ] Create SGL welcome email sequence
- [ ] Create restaurant onboarding drip
- [ ] Set up Zapier (free tier) — connect Forms → Sheets → Brevo
- [ ] Switch key surveys to Typeform
- [ ] Set up Google Looker Studio dashboard

### Phase 3: Scale (Weeks 7-12) — ~$50/month
- [ ] Implement HubSpot CRM (free)
- [ ] Set up campaign auto-reporting
- [ ] Build lead scoring system
- [ ] Set up competitor monitoring
- [ ] Upgrade Zapier or switch to Make for complex automations
- [ ] Monthly automation review + add new automations

---

## 5. Data Architecture

```
Google Forms / Typeform
        ↓
   Google Sheets (raw data)
        ↓
   Zapier / Make (processing)
        ↓
   ┌─────────────┬──────────────┬─────────────┐
   │   Brevo     │  HubSpot     │  Looker     │
   │  (email/SMS)│  (CRM)       │  Studio     │
   │             │              │  (dashboard)│
   └─────────────┴──────────────┴─────────────┘
        ↓              ↓              ↓
   Automated      Customer      Team
   campaigns      tracking      insights
```

### Key Data Flows
1. **Survey → Action:** Form responses auto-categorized and routed
2. **Order → Commission:** Weekly orders auto-calculate SGL payouts
3. **Content → Insights:** Social posts auto-track performance
4. **Feedback → Improvement:** Post-delivery ratings trigger actions
5. **Lead → CRM:** All form submissions score and route to CRM

---

## 6. Cost Summary

| Phase | Monthly Cost | Time Saved/Month | ROI |
|-------|-------------|------------------|-----|
| Phase 1 | 0 ETB | ~40 hours | ∞ |
| Phase 2 | ~$25 (900 ETB) | ~60 hours | 1 ETB per 4 hours saved |
| Phase 3 | ~$50 (1,800 ETB) | ~80 hours | 1 ETB per 2.7 hours saved |

**Total estimated time savings at full implementation:** 80 hours/month = 2 full workdays.

---

## 7. Quick-Start (This Week)

1. **Today:** Create Bitly account, set up branded links
2. **Tomorrow:** Set up Meta Business Suite, schedule this week's posts
3. **Day 3:** Create content calendar template in Google Sheets
4. **Day 4:** Set up Google Analytics 4
5. **Day 5:** Create Canva brand templates

*Zero cost, immediate impact.*
