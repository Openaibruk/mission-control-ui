# ChipChip Credit Financial Plan — QA Review Report

**QA Analyst:** Cinder
**Date:** 2026-03-31
**Artifact Reviewed:** `chipchip-credit-plan-analysis.md`
**Source Data:** [Google Sheet](https://docs.google.com/spreadsheets/d/1IGjkivDSdnTbajElaXzOGsjq8A7_zM16/edit)
**Status:** ✅ Analysis document validated with several critical corrections identified

---

## Executive Summary

The analysis document is **well-structured, covers the right risk categories, and its high-level conclusions are directionally correct**. However, I identified **1 critical finding the analysis missed entirely**, several minor numerical discrepancies, and areas where the analysis understates risks. Overall, the analysis is ~85% of the way to being audit-ready — it needs the FMCG credit paradox fixed and some risk recalibrations before it can be used for decision-making.

---

## Findings

### 🔴 CRITICAL

#### QA-C1: FMCG "Credit Margin" Is Not Credit Income (Source Sheet Error Not Flagged)

**Severity:** Critical — affects revenue model interpretation

**Finding:** The analysis document states FMCG has 0% credit exposure and lists FMCG credit margin as 891,204 ETB without noting the fundamental contradiction: **FMCG credits are ZERO for all 13 months, yet the sheet generates 891,204 ETB in "credit margin" (3% of FMCG revenue).**

This is mathematically impossible. You cannot earn interest on zero credit. Source data:
- FMCG Credits: 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 (all months)
- FMCG "Credit" Margin: 38,748 ETB/month × 13 = 891,204 ETB

**Root Cause:** The sheet's FMCG "credit margin" is actually **additional trade margin** (effectively a 3% markup masquerading as credit income). The FMCG true margin is 8% (5% trade + 3% "credit"), but since no credit is extended at all, this label is misleading and should be combined with trade margin.

**Impact:** If FMCG is not actually a credit product, then:
- Total credit exposure is **45,050,081 − 0 = still 45,050,081**, so the capital need analysis is unaffected
- But the *revenue classification* is wrong: the 891,204 ETB should be labeled trade margin, not credit margin
- This inflates the perceived "credit income diversification"

**Recommendation:** Reclassify FMCG margin as 8% trade margin (not 5% trade + 3% credit). Call out the sheet labeling issue explicitly.

---

### 🟠 HIGH

#### QA-H1: 1-ETB Rounding Errors Propagate to Margin Totals

**Severity:** High (minor financial impact, but signals precision issues in the source sheet)

**Finding:** Independent recalculation of source data reveals consistent 1-ETB rounding discrepancies in column totals:

| Component | Analysis Doc | Independent Calc | Diff |
|-----------|-------------|-----------------|------|
| B2B Revenue | 45,816,536 | 45,816,534 | −2 |
| SL Revenue | 13,740,767 | 13,740,768 | +1 |
| Total Revenue | 89,264,103 | 89,264,102 | −1 |
| B2B Credit Margin | 1,099,597 | 1,099,596 | −1 |
| SL Credit Margin | 419,843 | 419,842 | −1 |
| Total Credit Margin | 2,410,643 | 2,410,642 | −1 |
| Total Margin | 16,037,156 | 16,037,154 | −2 |

The source sheet has a **1-ETB formula error in Jan-27 total** (4,881,392 + 1,407,151 + 2,583,200 = 8,871,743, but sheet says 8,871,742). The analysis says "1 ETB rounding difference on Jan-27" — but this compounds through the credit column (Feb-27 total credits: calculated 5,785,458 vs sheet 5,785,459).

**Recommendation:** Note in the analysis that all discrepancies are within ±2 ETB of totals (<0.000002%) and are caused by formula rounding in the source sheet, not by the analysis itself.

---

#### QA-H2: B2B Credit Margin Is Actually 3.0% on Credits, Not 2.4%

**Severity:** High — changes risk sensitivity analysis

**Finding:** The analysis states B2B credit margin rate is 2.4%. Source sheet labels it "2.4%", but this is 2.4% of *revenue*. The actual interest rate being charged on credit is **3.0% of outstanding credits** (because 80% of revenue is on credit × 3.0% = 2.4% of revenue).

Verified: Every month's B2B credit margin ÷ B2B credits = exactly 3.0%.

**Why this matters:** If credit rate changes (e.g., market rates shift), the 3.0% figure is the correct base for sensitivity analysis. If ChipChip reduces credit from 80% to 70% of revenue, the credit margin drops to 2.1% of revenue (70% × 3%), not a proportional change.

**Recommendation:** Add a note distinguishing "rate on credits" (3.0%) vs "rate on revenue" (2.4%) to avoid confusion in scenario modeling.

---

#### QA-H3: Super Leader Credit Margin Rate Is 5.0% on Credits — Higher Than B2B

**Severity:** High — reverses margin attractiveness ranking

**Finding:** The analysis presents B2B (2.4%) and SL (1-4%) credit margins as separate figures without directly comparing their effective rates on credit. When normalized:
- **B2B: 3.0%** on outstanding credits (80% of revenue × 3% = 2.4% of revenue)
- **Super Leader: 5.0%** on outstanding credits (20/40/80% × 1/2/4% = constant 5% on credits)

**Super Leader credit is actually more profitable per birr extended than B2B credit**, despite lower per-revenue margins. This reverses the intuitive reading of the analysis.

**Recommendation:** Add a comparison table showing credit margin per unit of capital risked, to support better capital allocation decisions.

---

#### QA-H4: "45M ETB Total Credit Exposure" Misrepresents Capital Requirement

**Severity:** High — overstates cash requirement

**Finding:** The analysis states "Total credit exposure over 13 months is 45M ETB" and "Peak monthly exposure = 7.65M ETB." These are conceptually different:

- **45.05M ETB** = Sum of end-of-month credit balances across 13 months
- **7.65M ETB** = Actual peak outstanding credit at any point in time (Apr-27)

If credits have any turnover (repayments → re-lending), the actual working capital needed is **closer to the peak (~7.65M ETB), not the sum (45M ETB)**. The 45M figure double-counts capital that gets recycled.

**The analysis conflates these two figures** in the working capital discussion, which could lead to over-provisioning by a factor of ~6x.

**Recommendation:** Clarify in the analysis: peak capital requirement ≈ 7.65M ETB (the highest single-month balance), not 45M ETB. The 45M figure represents cumulative credit volume, not simultaneous capital need.

---

### 🟡 MEDIUM

#### QA-M1: Analysis Doc Monthly Revenue Table Truncates Detail

**Severity:** Medium

**Finding:** The analysis presents only 5 of 13 months in its revenue table (Apr, Jul, Oct, Jan, Apr). While this captures the trend, it:
- Misses the Jun-26 FMCG spike (+50%, the largest single-month growth event at 34.6%)
- Hides month-to-month growth pattern volatility
- The "MoM Growth" column shows Jun→Jul (11.2%) but the table header makes it look like Apr→Jul

**Recommendation:** Include all 13 months or flag that quarterly snapshots are being shown with a note about the Jun-26 growth spike.

---

#### QA-M2: NPL Sensitivity Range Is Too Narrow

**Finding:** Analysis suggests testing 3-8% NPL rates and calculates impact at 5%. For Ethiopian B2B credit without collateral (which is the assumption), **NPL rates of 8-15% are common for early-stage programs**. The 8% stress test may be insufficiently conservative.

**Recommendation:** Add a 12-15% "pessimistic case" alongside the 8% stress test. Also model what happens if NPLs cluster in the first 6 months (collection experience is lowest).

---

#### QA-M3: No Customer Concentration Risk Analysis

**Finding:** The analysis identifies B2B revenue concentration (51.3%) but doesn't consider whether that 51.3% comes from a few large clients or many small ones. If 40% of B2B revenue comes from 3 customers, loss of any one is catastrophic.

**Recommendation:** Flag customer concentration as a data gap — request B2B customer-level data and add to risk register.

---

#### QA-M4: No Cash Flow Timing Analysis

**Finding:** The analysis looks at revenue/margin per month but doesn't model cash flow timing. If B2B credits have 30-60 day terms, and the company needs to pay suppliers upfront, the cash gap could be 2-3 months of operating costs — which is more acute than the total margin analysis suggests.

**Recommendation:** Add cash flow waterfall: when does credit money go out vs come in?

---

### 🟢 LOW

#### QA-L1: Dollar-Sign Formatting Artifacts in Source Sheet

The source sheet contains rows labeled with dollar signs (`$2,438`, `$417.40`, etc.) implying USD conversions at exactly 155 ETB/USD. The analysis correctly ignores these and treats all figures as ETB. These artifacts in the source sheet suggest potential copy-paste or formatting issues but don't affect the analysis.

**Recommendation:** Note as a source sheet cleanliness issue, not an analysis error.

#### QA-L2: SL Credit Rate Change "Quadruples" Description

The analysis says SL credit rate "quadruples from start" (20% → 80%). While mathematically accurate, it's more precise to say it triples from the mid-point (40% → 80%). Minor semantic note.

---

## Risk Assessment Comparison

### Risks the Analysis Correctly Identified ✅

| # | Risk | Assessment |
|---|------|-----------|
| 1 | Working capital gap | ✅ Correctly identified, but capital need figure overstated (see QA-H4) |
| 2 | SL credit policy jumps | ✅ Correctly flagged as the biggest single-month policy change |
| 3 | B2B concentration (51.3%) | ✅ Correctly identified |
| 4 | No NPL provision | ✅ Critical and correct |
| 5 | No operating expenses | ✅ Critical and correct |
| 6 | FMCG step-growth pattern | ✅ Correctly questioned |
| 7 | No seasonality | ✅ Valid concern for Ethiopian market |
| 8 | No scenario analysis | ✅ Valid gap |

### Risks the Analysis Misses ❌

| # | Risk | Severity | Notes |
|---|------|----------|-------|
| 9 | FMCG credit label error | Critical | 891K ETB "credit margin" on zero credits (QA-C1) |
| 10 | Customer concentration | High | B2B may be 3-5 large buyers |
| 11 | Cash flow timing gap | High | Credit terms vs. supplier payments |
| 12 | FX risk (if suppliers are imported) | Medium | FMCG may include imported goods |
| 13 | Regulatory risk | Medium | Ethiopian credit/lending regulations may apply |
| 14 | SL credit rate = 5% (higher than B2B's 3%) | Medium | Changes capital allocation story |

---

## Math Audit Summary

| Check | Status |
|-------|--------|
| Revenue totals | ✅ Correct (±2 ETB rounding) |
| Revenue percentages | ✅ Correct (51.3%, 33.3%, 15.4%) |
| Credit calculations | ✅ Correct (80% B2B, 0% FMCG, 20/40/80% SL) |
| Credit ratio trend (31%→63%) | ✅ Correct |
| Trade margin rates | ✅ Correct (25%, 5%, 5%) |
| Credit margin rates | ⚠️ Correctly copied from sheet but misleading for FMCG (QA-C1) and normalized rate not identified (QA-H2, QA-H3) |
| Total margin: 16.0M ETB | ✅ Correct (16,037,154 vs stated 16,037,156: 2 ETB off) |
| Blended margin: 17.97% | ✅ Correct |
| Growth rates | ✅ Correct |
| Working capital figure | ⚠️ Peak = 7.65M, sum = 45M — analysis conflates them (QA-H4) |

---

## Recommendations to Improve the Analysis Document

### Must Fix Before Distribution
1. **Fix FMCG credit margin labeling** (QA-C1) — either explain the paradox or reclassify as trade margin
2. **Clarify capital requirement**: peak = 7.65M (not 45M) for front-loaded capital planning (QA-H4)
3. **Normalize credit margin rates** to "rate on credits" basis for comparison (QA-H2, QA-H3)

### Should Add
4. Add customer concentration risk discussion (if data available)
5. Add cash flow timing analysis (credit terms × supplier payment terms)
6. Expand NPL stress test to 12-15% pessimistic case
7. Note source sheet formula errors (1-ETB inconsistencies) for audit trail

### Nice to Have
8. Full 13-month revenue table or clear quarterly snapshot labeling
9. Flag source sheet dollar-sign artifacts for cleanup

---

## Final Verdict

**Analysis Document Quality: B+ (85/100)**

| Dimension | Score | Notes |
|-----------|-------|-------|
| Mathematical accuracy | A- | All numbers verified; ±2 ETB rounding errors from source |
| Risk identification | B | Missed FMCG credit paradox, customer concentration, cash flow timing |
| Recommendations | A | Actionable, prioritized, well-structured across time horizons |
| Risk prioritization | B+ | Good severity tiers; misses some critical risks |
| Source data verification | A+ | Every claim cross-checked against raw sheet data |
| Overall readability | A | Clear, concise, well-formatted |

**The analysis is fit for internal discussion but should not be used for financing or investment decisions until QA-C1 (FMCG credit paradox) and QA-H4 (capital requirement clarification) are addressed.**

---

*QA completed by Cinder | 2026-03-31 | Verified against all 78 numerical data points in source Google Sheet*
