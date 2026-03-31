# ChipChip Strategic Review — QA Review Report

**Reviewer:** Cinder (QA)  
**Date:** March 31, 2026  
**Deliverables Reviewed:**
1. `chipchip-strategic-review-q1-2026.md` (Strategic Review Document)
2. `chipchip-strategic-review-presentation.pptx` (Presentation — 34 slides)

---

## Overall Verdict

| Deliverable | Verdict |
|-------------|---------|
| Strategic Review Document (.md) | **PASS WITH MINOR NOTES** |
| Presentation (.pptx) | **NEEDS REVISION** |

---

# Deliverable 1: Strategic Review Document (.md)

## 1. Completeness ✅

The document is exceptionally thorough. All major sections are present and substantive:

- Executive Summary with clear KPI snapshot
- Company Vision & Positioning (5-platform architecture, North Star)
- Business Model Deep Dive (revenue streams, unit economics, gate pricing)
- Operational Performance (6-week trends, warehouse, arrival damage, product-level losses)
- Channel Performance (B2B, SGL, D2C, BNPL status)
- Product-Level Insights (category performance, pricing intelligence)
- Competitive Landscape & Moat Analysis
- Risk Assessment (8 risks, severity-graded)
- 15 Strategic Recommendations across Immediate/Medium/Long-term horizons
- Financial Projections with quarterly path to profitability
- Implementation Timeline (Phase 0–3, actionable checklists)

**Note:** The document is 15 well-structured sections with tables, data, analysis, and recommendations throughout. No major gaps found.

## 2. Data Accuracy ✅ (with minor internal inconsistency)

Core financial figures are internally consistent throughout the document:

- Monthly Sales: 7.4M ETB ✅
- Gross Margin: -16.68% (improved from -45.49%) ✅
- Monthly Burn: 10.16M ETB (down 48%) ✅
- B2B Revenue: 16% from <1% of orders ✅
- Warehouse Damage: 7.88% → 0.62% (92% reduction) ✅
- SGL Growth: 389% ✅
- Monthly Orders: 83,731 ✅
- Volume: 153,989 kg ✅
- Sales/Order: 88 ETB ✅

**Minor inconsistency found:**
- The per-KG unit economics table shows a ~2 ETB/kg net share. At 153,989 kg and ~2 ETB/kg, that's ~308,000 ETB in platform-level trade margin for February. However, the revenue build table (near end) shows ~3.7M for Trade Margin fresh in Q1 Actual — this likely includes the full gross spread (~6 ETB/kg × volume) before commission, but the document doesn't make that reconciliation explicit enough. The reader might be confused about whether 3.7M = gross spread or net share.

## 3. Actionability ✅ (Strength area)

Recommendations are excellent in actionability:

- Specific targets (40 restaurants, 100 SGLs, CP1 ≥ +5%)
- Phased rollout plans with timelines
- Revenue impact projections for each initiative
- Clear prioritization: P0 bugs, P1 enforcement, P2 analytics, P3 automation
- No vague "improve" or "optimize" without quantification

## 4. Professional Quality ✅

- Well-organized with clear section hierarchy
- Tables used effectively for data presentation
- Executive summary provides instant grasp of key findings
- Data sources cited
- Classification marking (Confidential) included
- Conclusion is punchy and actionable

**Minor notes:**
- W4 data gap is acknowledged but the document would benefit from noting *why* the gap exists or what was done to approximate it
- The document is very long for a "review" — some decision-makers might struggle with length. An accompanying 1-page executive brief would help.

## Verdict: PASS WITH MINOR NOTES

---

# Deliverable 2: Presentation (.pptx)

## 1. Completeness ✅

34 slides covering 10 sections. Good coverage:

| Section | Slides | Status |
|---------|--------|--------|
| Title / TOC | 1–2 | ✅ |
| Executive Summary | 3 | ✅ |
| Company Vision & Identity | 4–5 | ✅ |
| Business Model & Revenue | 6–7 | ✅ |
| Performance Analytics | 8–11 | ✅ |
| Channel & Product Insights | 12–16 | ✅ |
| Competitive Landscape | 17–18 | ✅ |
| Risk Assessment | 19–20 | ✅ |
| What's Working / Issues | 21–22 | ✅ |
| Strategic Recommendations | 23–29 | ✅ |
| Targets & Projections | 30–32 | ✅ |
| Team & Next Steps | 33–34 | ✅ |

**Note:** 34 slides is long for a board/investor presentation. A tighter 20-slide version would be more impactful.

## 2. Data Accuracy ⚠️ — CRITICAL ERROR FOUND

### ERROR 1 — BNPL Revenue Math (Slide 25) 🚨

Slide 25 states:
> "20 restaurants × 4 orders/month × **50,000** ETB × 3% fee = 120,000 ETB/month"

This is **mathematically wrong.** The actual calculation is:
- 20 × 4 × 5,000 × 0.03 = **12,000 ETB/month** (not 120,000)

To get 120,000 ETB/month, the formula should be either:
- 20 × 4 × **50,000** × 0.03 = **120,000** ✅ — but this implies average B2B orders of 50,000 ETB, which contradicts data elsewhere showing ~5,000 ETB per order
- OR: 20 × 4 × 5,000 × 0.30 = 120,000 ✅ — but the fee is 3%, not 30%
- OR: **200** restaurants × 4 × 5,000 × 0.03 = 120,000 ✅ — but the plan targets 20, not 200

The slide has **50,000 written where it should say 5,000**, but then the result of 120,000 doesn't match either value. The math is internally inconsistent. This is a **credible, critical error** in the single most important financial initiative slide.

### ERROR 2 — SGL Revenue vs B2B Revenue Comparison (Slide 14)

Slide 14 shows the B2B revenue impact formula as:
> "40 restaurants × avg 8,000 ETB/month = 320,000 ETB monthly B2B revenue"

But earlier in the document (Slide 12 / MD document), B2B orders are ~5,000 ETB each and restaurants do ~4 orders/month = ~20,000 ETB/month per restaurant. 320,000 ETB for 40 restaurants = 8,000 ETB/restaurant/month is actually consistent if orders are smaller than the document suggests elsewhere. However, 8,000 ETB/month per restaurant seems low compared to the 5,000 ETB/order × 4 orders = 20,000 ETB/month suggested elsewhere. This inconsistency should be clarified.

### ERROR 3 — Growth Projection Numbers Diverge from Projections Table (Slide 31 vs MD Document)

The MD document projects:

| Metric | Q2 Target | Q3 Target | Q4 Target |
|--------|-----------|-----------|-----------|
| Revenue | 10.1M ETB | 11.2M ETB | 12.8M ETB |
| CP1 | +3% to +5% | +5% to +8% | +8% to +12% |
| Orders | ~100K+ | N/A | N/A |
| Active SGLs | 70+ | N/A | 100 |

But Slide 31 shows **much more aggressive** projections:

| Metric | Q2 | Q3 | Q4 |
|--------|----|----|----|
| Sales | **12M** ETB | **20M** ETB | **30M** ETB |
| Margin | +2% | +8% | +12% |
| Orders | 100,000 | 130,000 | 160,000 |
| Active SGLs | 60 | 80 | 100 |

**The slide jumps from 12M in Q2 to 20M in Q3 to 30M in Q4 — far more aggressive than the MD's 10.1M → 11.2M → 12.8M.** This divergence is not explained and presents a fundamentally different financial outlook. A decision-maker reviewing the PPTX alone would expect 3x revenue growth by Q4, while an investor reading the MD would expect 1.7x. **This needs reconciliation.**

### ERROR 4 — Slide 30 Targets Also Inconsistent

Slide 30 says:
- Monthly Sales: 7.4M → **12M** (+62%)
- Monthly Burn: 10.16M → **<7.4M** (-27%)

But the MD's Q2 targets say:
- Monthly Sales: **10M ETB**
- Monthly Burn: **8M ETB**

**12M vs 10M for Q2 revenue is a 20% difference on a key target.**

### Minor Data Inconsistency — SGL Count Range (Slide 3, 12, 13, 27, 30)

Multiple slides show SGL count as "~35-100 active" which is ambiguous. The MD document clarifies: ~35 active, 260+ in database, target 100. "~35-100" reads as if the current range is 35 to 100, which is misleading.

## 3. Actionability ✅

Recommendations in slides 23–29 are specific and well-prioritized:
- CP1 auto-block with zero-tolerance policy
- B2B migration with 5-step action plan
- BNPL phased rollout with safeguards
- Technology priority stack (P0–P3)
- Gantt-style timeline on slide 29

The slide format compresses well without losing specificity.

## 4. Professional Quality ⚠️

**Positive:**
- Clean slide structure with clear numbering
- Good use of data callouts and comparison layouts
- Section dividers for navigation
- Confidential marking on title slide ✅
- Team credits on title and closing slides

**Areas of concern:**
- **34 slides is excessive** for a board presentation; most would expect 15–20. Several slides could be merged (e.g., Slides 8+9, 21+22, 23+24).
- **Slide 21 ("What's Working Well")** is redundant with content already on Slides 11 and 13.
- Slide text is dense in places — slides 7, 17, 19, 23-24 each pack 10+ text elements onto one slide.

## 5. Brand Compliance 🚨 — NEEDS SIGNIFICANT WORK

**This is the most serious issue with the PPTX.**

ChipChip brand guidelines (from the project) require:
- **Colors:** White / Red / Black palette
- **Fonts:** Montserrat
- **Design elements:** Curves

**Actual PPTX uses:**
- **Theme:** Default Microsoft **Office Theme** (not custom)
- **Primary fonts:** **Calibri Light** (headings), **Arial** (body) — **NOT Montserrat**
- **Accent colors:** Standard Office palette — Blue (#4472C4), Orange (#ED7D31), Grey (#A5A5A5), Gold (#FFC000), Blue (#5B9BD5), Green (#70AD47) — **NO Red branding, NO black/white color system**
- **No curves or organic shapes** detected in slide layout XML — standard rectangular layouts
- **No ChipChip logo** embedded (no media files found in ppt/media)
- **No custom slide master** tailored to ChipChip branding

The presentation looks like it was generated with a standard PptxGenJS template using default Office styling rather than ChipChip's brand system. If this is presented to stakeholders, investors, or partners, **the lack of brand identity will signal lack of polish and professionalism**.

---

# Summary of Required Fixes

## Must Fix Before Distribution (Blocking)

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 1 | BNPL math is wrong (50,000 should be 5,000, result doesn't match) | Slide 25 | **CRITICAL** |
| 2 | Q2-Q4 growth projections don't match MD document (30M vs 12.8M Q4) | Slides 30-31 | **CRITICAL** |
| 3 | Brand identity completely absent — wrong fonts, colors, no logo, no curves | Entire PPTX | **HIGH** |
| 4 | No Montserrat, no red/black/white palette | Entire PPTX | **HIGH** |
| 5 | Q2 sales targets: 12M (slide) vs 10M (doc) | Slide 30 | **HIGH** |

## Should Fix (Important)

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 6 | SGL count shown as "~35-100" (ambiguous) | Slides 3, 27, 30 | Medium |
| 7 | B2B revenue per-restaurant figure inconsistent | Slides 14 vs 12/MD | Medium |
| 8 | 34 slides is too long; trim to ~20 | Structure | Medium |
| 9 | Slide 21 redundant with Slides 11+13 | Slide 21 | Low |

## Optional Improvements

| # | Issue | Location |
|---|-------|----------|
| 10 | Add ChipChip logo to header/footer | Throughout |
| 11 | Add slide transitions or subtle animations | Design |
| 12 | Include W4 data gap explanation | Slide 8 |
| 13 | 5-Platform Architecture not visualized (only in MD) | Missing from PPTX |

---

# Final Assessments

| Deliverable | Verdict | Confidence |
|-------------|---------|------------|
| **chipchip-strategic-review-q1-2026.md** | ✅ **PASS WITH MINOR NOTES** | High |
| **chipchip-strategic-review-presentation.pptx** | 🚨 **NEEDS REVISION** | High |

The MD document is strong, data-rich, and ready for distribution. The presentation has critical factual errors (wrong math, mismatched projections), significant brand non-compliance (no Montserrat, no ChipChip colors, no logo, no curves), and is bloated at 34 slides. **The PPTX should not be distributed until the math errors are corrected and brand compliance is achieved.**

---

*QA Review by Cinder | March 31, 2026*
