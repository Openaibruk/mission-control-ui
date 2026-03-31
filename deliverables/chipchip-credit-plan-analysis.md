# ChipChip Credit Financial Plan — Analysis Report

**Date:** 2026-03-31
**Source:** [Google Sheet](https://docs.google.com/spreadsheets/d/1IGjkivDSdnTbajElaXzOGsjq8A7_zM16/edit)
**Period:** Apr-26 to Apr-27 (13 months)

---

## Executive Summary

ChipChip's credit financial plan projects **89.3M ETB in total revenue** over 13 months with **16.0M ETB in total margin** (17.97% blended margin rate). The model has three revenue streams: B2B (51.3%), FMCG (33.3%), and Super Leader (15.4%).

**Key Finding: The math checks out, but the model carries significant structural risks** — primarily around escalating credit exposure and working capital requirements.

---

## 1. Revenue Analysis

### 1.1 Revenue Breakdown

| Stream | 13-Mo Total | % of Revenue | Growth Pattern |
|--------|------------|-------------|---------------|
| **B2B** | 45,816,536 ETB | 51.3% | 25% MoM → 15% MoM (after Oct-26) |
| **FMCG** | 29,706,800 ETB | 33.3% | Step-function growth (0→50→0→33→0%) |
| **Super Leader** | 13,740,767 ETB | 15.4% | 15% MoM constant throughout |
| **Total** | **89,264,103 ETB** | **100%** | 11-35% MoM |

### 1.2 Revenue Projections (Monthly)

| Month | B2B | Super Leader | FMCG | **Total** | MoM Growth |
|-------|-----|-------------|------|----------|-----------|
| Apr-26 | 914K | 400K | 1,292K | **2,606K** | — |
| Jul-26 | 1,786K | 608K | 1,937K | **4,332K** | 11.2% |
| Oct-26 | 3,210K | 925K | 2,583K | **6,718K** | 8.7% |
| Jan-27 | 4,881K | 1,407K | 2,583K | **8,872K** | 10.2% |
| Apr-27 | 7,424K | 2,140K | 2,583K | **12,147K** | 11.4% |

---

## 2. Credit Exposure Analysis

### 2.1 Credit Ratios

| Month | B2B Credits (% Rev) | SL Credits (% Rev) | FMCG Credits | **Total Credits (% Rev)** |
|-------|-------------------|-------------------|-------------|-----------------------|
| Apr-26 | 80% | 20% | 0% | **31.1%** |
| Jul-26 | 80% | 20% | 0% | **35.8%** |
| Oct-26 | 80% | 40% | 0% | **43.7%** |
| Jan-27 | 80% | 80% | 0% | **56.7%** |
| Apr-27 | 80% | 80% | 0% | **63.0%** |

### 2.2 The Critical Problem

**Credit exposure nearly doubles over the period:**
- **Start (Apr-26):** 812K ETB/month = 31.1% of revenue
- **End (Apr-27):** 7,651K ETB/month = 63.0% of revenue

This means ChipChip will need to **front-load nearly 2/3 of its revenue** as working capital to fund credits. The total credit exposure over 13 months is **45.0M ETB**.

### 2.3 Super Leader Policy Jumps

The credit model assumes Super Leader credits jump:
- **Apr-Jul:** 20% credit rate
- **Aug-Nov:** 40% credit rate (doubles overnight)
- **Dec-Apr:** 80% credit rate (quadruples from start)

**This is a massive policy shift.** Does ChipChip have the risk appetite, collection mechanisms, and capital reserves to suddenly extend 4x more credit to Super Leaders?

---

## 3. Margin Analysis

### 3.1 Margin Composition

| Stream | Trade Margin Rate | Credit Margin Rate | **Combined Rate** |
|--------|----------------|-------------------|-----------------|
| **B2B** | 25% | 2.4% | **27.4%** |
| **Super Leader** | 5% | 1-4% | **6-9%** |
| **FMCG** | 5% | 3% | **8%** |

### 3.2 Total Margins (13 months)

| Component | Amount (ETB) | % of Revenue | Notes |
|-----------|-------------|-------------|-------|
| B2B Trade Margin | 11,454,134 | 25.0% | Main profit engine |
| B2B Credit Margin | 1,099,597 | 2.4% | Interest on credit |
| SL Trade Margin | 687,038 | 5.0% | Low but consistent |
| SL Credit Margin | 419,843 | 3.1% | Scales with policy |
| FMCG Trade Margin | 1,485,340 | 5.0% | Steady low-margin |
| FMCG Credit Margin | 891,204 | 3.0% | Cash flow positive |
| **TOTAL MARGIN** | **16,037,156** | **17.97%** | **Blended** |

### 3.3 Margin Trend

| Metric | Apr-26 | Apr-27 | Change |
|--------|--------|--------|--------|
| Total Trade Margin | 313K (12.0%) | 2,092K (17.2%) | +568% |
| Total Credit Margin | 65K (2.5%) | 341K (2.8%) | +427% |
| **Combined** | **378K (14.5%)** | **2,433K (20.0%)** | **+544%** |

The blended margin improves from 14.5% to 20.0% over the period, primarily driven by the high B2B trade margin (25%). This is a **positive sign** — the revenue mix tilts toward the highest-margin stream.

---

## 4. Risk Assessment

### 🔴 Critical Risks

1. **Working Capital Gap — 45M ETB**
   - Total credit exposure = 45M ETB over 13 months
   - Peak monthly exposure = 7.65M ETB
   - Question: Does ChipChip have access to this capital? If financed via debt, interest costs are NOT reflected in the model.

2. **Super Leader Credit Policy Jumps**
   - Credit rate doubles from 20%→40%→80% without clear justification
   - This is a product policy change, not organic revenue growth
   - Higher credit = higher default risk

3. **B2B Revenue Concentration (51.3%)**
   - Over half of revenue depends on a single, high-credit channel
   - If B2B growth slows below the 15% MoM target, the entire model collapses

4. **No Default/Non-Performing Loan Provision**
   - The model assumes 100% collection on 45M ETB in credits
   - Realistic NPL rates for Ethiopian B2B credit are 3-8%
   - A 5% default rate would reduce the 16M ETB margin by 2.25M ETB (14% hit)

### 🟠 High Risks

5. **FMCG Growth Pattern Is Artificial**
   - FMCG revenue grows in step-functions (flat→+50%→flat→+33%→flat)
   - This suggests a contract-based or batch-revenue model, not organic growth
   - What happens if a contract ends?

6. **Credit Margin Is Thin (2.4% for B2B)**
   - At 2.4%, even small collection delays destroy profitability
   - 30-day payment delay @ 2.4% margin = 24% annualized loss

7. **B2B Growth Rate Halving**
   - Growth drops from 25% MoM to 15% MoM at month 7 (Oct-26)
   - This is reasonable (growth naturally slows), but the model doesn't show what drives it

### 🟡 Medium Risks

8. **No Operating Expense Model**
   - The plan shows revenue and margin but NO costs (staff, tech, logistics, ops)
   - 16M ETB margin sounds good until you subtract operating expenses

9. **FMCG Credits Are Zero**
   - FMCG = 33% of revenue but 0% credit exposure
   - Is this realistic? Usually FMCG buyers need some credit terms

10. **No Seasonality Consideration**
    - Ethiopian holidays, fasting seasons, agricultural cycles are not factored in
    - FMCG typically has seasonal patterns

11. **No Scenario Analysis**
    - The plan is a single-track projection
    - No upside (bull case) or downside (bear case) scenarios
    - No sensitivity analysis on key variables (growth rate, credit %, margin %)

---

## 5. Financial Logic Verification

| Check | Result | Details |
|-------|--------|---------|
| Revenue totals | ✅ Pass | All 13 months verified (1 ETB rounding difference on Jan-27) |
| Revenue growth rates | ✅ Pass | B2B 25%→15%, SL 15% constant, FMCG step-growth |
| Credit calculations | ✅ Pass | All credit % of revenue matches stated rates |
| Trade margin calculations | ✅ Pass | B2B 25%, SL 5%, FMCG 5% all verified |
| Credit margin calculations | ✅ Pass | B2B 2.4%, SL 1-4%, FMCG 3% all verified |
| Total margin aggregation | ✅ Pass | Trade + credit = total margin |
| Cumulative totals | ✅ Pass | 1 ETB rounding differences only |

**Conclusion:** The sheet's math is correct and internally consistent. The risks are strategic, not mathematical.

---

## 6. Recommendations

### 6.1 Immediate Actions (Month 0-3)

1. **Model operating expenses** — Add salary, tech, logistics, storage, delivery costs
2. **Add NPL provision** — Assume 3-5% default rate on B2B credits, stress test at 8%
3. **Build financing plan** — How will 7.65M ETB/month peak credit exposure be funded?
4. **Define credit collection SLAs** — Payment terms, penalties, collection process

### 6.2 Pilot Phase (Apr-Aug 2026)

5. **Pilot at 50% scale** — Run actual operations at half the projected volume
6. **Test credit terms** — Validate 80% B2B credit rate with real customer behavior
7. **Monitor FMCG step-growth** — Is the 50% June jump achievable? What triggers it?
8. **Establish credit scoring** — Need a systematic way to assess customer credit risk

### 6.3 Scale Phase (Sep 2026+)

9. **Dynamic credit limits** — Use actual repayment data to adjust credit per customer
10. **Diversify revenue** — Reduce B2B dependency from 51% to <45% by Apr-27
11. **Scenario planning** — Build bull/base/bear cases with sensitivity analysis
12. **Quarterly review cadence** — Compare actuals vs. plan monthly, adjust quarterly

---

## 7. System/App Feature Suggestions

Based on the financial model requirements:

| Feature | Priority | Why It Matters |
|---------|----------|---------------|
| Credit scoring engine | Critical | Automated credit limits and risk assessment |
| Collection tracking dashboard | Critical | Real-time visibility into outstanding credits |
| Revenue actuals vs. plan tracker | High | Monthly comparison of projected vs. actual |
| NPL monitoring alerts | High | Early warning for default risk |
| Customer credit portfolio view | High | Per-customer credit, repayment, and risk metrics |
| Working capital calculator | Medium | Real-time capital availability vs. credit exposure |
| Scenario modeling tool | Medium | Test what-if scenarios (growth rate changes, NPL spikes) |
| Automated reporting | Medium | Monthly financial summaries for stakeholders |
| Integration with Supabase/B2B analytics | Medium | Connect to existing data infrastructure |

---

*End of analysis. Ready for PPTX deck creation.*
