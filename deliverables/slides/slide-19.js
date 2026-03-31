const slideConfig = { type: 'content', index: 19, title: 'Risk Assessment Matrix' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  s.addText("RISK ASSESSMENT MATRIX", { x: 0.6, y: 0.3, w: 8, h: 0.4, fontSize: 12, fontFace: "Arial", color: "E53935", bold: true, charSpacing: 4, margin: 0 });
  s.addText("Severity-Ranked Risk Register", { x: 0.6, y: 0.65, w: 8, h: 0.55, fontSize: 30, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const risks = [
    { risk: "Financial Runway", severity: "CRITICAL", desc: "Burning 10.16M ETB vs 7.4M ETB revenue. Unsustainable beyond current runway.", mitigation: "CP1 auto-block, B2B migration, BNPL launch, SG&A reduction", color: "D32F2F" },
    { risk: "Technology Execution", severity: "HIGH", desc: "SettingsView non-functional, no CRM, no analytics, manual processes everywhere.", mitigation: "Prioritize enforcement systems, build CRM, real-time KPI dashboard", mitigation2: "Implement automated reconciliation", color: "E53935" },
    { risk: "BNPL Default Risk", severity: "HIGH", desc: "5-7% default risk in emerging markets. Unchecked defaults could destroy margins.", mitigation: "Short 7-14 day cycles, hard caps, auto-block on missed payments", mitigation2: "Start with highest-trust restaurants only", color: "E53935" },
    { risk: "SGL Churn", severity: "HIGH", desc: "Untracked drop-off in first 7 days. Commission dissatisfaction may reduce retention.", mitigation: "7-day automated onboarding, commission transparency dashboard", mitigation2: "Quality guarantee, tiered commission system", color: "E53935" },
    { risk: "B2B Pipeline Disruption", severity: "MEDIUM", desc: "B2B collapsed to zero in W2 during warehouse transition. Still 58% below W1 levels.", mitigation: "HORECA captain outreach, recurring order incentives, recovery sprint", color: "FF9800" },
    { risk: "Supplier Reliability", severity: "MEDIUM", desc: "Late delivery, wrong quality, wrong quantity damages ChipChip reputation.", mitigation: "Supplier Reputation Network, 5-gate QC, ≥3 suppliers per product", mitigation2: "Damage responsibility matrix", color: "FF9800" },
    { risk: "Macroeconomic/Regulatory", severity: "MEDIUM", desc: "Currency volatility, food inflation, regulatory uncertainty in Ethiopia.", mitigation: "Dynamic daily pricing, consignment model, multi-currency BNPL terms", color: "FF9800" },
    { risk: "Competitive Entry", severity: "LOW-MED", desc: "Larger players with deeper capital could enter food tech market.", mitigation: "Move fast on B2B + BNPL to deepen moat before competitors enter", color: "4CAF50" }
  ];

  for (let i = 0; i < risks.length; i++) {
    const y = 1.4 + i * 0.48;
    const isBg = i % 2 === 0;
    if (isBg) s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 9, h: 0.46, fill: { color: "FAFAFA" } });
    // Severity indicator
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.06, h: 0.46, fill: { color: risks[i].color } });
    s.addText(risks[i].risk, { x: 0.75, y, w: 1.6, h: 0.46, fontSize: 10, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0, valign: "middle" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.35, y: y + 0.07, w: 0.8, h: 0.3, fill: { color: risks[i].color, transparency: 60 }, rectRadius: 0.15 });
    s.addText(risks[i].severity, { x: 2.35, y: y + 0.07, w: 0.8, h: 0.3, fontSize: 8, fontFace: "Arial", color: risks[i].color, bold: true, margin: 0, align: "center", valign: "middle" });
    s.addText(risks[i].desc, { x: 3.2, y, w: 3.2, h: 0.46, fontSize: 10, fontFace: "Arial", color: "333333", margin: 0, valign: "middle" });
    s.addText(risks[i].mitigation, { x: 6.5, y, w: 3.1, h: 0.46, fontSize: 9, fontFace: "Arial", color: "555555", margin: 0, valign: "middle" });
  }

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("19", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-19-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
