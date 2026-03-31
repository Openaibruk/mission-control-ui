const slideConfig = { type: 'content', index: 23, title: 'Recommendation 1' };
function createSlide(pres, theme) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.12, h: 5.625, fill: { color: "E53935" } });
  // Number badge
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fill: { color: "E53935" } });
  s.addText("01", { x: 0.6, y: 0.5, w: 0.7, h: 0.7, fontSize: 20, fontFace: "Arial", color: "FFFFFF", bold: true, margin: 0, align: "center", valign: "middle" });
  s.addText("FIX THE FINANCIAL ENGINE", { x: 1.5, y: 0.55, w: 6, h: 0.6, fontSize: 32, fontFace: "Arial", color: "1A1A1A", bold: true, margin: 0 });

  const steps = [
    { title: "Enforce CP1 Auto-Block", desc: "Zero-tolerance: no SKU can ship below margin floor. No emotional overrides, no exceptions. System-enforced at checkout." },
    { title: "Kill Unprofitable SKUs", desc: "Any product with negative CP1 for 2 consecutive weeks gets automatically suspended. Carrots (45.5% loss) are priority #1." },
    { title: "Accelerate B2B Migration", desc: "Every restaurant moved from B2C saves margin. Target 40 restaurants by end of Q2 with dedicated sales assignment." },
    { title: "Aggressive SG&A Reduction", desc: "Target 8M ETB/month burn by Q2 end: -35% marketing, -15% warehouse, -10% salary per KPI booklet." },
    { title: "Launch BNPL Pilot", desc: "Top 10 restaurants. 7-day cycle, 3% fee, hard credit caps. Auto-block on defaults. First step toward 35% revenue target." }
  ];

  for (let i = 0; i < 5; i++) {
    const y = 1.55 + i * 0.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 9, h: 0.6, fill: { color: i % 2 === 0 ? "FFF5F5" : "F8F8F8" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.08, h: 0.6, fill: { color: "E53935" } });
    s.addText(steps[i].title, { x: 0.8, y: y + 0.02, w: 3, h: 0.25, fontSize: 14, fontFace: "Arial", color: "E53935", bold: true, margin: 0 });
    s.addText(steps[i].desc, { x: 0.8, y: y + 0.27, w: 8.5, h: 0.3, fontSize: 11, fontFace: "Arial", color: "444444", margin: 0 });
  }

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.2, w: 8, h: 0.3, fill: { color: "FFF5F5" }, rectRadius: 0.08 });
  s.addText("Target: CP1 ≥ +5% by end of Q1, company breakeven by Q4 2026", { x: 0.6, y: 5.2, w: 8, h: 0.3, fontSize: 11, fontFace: "Arial", color: "E53935", bold: true, margin: 0, align: "center", valign: "middle" });

  s.addShape(pres.shapes.OVAL, { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fill: { color: "E53935" } });
  s.addText("23", { x: 9.3, y: 5.1, w: 0.4, h: 0.4, fontSize: 10, fontFace: "Arial", color: "FFFFFF", bold: true, align: "center", valign: "middle" });
  return s;
}
if (require.main === module) { const p = require("pptxgenjs"); const pr = new p(); pr.layout = 'LAYOUT_16x9'; createSlide(pr, {}); pr.writeFile({ fileName: "slide-23-preview.pptx" }); }
module.exports = { createSlide, slideConfig };
