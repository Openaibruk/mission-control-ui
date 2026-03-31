# ChipChip Business Analytics Report

**Report Date:** March 31, 2026
**Analyst:** Amen (Analytics)
**Data Source:** Operational CSV export /download.csv
**Period Covered:** February 9 – March 15, 2026 (6 weeks)

> **⚠️ Data Access Notes:** ClickHouse via Superset API is connected to the `mate-workflow` database (internal agent/employee data), not ChipChip business data. Supabase project (`vgrdeznxllkdolvrhlnm`) only contains Mission Control internal tables (projects, tasks, activities, agents, feedback, driver_onboarding). **No orders, products, or revenue tables exist in Supabase.** The B2B/DataHub analytics skills do not exist. The primary data source for this analysis is the operational CSV export in `/data/download.csv`. No real-time API access to ChipChip's transactional database was available.

---

## Executive Summary

ChipChip operated across **6 consecutive weeks** from Feb 9 – Mar 15, 2026, with total sales ranging from **1,054,953 to 1,665,477 ETB weekly**. The business shows a **positive top-line trend** (sales grew ~58% from Week 1 to peak in Week 3) but experienced a **decline of ~7.5%** in the latest two weeks compared to the Week 3 high. B2B sales collapsed to zero in Week 2 then partially recovered. Fresh produce drives **91-96%** of total sales by volume. Warehouse damage costs remain critically high, consuming **2.5–7.9%** of weekly sales value.

---

## 1. Revenue & Sales Analysis

### 1.1 Weekly Total Sales

| Week | Period | Total Sales (ETB) | WoW Change | vs Peak |
|------|--------|-------------------|------------|---------|
| W1 | Feb 09–15 | **1,054,953** | — | -32.5% |
| W2 | Feb 16–22 | **1,116,710** | +5.85% | -28.5% |
| W3 | Feb 23–Mar 01 | **1,555,460** | +39.28% | — (peak) |
| Target | — | **1,788,779** | — | — |
| W5 | Mar 02–08 | **1,591,079** | +2.29%* | -3.6% |
| W6 | Mar 09–15 | **1,665,477** | +4.68% | +7.1% |

*W4 data is missing from the CSV (gap between W3 and W5 target row). W5 is labeled "Mar 02 to Mar 08" with a target of 1,591,079 vs planned 1,788,779.

**Key Insight:** Sales surged 39% from W2→W3 (likely the launch of the March strategy shift mentioned in the strategic vision doc). However, the **target of 1,788,779 ETB/week is being missed** — W6 at 1,665,477 achieved only **93.1% of target**.

### 1.2 Revenue Trend (Chart)

```
ETB (millions)
1.8 |                                                    [Target]
1.7 |                                              ●────● 1.67
1.6 |                                        ──────●        
1.5 |                                  ●────●               
1.4 |                                 /                     
1.3 |                                /                      
1.2 |                         ●─────●                       
1.1 |                    ●────●                             
1.0 |               ●────●                                  
0.9 |_______________________________________________________
           W1     W2     W3    W4*    W5     W6     Target
```

### 1.3 Total Six-Week Revenue

**Grand Total Sales:** 1,054,953 + 1,116,710 + 1,555,460 + 1,591,080 + 1,665,477 = **5,983,680 ETB** across 5 reported weeks (W4 missing)

**Average Weekly Run Rate:** ~1,196,736 ETB (excluding W5–W6 target period) / ~1,559,618 ETB (all reported weeks)

---

## 2. Segment Performance Breakdown

### 2.1 Fresh Produce (Dominant Segment)

| Week | Fresh Sales (ETB) | % of Total Sales | SGL (ETB) | SGL Target |
|------|-------------------|------------------|-----------|------------|
| W1 | 28,921 | 91.0% | 1,953 | — |
| W2 | 22,866 | 91.3% | 2,999 | — |
| W3 | 32,325 | 92.6% | 3,688 | — |
| W5 (Mar 02-08) | 26,894 | 91.4% | 9,350 | 8,344 ✅ |
| W6 | 23,837 | 91.0% | 9,542 | 20,026 ⚠️ |

**Analysis:** Fresh produce consistently accounts for **91-93% of total units sold**. SGL (Smart Souk Group Leader) channel grew from ~2,000 ETB to **9,542 ETB** — a **389% increase** from W1 to W6, confirming the Smart Souk strategy pivot is working. However, W6 SGL sales of 9,542 fell **52% short** of the 20,026 target — strong growth but not enough.

### 2.2 FMCG (Fast-Moving Consumer Goods)

| Week | FMCG (ETB) | % of Total | SGL (ETB) | FMCG Target |
|------|------------|------------|-----------|-------------|
| W1 | 1,716 | 5.4% | 36 | — |
| W2 | 1,793 | 3.9% | 24 | — |
| W3 | 1,783 | 3.7% | 60 | — |
| W4 (target) | 2,136 | — | 72 | — |
| W5 | 2,452 | 4.3% | 406 | — |
| W6 | 1,966 | 4.2% | 189 | 2,000 ⚠️ |

**Analysis:** FMCG is a small but steady segment (~4-5% of units). The FMCG target for W6 was 2,000 — W6 achieved 1,966 (**98.3% of target**). SGL channel for FMCG jumped in W5 (406) but dropped back to 189 in W6.

### 2.3 B2B Segment

| Week | B2B Sales (ETB) | B2B Target |
|------|-----------------|------------|
| W1 | 5,755 | — |
| W2 | **0** | — |
| W3 | 1,590 | — |
| W5 | 2,877 | 2,861 ✅ |
| W6 | 2,396 | 2,861 ⚠️ |

**Critical Finding:** B2B sales **collapsed to zero in Week 2**. This strongly correlates with the strategic shift described in the March 2026 vision doc — "Move B2B fully out of the warehouse. Direct DC fulfillment." The B2B pipeline was disrupted during the transition. By W5, it recovered to 2,877 ETB (meeting target), but dipped again to 2,396 in W6 (**83.8% of target**).

### 2.4 Total "Total" Row (Revenue/Sales Value)

| Week | Total (ETB) | Target (ETB) | % of Target |
|------|-------------|--------------|-------------|
| W1 | 38,381 | — | — |
| W2 | 27,682 | — | — |
| W3 | 39,446 | — | — |
| W4 | — | 45,363 | — |
| W5 | 41,979 | — | — |
| W6 | 37,930 | — | — |

*Note: The "total" row appears to represent gross margin/revenue in ETB (not unit-based sales figures). The W5 value of 41,979 represents a **7.3% decline** from W3's peak of 39,446.*

---

## 3. Average Daily Run Rate

| Week | Avg Daily Run Rate (ETB) | WoW Growth |
|------|--------------------------|------------|
| W1 | 4,661 | — |
| W2 | 3,955 | -15.2% |
| W3 | 5,408 | +36.8% |
| W4 (target) | 6,482 | +19.9%* |
| W5 | 5,997 | -7.5%* |
| W6 | 5,419 | -9.6% |

*vs target*

**Concern:** The daily run rate peaked at 5,408 in W3, rose to the 6,482 target in W4, but has been declining since — W6 at 5,419 is **below the W3 level**. This suggests initial momentum from the operational changes has faded.

---

## 4. Purchasing Behavior

| Week | Total Purchases (ETB) |
|------|----------------------|
| W1 | 47,926 |
| W2 | 15,693 |
| W3 | 68,864 |
| W5 | 28,635 |
| W6 | 38,683 |

**Observation:** Purchases are highly volatile. W1 at 47,926 → W2 dropped 67% to 15,693 → W3 surged 339% to 68,864. This suggests **inconsistent supply-side ordering** or bulk pre-positioning ahead of demand spikes. The W5–W6 range of 28–39K appears more stabilized but still lags W1.

---

## 5. Loss & Damage Analysis

### 5.1 Arrival Damage

| Week | Arrival Damage (Kg) | Arrival Damage (ETB) | Damage % |
|------|--------------------|---------------------|----------|
| W1 | 1,463.0 | 36,854 | 3.49% |
| W2 | 608.8 | 29,535 | 2.64% |
| W3 | 1,916.6 | 68,372 | 4.40% |
| W5 | 370.8 | 13,725 | 0.86% ✅ |
| W6 | 220.0 | 11,188 | 0.67% ✅ |

**Major Improvement:** Arrival damage dropped from **4.40% in W3 to 0.67% in W6** — an **85% reduction** in damage percentage. This is likely due to the new direct-ship model (Supplier → DC/Customer bypassing warehouse).

### 5.2 Warehouse Damage

| Week | Warehouse Damage (Kg) | Warehouse Damage (ETB) | Damage % |
|------|----------------------|----------------------|----------|
| W1 | 1,726.4 | 83,142 | 7.88% |
| W2 | 801.7 | 34,153 | 3.06% |
| W3 | 390.2 | 19,124 | 1.23% |
| W5 | 621.4 | 30,775 | 1.93% |
| W6 | 118.8 | 10,341 | 0.62% ✅ |

**Outstanding Result:** Warehouse damage percentage plummeted from **7.88% to 0.62%** — a **92% improvement**. This directly validates the "remove central warehouse" strategy. The warehouse cost savings from Mar 02 onward are massive:
- W1 warehouse damage: **83,142 ETB**
- W6 warehouse damage: **10,341 ETB**
- **Savings: ~72,801 ETB/week** just from reduced warehouse damage

### 5.3 Supplier Damage (W5 only)

| Metric | W5 Value |
|--------|----------|
| Supplier damage (Kg) | 302.5 |
| Supplier damage (ETB) | 8,959 |

This appears in W5 as suppliers now handle more direct shipping — a cost shifted from ChipChip to suppliers.

### 5.4 Combined Losses

| Week | Total Damage Cost (ETB) | % of Sales |
|------|------------------------|------------|
| W1 | 120,000 | ~7.9% |
| W2 | 63,688 | ~3.9% |
| W3 | 87,496 | ~3.5% |
| W5 | 53,458 | ~1.8% |
| W6 | 21,529 | ~0.7% |

**Combined damage costs fell 82%** from W1 to W6. This is the single biggest financial win from the operational restructuring.

---

## 6. Product-Level Loss Detail (Week 5: Mar 02–08)

| Product | Damage (Kg) | Loss (ETB) | % of Total Loss |
|---------|-------------|------------|-----------------|
| **Carrot (big)** | 202.8 | 12,511 | 27.3% |
| **Carrot (small)** | 135.4 | 8,350 | 18.2% |
| Tomato A | 117.4 | 3,877 | 8.5% |
| Tomato B | 108.1 | 3,696 | 8.1% |
| Red Onion C | 99.0 | 2,277 | 5.0% |
| White Cabbage | 77.0 | 1,386 | 3.0% |
| Red Onion | 51.0 | 1,173 | 2.6% |
| Avocado (ripe) | 34.8 | 3,732 | 8.2% |
| Avocado | 26.0 | 2,430 | 5.3% |
| Papaya | 25.3 | 2,210 | 4.8% |
| Sweet Potato | 21.0 | 935 | 2.0% |
| Other 9 items | 56.2 | 3,175 | 7.0% |
| **Total** | **923.9** | **45,757** | **100%** |

**Key Findings:**
- **Carrots (both sizes) cause 45.5% of all warehouse losses** — this is the #1 priority for loss reduction
- **Tomatoes (A + B) cause 16.6%** of losses
- **Avocados (ripe + regular) cause 13.5%** of losses despite lower weight damage (higher per-Kg value)
- The top 3 product categories (carrots, tomatoes, avocados) account for **~75% of all warehouse losses**

---

## 7. Key Performance Indicators (KPIs)

| KPI | W1 | W3 (Peak) | W6 (Latest) | Change |
|-----|----|-----------|-------------|--------|
| Weekly Sales | 1,054,953 | 1,555,460 | 1,665,477 | +57.9% |
| Daily Run Rate | 4,661 | 5,408 | 5,419 | +16.3% |
| Warehouse Damage % | 7.88% | 1.23% | 0.62% | -92.1% ✅ |
| Arrival Damage % | 3.49% | 4.40% | 0.67% | -80.8% ✅ |
| Total Damage Cost | 120,000 | 87,496 | 21,529 | -82.1% ✅ |
| Target Achievement | — | — | 93.1% | — |
| B2B Sales | 5,755 | 1,590 | 2,396 | -58.4% |
| SGL Channel Sales | 1,989 | 3,748 | 9,731 | +389.5% ✅ |
| FMCG Sales | 1,716 | 1,783 | 1,966 | +14.6% |

---

## 8. Trend Analysis & Patterns

### 8.1 📈 Positive Trends
1. **Smart Souk / SGL channel explosion:** 389% growth from W1 to W6 validates the aggregator-first strategy. The SGL channel is becoming the dominant distribution method.
2. **Warehouse damage collapse:** From 83,142 ETB to 10,341 ETB per week — the single largest cost savings driver.
3. **Arrival damage improvement:** Dropped from 4.40% to 0.67% — the direct-ship model is dramatically improving produce quality.
4. **Revenue growth:** Overall sales trend is up 58% from W1 to W6.
5. **No un-picked orders:** W5 and W6 both show zero un-picked orders — fulfillment reliability improved.

### 8.2 📉 Concerning Trends
1. **Sales growth decelerating:** W5→W6 only 4.7% growth vs W2→W3's 39%. Momentum appears to be fading.
2. **Run rate declining from W5 to W6:** 5,997→5,419 is a 9.6% daily run rate decline — **alarming**.
3. **B2B revenue still recovering:** At 2,396 ETB, B2B is still 58% below W1 levels and missed W6 target by 16.2%.
4. **Missing W4 data:** The gap week (Feb 24–Mar 01 or Mar 02 depending on alignment) has no sales data but has a "target" row — this is a reporting gap that needs filling.
5. **Target consistently missed:** The weekly sales target of ~1,788,779 ETB has not been achieved in any reported week.

---

## 9. Strategic Alignment Check

Based on the March 2026 strategy vision document, here's how execution maps to data:

| Strategy Initiative | Status | Evidence |
|--------------------|--------|----------|
| Remove central warehouse | ✅ Progressing | Warehouse damage down 92% |
| Activate SGLs as pickup nodes | ✅ Working | SGL sales up 389% |
| Direct DC fulfillment (B2B) | ⚠️ Partial | B2B still below pre-shift levels |
| Push pickup over delivery | 📊 Unknown | No delivery vs pickup split in data |
| Diversified revenue (platform, logistics) | 🔍 Not visible | Revenue buckets not tracked in current reporting |

---

## 10. Recommendations

### Immediate (This Week)
1. **Fill W4 data gap** — Missing sales data for one week creates blind spots in trend analysis.
2. **Investigate W6 run rate decline** — Daily rate falling from 5,997 to 5,419 needs root cause analysis immediately.
3. **B2B recovery sprint** — B2B is 16% below target. Deploy HORECA captain outreach and recurring order incentives.

### Short-Term (2–4 Weeks)
4. **Carrot supply chain review** — Carrots cause 45.5% of warehouse losses. Consider sourcing from different suppliers, adjusting QC grading, or reducing carrot inventory volume.
5. **SGL target recalibration** — W6 SGL hit 9,542 vs 20,026 target (52% miss). Either increase incentives for SGLs or lower the target to be more realistic.
6. **Implement real-time ClickHouse dashboards** — Current reporting relies on manual CSV exports. The Phase 3 analytics page needs to connect to transactional data ASAP.

### Medium-Term (1–2 Months)
7. **Revenue bucket tracking** — The strategy defines 4 revenue streams (Trade Margin, Logistics/Service, Platform, Financing) but current reporting only shows aggregate sales. Need to track each separately.
8. **Delivery vs. Pickup split analysis** — No data on fulfillment mode preference. Critical for pricing the 3 Birr delivery fee.
9. **Smart Souk maturity ladder tracking** — The strategy defines Levels 0–3 for SGLs but data doesn't segment by maturity level.

---

## Data Limitations

- **Database access:** ClickHouse (via Superset) returned workflow tables, not business data. Supabase only has Mission Control internal tables.
- **Data freshness:** Analysis is based on the last available CSV export. Real-time data is not accessible.
- **Missing granularity:** No per-order data, no customer retention metrics, no AOV, no delivery vs. pickup split, no margin/cost-of-goods data.
- **Gap week:** W4 data is completely missing from the operational CSV.
- **"Total" row meaning uncertain:** The labeled "total" column (values 27K–42K) likely represents gross margin or net revenue but the exact definition is unclear from the CSV alone.

**Bottom line:** To properly analyze unit economics, customer cohorts, AOV, and growth rates, ChipChip needs a ClickHouse database with transactional tables (orders, order_items, customers, products) connected to the analytics pipeline.
